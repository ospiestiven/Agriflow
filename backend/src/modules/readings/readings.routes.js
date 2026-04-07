// Rutas para lecturas y simulación.
import { Router } from "express";
import {
  buildSnapshots,
  fetchReadings,
  insertReading,
} from "./readings.service.js";
import { callMl } from "../ml/ml.service.js";
import { nowISO } from "../../utils/time.js";

// funcion para crear el router de lecturas, inyectando dependencias como pool de DB, IDs de sensores, función SSE y URL de ML.
export function createReadingsRouter({ pool, sensorIds, sse, mlUrl }) {
  const router = Router();

  router.get("/readings", async (req, res) => {
    const { limit, start, end, sensor, page, pageSize } = req.query;
    const usePaging = page || pageSize;
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const pageSizeNumber = Math.min(
      Math.max(parseInt(pageSize, 10) || 20, 1),
      200
    );
    const fetchLimit = usePaging ? 5000 : limit;

    const rows = await fetchReadings(pool, {
      limit: fetchLimit,
      start,
      end,
      sensor,
    });
    const snapshots = buildSnapshots(rows);
    const total = snapshots.length;

    let items = snapshots;
    let totalPages = 1;
    if (usePaging) {
      totalPages = Math.max(Math.ceil(total / pageSizeNumber), 1);
      const safePage = Math.min(pageNumber, totalPages);
      const startIndex = (safePage - 1) * pageSizeNumber;
      items = snapshots.slice(startIndex, startIndex + pageSizeNumber);
      res.json({
        items,
        total,
        page: safePage,
        pageSize: pageSizeNumber,
        totalPages,
      });
      return;
    }

    res.json({ items, total, page: 1, pageSize: items.length, totalPages });
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
      // si ML no estÃ¡, seguimos
    }

    res.json({ ok: true, stored: true, ts, ml });
  });

  return router;
}
