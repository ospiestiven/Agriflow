import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: process.env.PORT || "3000",
  ML_URL: process.env.ML_URL || "http://127.0.0.1:8001",

  DB_SERVER: process.env.DB_SERVER || "localhost",
  DB_NAME: process.env.DB_NAME || "AgriFlowDB2",
  DB_DRIVER: process.env.DB_DRIVER || "msnodesqlv8",
  DB_INSTANCE: process.env.DB_INSTANCE || "SQLEXPRESS",
  DB_TRUSTED_CONNECTION: process.env.DB_TRUSTED_CONNECTION ?? "true",
  DB_TRUST_SERVER_CERT: process.env.DB_TRUST_SERVER_CERT ?? "true",
  DB_ENCRYPT: process.env.DB_ENCRYPT ?? "false",
};

export default env;
