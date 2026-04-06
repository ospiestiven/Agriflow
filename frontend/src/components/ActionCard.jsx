// Tarjeta de acciones para simulación y recarga.
import { useState } from "react";
import { simulateReading } from "../services/api.js";

// Renderiza la tarjeta principal de acciones del dashboard.
export default function ActionCard({ onLoadDb }) {
  const [loading, setLoading] = useState(false);
  const [canLoadDb, setCanLoadDb] = useState(false);

  // Genera un número aleatorio dentro de un rango.
  function rand(min, max, decimals = 0) {
    const value = Math.random() * (max - min) + min;
    return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
  }

  // Envía una lectura simulada y refresca desde la BD.
  async function simulateOne() {
    setLoading(true);
    const soilMoisture = rand(30, 70, 1);
    const airTemp = rand(18, 35, 1);
    const light = rand(200, 900, 0);
    const rainRaw = rand(200, 900, 0);
    await simulateReading({
      deviceId: "sim-ui",
      sensors: { soilMoisture, airTemp, light, rainRaw },
    });
    setCanLoadDb(true);
    if (onLoadDb) await onLoadDb();
    setLoading(false);
  }

  // Recarga manualmente las lecturas desde la BD.
  async function loadFromDb() {
    if (!onLoadDb) return;
    setLoading(true);
    await onLoadDb();
    setLoading(false);
  }

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Acciones</h3>
        <span className="chip chip-accent">Simulador</span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        Genera una lectura de prueba y dispara la IA para validar el flujo.
      </p>
      <button
        className="btn-primary mt-5"
        onClick={simulateOne}
        disabled={loading}
      >
        Enviar lectura simulada
      </button>
      {canLoadDb ? (
        <button className="btn-ghost mt-3" onClick={loadFromDb} disabled={loading}>
          Cargar datos de la BD
        </button>
      ) : null}
      <p className="mt-3 text-xs text-slate-400">
        Requiere backend activo.
      </p>
    </div>
  );
}
