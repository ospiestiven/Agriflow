import { useState } from "react";
import { useLiveData } from "../hooks/useLiveData.js";
import ActionCard from "../components/ActionCard.jsx";
import MetricCard from "../components/MetricCard.jsx";
import MlCard from "../components/MlCard.jsx";
import MetaCard from "../components/MetaCard.jsx";
import StatusPill from "../components/StatusPill.jsx";
import SystemStatusCard from "../components/SystemStatusCard.jsx";
import AlertsCard from "../components/AlertsCard.jsx";
import TrendCard from "../components/TrendCard.jsx";

export default function Dashboard() {
  const { reading, ml, status, history, alerts } = useLiveData();
  const [mode, setMode] = useState("auto");

  return (
    <div className="min-h-screen bg-app text-slate-900">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <div className="page">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">AgriFlow · Control Center</p>
            <h1 className="title">Dashboard de riego inteligente</h1>
            <p className="subtitle">
              Monitoreo en tiempo real, recomendaciones de IA y operaciones locales
              para optimizar el uso del agua.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={status} />
            <button
              type="button"
              className={`mode-toggle ${mode === "auto" ? "is-auto" : "is-manual"}`}
              onClick={() => setMode((m) => (m === "auto" ? "manual" : "auto"))}
            >
              <span>{mode === "auto" ? "Modo automatico" : "Modo manual"}</span>
              <span className="mode-dot" />
            </button>
          </div>
        </header>

        <section className="hero card">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Resumen operativo
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Estado general del sistema y ultimas lecturas recibidas.
            </p>
          </div>
          <div className="hero-grid">
            <div className="hero-stat">
              <p className="hero-label">Dispositivo</p>
              <p className="hero-value">{reading?.deviceId || "—"}</p>
            </div>
            <div className="hero-stat">
              <p className="hero-label">Ultima marca</p>
              <p className="hero-value">{reading?.ts || "—"}</p>
            </div>
            <div className="hero-stat">
              <p className="hero-label">Regar</p>
              <p className="hero-value">
                {ml ? (ml.should_irrigate ? "Si" : "No") : "—"}
              </p>
            </div>
            <div className="hero-stat">
              <p className="hero-label">Modo</p>
              <p className="hero-value">
                {mode === "auto" ? "Automatico" : "Manual"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard
            title="Humedad del suelo"
            subtitle="Sensor A0"
            value={reading?.soilMoisture}
            unit="%"
          />
          <MetricCard
            title="Temperatura del aire"
            subtitle="Sensor DHT11"
            value={reading?.airTemp}
            unit="°C"
          />
          <MetricCard
            title="Luz"
            subtitle="Sensor A1"
            value={reading?.light}
            unit="raw"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SystemStatusCard status={status} ml={ml} />
          <AlertsCard alerts={alerts} />
          <TrendCard history={history} />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ActionCard />
          <MlCard ml={ml} />
          <MetaCard reading={reading} />
        </section>
      </div>
    </div>
  );
}
