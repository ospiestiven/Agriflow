// Servicios de lecturas y mapeo desde la BD.
import sql from "mssql/msnodesqlv8.js";

export async function insertReading(pool, { id, valor, ts }) {
  await pool
    .request()
    .input("id", id)
    .input("valor", valor)
    .input("ts", ts)
    .query(
      `INSERT INTO Lecturas (id_sensor, valor, fecha_lectura) VALUES (@id, @valor, @ts)`
    );
}
// Función para obtener lecturas filtradas por fecha/sensor y con límite opcional.
export async function fetchReadings(
  pool,
  { limit, start, end, sensor } = {}
) {
  const safeLimit = Math.min(Math.max(Number(limit) || 200, 1), 5000);
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  const safeStart =
    startDate && !Number.isNaN(startDate.getTime()) ? startDate : null;
  const safeEnd = endDate && !Number.isNaN(endDate.getTime()) ? endDate : null;
  const sensorLike = sensor ? `%${sensor}%` : null;

  const request = pool
    .request()
    .input("limit", sql.Int, safeLimit)
    .input("start", sql.DateTime2, safeStart)
    .input("end", sql.DateTime2, safeEnd)
    .input("sensor", sql.NVarChar, sensorLike);

  const query = `
    SELECT TOP (@limit)
      l.fecha_lectura,
      s.nombre,
      s.tipo,
      l.valor
    FROM Lecturas l
    INNER JOIN Sensores s ON s.id_sensor = l.id_sensor
    WHERE (@start IS NULL OR l.fecha_lectura >= @start)
      AND (@end IS NULL OR l.fecha_lectura <= @end)
      AND (@sensor IS NULL OR s.nombre LIKE @sensor OR s.tipo LIKE @sensor)
    ORDER BY l.fecha_lectura DESC`;

  const result = await request.query(query);
  return result.recordset || [];
}

// Función para construir snapshots a partir de las filas obtenidas de la BD, normalizando timestamps y mapeando nombres de sensores a claves legibles.
function normalizeTs(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().replace("Z", "");
}
// mapea nombres de sensores a claves legibles, basada en palabras clave en el nombre y tipo del sensor.
function mapSensorNameToKey(name, tipo) {
  const n = (name || "").trim().toLowerCase();
  const t = (tipo || "").trim().toLowerCase();
  const text = `${n} ${t}`.trim();
  if (!n) return null;
  if (text.includes("humedad") && text.includes("suelo")) return "soilMoisture";
  if (text.includes("temperatura") && text.includes("humedad")) return "airTemp";
  if (text.includes("temp") || text.includes("temperatura") || text.includes("dht11"))
    return "airTemp";
  if (text.includes("humedad ambiental") || text.includes("humedad aire"))
    return "airHumidity";
  if (text.includes("luz") || text.includes("luminosidad")) return "light";
  if (text.includes("lluvia")) return "rainRaw";
  if (text.includes("nivel")) return "waterLevel";
  if (text.includes("ph")) return "soilPH";
  return null;
}

//construye snapshots a partir de las filas obtenidas de la BD, normalizando timestamps y mapeando nombres de sensores a claves legibles.
export function buildSnapshots(rows) {
  const map = new Map();
  for (const row of rows) {
    const ts = normalizeTs(row.fecha_lectura);
    if (!ts) continue;
    const key = mapSensorNameToKey(row.nombre, row.tipo);
    if (!key) continue;

    if (!map.has(ts)) map.set(ts, { ts, deviceId: "db" });
    const entry = map.get(ts);
    entry[key] = row.valor;
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.ts) - new Date(b.ts)
  );
}
