import { simulateReading } from "../services/api.js";

export default function ActionCard() {
  async function simulateOne() {
    await simulateReading({
      deviceId: "sim-ui",
      sensors: { soilMoisture: 37, airTemp: 26, light: 750, rainRaw: 620 },
    });
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
      <button className="btn-primary mt-5" onClick={simulateOne}>
        Enviar lectura simulada
      </button>
      <p className="mt-3 text-xs text-slate-400">
        Requiere backend activo en `http://localhost:3000`.
      </p>
    </div>
  );
}
