// Página de lecturas e históricos.
import { useMemo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLiveData } from "../hooks/useLiveData.js";
import Sparkline from "../components/Sparkline.jsx";

function summarize(values) {
  if (!values.length) return { min: "—", max: "—", avg: "—" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return {
    min: min.toFixed(1),
    max: max.toFixed(1),
    avg: avg.toFixed(1),
  };
}

export default function Readings() {
  const { history } = useLiveData();
  const rows = useMemo(() => history.slice(-12).reverse(), [history]);

  const soil = history.map((h) => h.soilMoisture).filter((v) => typeof v === "number");
  const temp = history.map((h) => h.airTemp).filter((v) => typeof v === "number");
  const light = history.map((h) => h.light).filter((v) => typeof v === "number");

  const chartData = useMemo(() => {
    return history.slice(-40).map((h, idx) => ({
      idx,
      ts: h.ts ? h.ts.slice(11, 19) : `#${idx + 1}`,
      soilMoisture: typeof h.soilMoisture === "number" ? h.soilMoisture : null,
      airTemp: typeof h.airTemp === "number" ? h.airTemp : null,
      light: typeof h.light === "number" ? h.light : null,
    }));
  }, [history]);

  const soilStats = summarize(soil);
  const tempStats = summarize(temp);
  const lightStats = summarize(light);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">AgriFlow · Lecturas</p>
        <h1 className="title">Historial y análisis</h1>
        <p className="subtitle">
          Visualiza lecturas recientes, tendencias y exportaciones.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800">Humedad del suelo</h2>
          <Sparkline data={soil} stroke="#1b7f5c" />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-900">{soilStats.min}</p>
              <p>Min</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{soilStats.avg}</p>
              <p>Avg</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{soilStats.max}</p>
              <p>Max</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800">Temperatura</h2>
          <Sparkline data={temp} stroke="#f2b84b" />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-900">{tempStats.min}</p>
              <p>Min</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{tempStats.avg}</p>
              <p>Avg</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{tempStats.max}</p>
              <p>Max</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800">Luz</h2>
          <Sparkline data={light} stroke="#465362" />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-900">{lightStats.min}</p>
              <p>Min</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{lightStats.avg}</p>
              <p>Avg</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{lightStats.max}</p>
              <p>Max</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Gráfico combinado
          </h2>
          <span className="chip">Últimos 40</span>
        </div>
        <div className="chart-shell mt-4">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="ts" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="soilMoisture"
                  stroke="#1b7f5c"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="airTemp"
                  stroke="#f2b84b"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="light"
                  stroke="#465362"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">Esperando lecturas simuladas...</div>
          )}
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Últimas lecturas
          </h2>
          <span className="chip chip-accent">Simulado</span>
        </div>
        <div className="table-wrap mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Humedad</th>
                <th>Temp</th>
                <th>Luz</th>
                <th>Lluvia</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row, idx) => (
                  <tr key={`${row.ts}-${idx}`}>
                    <td>{row.ts || "—"}</td>
                    <td>{row.soilMoisture ?? "—"}</td>
                    <td>{row.airTemp ?? "—"}</td>
                    <td>{row.light ?? "—"}</td>
                    <td>{row.rainRaw ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400">
                    Esperando lecturas simuladas...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
