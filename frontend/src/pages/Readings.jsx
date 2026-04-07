// Página de lecturas e históricos.
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchReadings } from "../services/api.js";
import Sparkline from "../components/Sparkline.jsx";

// Calcula métricas básicas de una serie numérica.
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

// Formatea el timestamp para mostrar fecha y hora legibles.
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

// Renderiza el historial de lecturas con filtros y paginación.
export default function Readings() {
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sensor, setSensor] = useState("all");
  const [page, setPage] = useState(1);
  const defaultPageSize = 20;
  const [pageSize, setPageSize] = useState(defaultPageSize);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, sensor, pageSize]);

  useEffect(() => {
    const params = { limit: 5000 };
    if (startDate) params.start = `${startDate}T00:00:00`;
    if (endDate) params.end = `${endDate}T23:59:59`;
    if (sensor !== "all") params.sensor = sensor;

    setLoading(true);
    fetchReadings(params)
      .then((data) => {
        const list = Array.isArray(data?.items) ? data.items : [];

        const startTs = startDate ? new Date(`${startDate}T00:00:00`) : null;
        const endTs = endDate ? new Date(`${endDate}T23:59:59`) : null;
        const sensorKeyMap = {
          Humedad: "soilMoisture",
          Temperatura: "airTemp",
          Luz: "light",
          Lluvia: "rainRaw",
          Nivel: "waterLevel",
        };
        const key = sensor !== "all" ? sensorKeyMap[sensor] : null;

        const next = list.filter((item) => {
          if (key && typeof item[key] !== "number") return false;
          if (startTs && new Date(item.ts) < startTs) return false;
          if (endTs && new Date(item.ts) > endTs) return false;
          return true;
        });

        setFilteredItems(next);
      })
      .catch(() => setFilteredItems([]))
      .finally(() => setLoading(false));
  }, [startDate, endDate, sensor]);

  const rows = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, page, pageSize]);

  const soil = filteredItems
    .map((h) => h.soilMoisture)
    .filter((v) => typeof v === "number");
  const temp = filteredItems
    .map((h) => h.airTemp)
    .filter((v) => typeof v === "number");
  const light = filteredItems
    .map((h) => h.light)
    .filter((v) => typeof v === "number");

  const chartData = useMemo(() => {
    return filteredItems.slice(-40).map((h, idx) => ({
      idx,
      ts: h.ts ? h.ts.slice(11, 19) : `#${idx + 1}`,
      soilMoisture: typeof h.soilMoisture === "number" ? h.soilMoisture : null,
      airTemp: typeof h.airTemp === "number" ? h.airTemp : null,
      light: typeof h.light === "number" ? h.light : null,
    }));
  }, [filteredItems]);

  const soilStats = summarize(soil);
  const tempStats = summarize(temp);
  const lightStats = summarize(light);
  const totalPages = Math.max(Math.ceil(filteredItems.length / pageSize), 1);
  const hasFilters =
    !!startDate || !!endDate || sensor !== "all" || pageSize !== defaultPageSize;

  // Limpia los filtros activos y vuelve a valores por defecto.
  function clearFilters() {
    setStartDate("");
    setEndDate("");
    setSensor("all");
    setPageSize(defaultPageSize);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">AgriFlow · Lecturas</p>
        <h1 className="title">Historial y análisis</h1>
        <p className="subtitle">
          Visualiza lecturas recientes, tendencias y exportaciones.
        </p>
      </header>

      <section className="card filters">
        <div className="filter-group">
          <label>
            <span>Desde</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            <span>Hasta</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <div className="filter-group">
          <label>
            <span>Sensor</span>
            <select value={sensor} onChange={(e) => setSensor(e.target.value)}>
              <option value="all">Todos</option>
              <option value="Humedad">Humedad</option>
              <option value="Temperatura">Temperatura</option>
              <option value="Luz">Luz</option>
              <option value="Lluvia">Lluvia</option>
              <option value="Nivel">Nivel</option>
            </select>
          </label>
          <label>
            <span>Por página</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
        <div className="filter-actions">
          <div className="filter-chips">
            {hasFilters ? (
              <>
                {startDate ? <span className="chip chip-inline">Desde {startDate}</span> : null}
                {endDate ? <span className="chip chip-inline">Hasta {endDate}</span> : null}
                {sensor !== "all" ? (
                  <span className="chip chip-inline">Sensor: {sensor}</span>
                ) : null}
                {pageSize !== defaultPageSize ? (
                  <span className="chip chip-inline">Por página: {pageSize}</span>
                ) : null}
              </>
            ) : (
              <span className="text-xs text-slate-400">Sin filtros activos</span>
            )}
          </div>
          <button className="btn-ghost" onClick={clearFilters} disabled={!hasFilters}>
            Limpiar filtros
          </button>
        </div>
      </section>

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
            <div className="chart-empty">
              {loading ? "Cargando lecturas..." : "Sin datos para este filtro."}
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            Últimas lecturas
          </h2>
          
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
                    <td>{formatTimestamp(row.ts)}</td>
                    <td>{row.soilMoisture ?? "—"}</td>
                    <td>{row.airTemp ?? "—"}</td>
                    <td>{row.light ?? "—"}</td>
                    <td>{row.rainRaw ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400">
                    {loading ? "Cargando lecturas..." : "Sin datos para este filtro."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button
            className="btn-ghost"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            className="btn-ghost"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </section>
    </div>
  );
}
