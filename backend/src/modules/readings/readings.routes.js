import { Router } from "express";
import {
  buildSnapshots,
  fetchLatestReadings,
  insertReading,
} from "./readings.service.js";
import { callMl } from "../ml/ml.service.js";
import { nowISO } from "../../utils/time.js";

export function createReadingsRouter({ pool, sensorIds, sse, mlUrl }) {
  const router = Router();

  router.get("/readings", async (req, res) => {
    const limit = req.query.limit;
    const rows = await fetchLatestReadings(pool, limit);
    const items = buildSnapshots(rows);
    res.json({ items });
  });

  router.post("/simulate/reading", async (req, res) => {
    const o = req.body || {};
    const ts = nowISO();
    const s = o.sensors || {};

    if (typeof s.soilMoisture === "number")
      await insertReading(pool, {
        id: sensorIds.idHumSuelo,
        valor: s.soilMoisture,
        ts,
      });

    if (typeof s.airTemp === "number")
      await insertReading(pool, {
        id: sensorIds.idTempAmb,
        valor: s.airTemp,
        ts,
      });

    if (typeof s.light === "number")
      await insertReading(pool, {
        id: sensorIds.idLuz,
        valor: s.light,
        ts,
      });

    if (typeof s.rainRaw === "number")
      await insertReading(pool, {
        id: sensorIds.idLluvia,
        valor: s.rainRaw,
        ts,
      });

    sse("reading", { ts, deviceId: o.deviceId || "sim", ...s });

    let ml = null;
    try {
      ml = await callMl({
        mlUrl,
        payload: {
          deviceId: o.deviceId || "sim",
          ts,
          features: {
            soilMoisture: s.soilMoisture,
            airTemp: s.airTemp,
            flowLpm: s.flowLpm || 0,
            soilPH: s.soilPH || 7,
          },
        },
      });
      sse("ml", ml);
    } catch (e) {
      // si ML no está, seguimos
    }

    res.json({ ok: true, stored: true, ts, ml });
  });

  return router;
}
