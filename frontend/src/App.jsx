import { useEffect, useState } from "react";

const API = "http://localhost:3000";

export default function App() {
  const [reading, setReading] = useState(null);
  const [ml, setMl] = useState(null);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const ev = new EventSource(`${API}/events`);
    ev.onopen = () => setStatus("connected");
    ev.onerror = () => setStatus("error");
    ev.addEventListener("reading", (e) => setReading(JSON.parse(e.data)));
    ev.addEventListener("ml", (e) => setMl(JSON.parse(e.data)));
    return () => ev.close();
  }, []);

  async function simulateOne() {
    await fetch(`${API}/simulate/reading`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        deviceId: "sim-ui",
        sensors: { soilMoisture: 37, airTemp: 26, light: 750, rainRaw: 620 }
      })
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-700">AgriFlow — Local Dashboard</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${
            status==="connected" ? "bg-green-100 text-green-700" :
            status==="error" ? "bg-red-100 text-red-700" :
            "bg-amber-100 text-amber-700"
          }`}>{status}</span>
        </header>

        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Humedad suelo (%)" value={reading?.soilMoisture} />
          <Card title="Temp aire (°C)" value={reading?.airTemp} />
          <Card title="Luz (raw)" value={reading?.light} />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <ActionCard onSimulate={simulateOne} />
          <MlCard ml={ml} />
          <MetaCard reading={reading} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-slate-600">{title}</h3>
      <div className="text-3xl font-semibold mt-2">{value ?? "—"}</div>
    </div>
  );
}

function ActionCard({ onSimulate }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-slate-600 mb-3">Pruebas</h3>
      <div className="flex gap-3">
        <button onClick={onSimulate}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
          Enviar lectura simulada
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Requiere backend corriendo en http://localhost:3000
      </p>
    </div>
  );
}

function MlCard({ ml }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-slate-600 mb-2">IA (predicción)</h3>
      {ml ? (
        <ul className="text-sm text-slate-700 space-y-1">
          <li><b>Regar:</b> {ml.should_irrigate ? "Sí" : "No"}</li>
          <li><b>Minutos:</b> {ml.minutes_to_irrigate}</li>
          <li><b>Caudal LPM:</b> {ml.recommended_flow_lpm}</li>
          <li><b>Confianza:</b> {Math.round((ml.confidence ?? 0)*100)}%</li>
          <li><b>Razones:</b> {(ml.explain||[]).join(", ")}</li>
        </ul>
      ) : <div className="text-slate-400">Esperando predicción…</div>}
    </div>
  );
}

function MetaCard({ reading }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-slate-600 mb-2">Última lectura</h3>
      <pre className="text-xs bg-slate-50 border rounded p-2 overflow-auto h-40">
        {reading ? JSON.stringify(reading, null, 2) : "—"}
      </pre>
    </div>
  );
}