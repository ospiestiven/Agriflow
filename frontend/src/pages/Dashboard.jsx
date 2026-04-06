import { useEffect } from "react";
import { useLiveData } from "../hooks/useLiveData.js";
import { useScrollSpy } from "../hooks/useScrollSpy.js";
import ActionCard from "../components/ActionCard.jsx";
import MetricCard from "../components/MetricCard.jsx";
import MlCard from "../components/MlCard.jsx";
import MetaCard from "../components/MetaCard.jsx";
import StatusPill from "../components/StatusPill.jsx";
import SystemStatusCard from "../components/SystemStatusCard.jsx";
import AlertsCard from "../components/AlertsCard.jsx";
import TrendCard from "../components/TrendCard.jsx";

const sectionIds = ["overview", "metrics", "system", "actions"];

function formatTimestamp(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Dashboard({ onSectionChange }) {
  const { reading, ml, status, history, alerts, loadFromDb } = useLiveData();
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    if (onSectionChange) onSectionChange(activeSection);
  }, [activeSection, onSectionChange]);

  let irrigateLabel = "Sin datos";
  if (ml) {
    irrigateLabel = ml.should_irrigate ? "Sí" : "No";
  } else if (typeof reading?.soilMoisture === "number") {
    const soil = reading.soilMoisture;
    const temp = reading.airTemp;
    const rain = reading.rainRaw;
    const soilLow = soil < 40;
    const soilHigh = soil >= 60;
    const rainDetected = typeof rain === "number" && rain > 700;
    const tempHigh = typeof temp === "number" && temp > 30;
    const tempLow = typeof temp === "number" && temp < 15;

    if (rainDetected) irrigateLabel = "No (lluvia)";
    else if (soilLow) irrigateLabel = tempHigh ? "Sí (alta temp.)" : "Sí";
    else if (soilHigh) irrigateLabel = "No";
    else if (tempLow) irrigateLabel = "No (baja temp.)";
    else irrigateLabel = "En evaluación";
  }

  return (
    <div className="space-y-6">
      <section id="overview" className="space-y-6">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">AgriFlow · Centro de Control</p>
            <h1 className="title">Dashboard de riego inteligente</h1>
            <p className="subtitle">
              Monitoreo en tiempo real, recomendaciones de IA y operaciones locales
              para optimizar el uso del agua. Dispositivo indica el origen de la
              lectura (por ejemplo, sim-ui o db).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={status} />
          </div>
        </header>

        <div className="hero card">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Resumen operativo
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Estado general del sistema y últimas lecturas recibidas.
            </p>
          </div>
          <div className="hero-grid">
            <div className="hero-stat">
              <p className="hero-label">Dispositivo (origen)</p>
              <p className="hero-value">{reading?.deviceId || "—"}</p>
            </div>
            <div className="hero-stat">
              <p className="hero-label">Última marca</p>
              <p className="hero-value">{formatTimestamp(reading?.ts)}</p>
            </div>
            <div className="hero-stat">
              <p className="hero-label">Regar</p>
              <p className="hero-value">{irrigateLabel}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="metrics" className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

      <section id="system" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SystemStatusCard status={status} ml={ml} />
        <AlertsCard alerts={alerts} />
        <TrendCard history={history} />
      </section>

      <section id="actions" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActionCard onLoadDb={loadFromDb} />
        <MlCard ml={ml} />
        <MetaCard reading={reading} />
      </section>
    </div>
  );
}
