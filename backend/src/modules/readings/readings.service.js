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

export async function fetchLatestReadings(pool, limit = 200) {
  const safeLimit = Math.min(Math.max(Number(limit) || 200, 1), 1000);
  const result = await pool
    .request()
    .input("limit", sql.Int, safeLimit)
    .query(
      `SELECT TOP (@limit)
         l.fecha_lectura,
         s.nombre,
         s.tipo,
         l.valor
       FROM Lecturas l
       INNER JOIN Sensores s ON s.id_sensor = l.id_sensor
       ORDER BY l.fecha_lectura DESC`
    );
  return result.recordset || [];
}

function normalizeTs(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().replace("Z", "");
}

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
