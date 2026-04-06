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
