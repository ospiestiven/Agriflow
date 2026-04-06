const tones = {
  crit: "bg-rose-100 text-rose-900 border-rose-200",
  warn: "bg-amber-100 text-amber-900 border-amber-200",
  ok: "bg-emerald-100 text-emerald-900 border-emerald-200",
};

export default function AlertsCard({ alerts }) {
  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Alertas y reglas</h3>
        <span className="chip chip-ml">Reglas</span>
      </div>
      <div className="mt-4 space-y-2">
        {alerts.length ? (
          alerts.map((alert, idx) => (
            <div
              key={`${alert.message}-${idx}`}
              className={`rounded-xl border px-3 py-2 text-sm ${tones[alert.level]}`}
            >
              {alert.message}
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed px-3 py-4 text-sm text-slate-400">
            Esperando lecturas para evaluar reglas.
          </div>
        )}
      </div>
    </div>
  );
}
