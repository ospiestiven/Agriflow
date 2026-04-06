export default function MetricCard({ title, value, unit, subtitle }) {
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          {subtitle ? (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          ) : null}
        </div>
        <span className="chip">Sensor</span>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-slate-900">
          {value ?? "—"}
        </span>
        {unit ? <span className="text-sm text-slate-500">{unit}</span> : null}
      </div>
    </div>
  );
}
