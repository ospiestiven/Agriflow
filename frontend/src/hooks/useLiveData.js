// Hook para lecturas en vivo y alertas.
import { useCallback, useEffect, useMemo, useState } from "react";
import { createEventSource, fetchReadings } from "../services/api.js";

export function useLiveData() {
  const [reading, setReading] = useState(null);
  const [ml, setMl] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const ev = createEventSource();
    ev.onopen = () => setStatus("connected");
    ev.onerror = () => setStatus("error");
    ev.addEventListener("reading", (e) => {
      const next = JSON.parse(e.data);
      setReading(next);
      setHistory((prev) => {
        const merged = [...prev, next];
        return merged.length > 30 ? merged.slice(-30) : merged;
      });
    });
    ev.addEventListener("ml", (e) => setMl(JSON.parse(e.data)));
    return () => ev.close();
  }, []);

  const loadFromDb = useCallback(async (limit = 200) => {
    const data = await fetchReadings(limit);
    const items = Array.isArray(data?.items) ? data.items : [];
    if (!items.length) return false;
    setHistory(items);
    setReading(items[items.length - 1]);
    return true;
  }, []);

  const alerts = useMemo(() => {
    if (!reading) return [];
    const items = [];
    if (typeof reading.soilMoisture === "number") {
      if (reading.soilMoisture < 40) {
        items.push({
          level: "crit",
          message: "Humedad baja: activar riego recomendado.",
        });
      } else if (reading.soilMoisture >= 60) {
        items.push({
          level: "ok",
          message: "Humedad estable: riego no requerido.",
        });
      }
    }
    if (typeof reading.airTemp === "number") {
      if (reading.airTemp > 30) {
        items.push({
          level: "warn",
          message: "Temperatura alta: aumentar minutos de riego.",
        });
      } else if (reading.airTemp < 15) {
        items.push({
          level: "warn",
          message: "Temperatura baja: reducir minutos de riego.",
        });
      }
    }
    return items;
  }, [reading]);

  return { reading, ml, status, history, alerts, loadFromDb };
}
