// Repositorio de sensores y creación de registros base.

//
async function ensureSensor(pool, nombre, tipo, pin, unidad) {
  const r = await pool
    .request()
    .input("nombre", nombre)
    .query(`SELECT TOP 1 id_sensor FROM Sensores WHERE nombre=@nombre`);
  if (r.recordset.length) return r.recordset[0].id_sensor;

  const ins = await pool
    .request()
    .input("nombre", nombre)
    .input("tipo", tipo)
    .input("pin", pin)
    .input("unidad", unidad)
    .query(`INSERT INTO Sensores (nombre, tipo, pin, unidad_medida)
            OUTPUT INSERTED.id_sensor
            VALUES (@nombre, @tipo, @pin, @unidad)`);
  return ins.recordset[0].id_sensor;
}

//  para asegurar que los sensores base existen en la BD, creando registros si es necesario, y retornando sus IDs.
export async function ensureDefaultSensors(pool) {
  const idHumSuelo = await ensureSensor(
    pool,
    "Humedad Suelo",
    "Humedad",
    "A0",
    "%"
  );
  const idTempAmb = await ensureSensor(
    pool,
    "Temp Aire DHT11",
    "Temperatura",
    "D4",
    "°C"
  );
  const idLuz = await ensureSensor(pool, "Luz", "Luminosidad", "A1", "raw");
  const idLluvia = await ensureSensor(
    pool,
    "Lluvia",
    "Humedad Superficie",
    "A2",
    "raw"
  );

  return { idHumSuelo, idTempAmb, idLuz, idLluvia };
}
