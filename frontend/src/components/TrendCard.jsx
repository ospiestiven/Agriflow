import Sparkline from "./Sparkline.jsx";

export default function TrendCard({ history }) {
  const soil = history.map((h) => h.soilMoisture);
  const temp = history.map((h) => h.airTemp);
  const light = history.map((h) => h.light);

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Tendencias</h3>
        <span className="chip">Últimos datos</span>
      </div>
      <div className="mt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Humedad del suelo</span>
            <span>%</span>
          </div>
          <Sparkline data={soil} stroke="#1b7f5c" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Temperatura</span>
            <span>°C</span>
          </div>
          <Sparkline data={temp} stroke="#f2b84b" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Luz</span>
            <span>raw</span>
          </div>
          <Sparkline data={light} stroke="#465362" />
        </div>
      </div>
    </div>
  );
}
