import env from "./env.js";

const trustedConnection =
  String(env.DB_TRUSTED_CONNECTION).toLowerCase() !== "false";

export const dbConfig = {
  server: env.DB_SERVER,
  database: env.DB_NAME,
  driver: env.DB_DRIVER,
  options: {
    trustedConnection,
    instanceName: env.DB_INSTANCE,
  },
};
