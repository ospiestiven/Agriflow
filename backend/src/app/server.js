// Bootstrap del servidor Express y registro de rutas principales.
import express from "express";
import cors from "cors";

import env from "../config/env.js";
import { corsOptions } from "../config/cors.js";
import { connectDb } from "../db/pool.js";
import { registerSse, sse } from "../infra/sse/sse.js";
import { ensureDefaultSensors } from "../modules/sensors/sensors.repo.js";
import { createHealthRouter } from "../modules/health/health.routes.js";
import { createReadingsRouter } from "../modules/readings/readings.routes.js";

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

const pool = await connectDb();
const sensorIds = await ensureDefaultSensors(pool);

registerSse(app);

app.get("/", (req, res) =>
  res.send("AgriFlow backend OK. Usa /health, /events y /simulate/reading")
);

app.use("/health", createHealthRouter({ pool }));
app.use(
  "/",
  createReadingsRouter({
    pool,
    sensorIds,
    sse,
    mlUrl: env.ML_URL,
  })
);

const PORT = Number(env.PORT) || 3000;
app.listen(PORT, () => console.log(`[Backend] http://localhost:${PORT}`));
