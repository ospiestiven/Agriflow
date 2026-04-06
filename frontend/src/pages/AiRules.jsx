import { useLiveData } from "../hooks/useLiveData.js";
import MlCard from "../components/MlCard.jsx";

const rules = [
  {
    title: "Humedad baja",
    detail: "Si humedad < 40%, activar riego.",
    level: "crit",
  },
  {
    title: "Humedad alta",
    detail: "Si humedad >= 60%, detener riego.",
    level: "ok",
  },
  {
    title: "Temperatura alta",
    detail: "Si temperatura > 30C, aumentar minutos.",
    level: "warn",
  },
  {
    title: "Temperatura baja",
    detail: "Si temperatura < 15C, reducir minutos.",
    level: "warn",
  },
];

export default function AiRules() {
  const { ml } = useLiveData();

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">AgriFlow · IA</p>
        <h1 className="title">IA y reglas</h1>
        <p className="subtitle">
          Reglas activas, modelos y explicaciones de prediccion.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-800">Reglas activas</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {rules.map((rule) => (
              <div key={rule.title} className={`rule-card ${rule.level}`}>
                <p className="text-sm font-semibold">{rule.title}</p>
                <p className="text-xs text-slate-500 mt-1">{rule.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Reglas aplicadas sobre datos simulados.
          </p>
        </div>
        <MlCard ml={ml} />
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">Modelo actual</h2>
          <span className="chip chip-ml">Fallback</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-600">
          <div>
            <p className="text-xs text-slate-400">Version</p>
            <p className="font-semibold text-slate-900">0.1.0</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Servicio</p>
            <p className="font-semibold text-slate-900">FastAPI local</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Modo</p>
            <p className="font-semibold text-slate-900">Reglas basicas</p>
          </div>
        </div>
      </section>
    </div>
  );
}
