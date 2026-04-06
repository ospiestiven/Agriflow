// Inicializa el pool de conexión a SQL Server.
import sql from "mssql/msnodesqlv8.js";
import { dbConfig } from "../config/db.js";

export async function connectDb() {
  const pool = await sql.connect(dbConfig);
  console.log("[DB] Conectado (Windows Auth + instanceName)");
  return pool;
}
