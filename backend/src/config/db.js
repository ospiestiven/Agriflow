import env from "./env.js";

const trustedConnection =
  String(env.DB_TRUSTED_CONNECTION).toLowerCase() !== "false";
const trustServerCertificate =
  String(env.DB_TRUST_SERVER_CERT).toLowerCase() !== "false";
const encrypt = String(env.DB_ENCRYPT).toLowerCase() === "true";

export const dbConfig = {
  server: env.DB_SERVER,
  database: env.DB_NAME,
  driver: env.DB_DRIVER,
  options: {
    trustedConnection,
    instanceName: env.DB_INSTANCE,
    trustServerCertificate,
    encrypt,
  },
};
