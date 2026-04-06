function ConfidenceBar({ value }) {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Confianza</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MlCard({ ml }) {
  const should = ml?.should_irrigate;
  const minutes = ml?.minutes_to_irrigate ?? "—";
  const flow = ml?.recommended_flow_lpm ?? "—";
  const reasons = (ml?.explain || []).join(", ");

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">IA de riego</h3>
        <span className="chip chip-ml">Prediccion</span>
      </div>
      {ml ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            <span
              className={`status-dot ${
                should ? "status-ok" : "status-warn"
              }`}
            />
            <div>
              <p className="text-sm text-slate-500">Decision</p>
              <p className="text-lg font-semibold text-slate-900">
                {should ? "Regar" : "No regar"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Minutos</p>
              <p className="text-lg font-semibold text-slate-900">{minutes}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Caudal LPM</p>
              <p className="text-lg font-semibold text-slate-900">{flow}</p>
            </div>
          </div>

          <ConfidenceBar value={ml?.confidence} />

          <p className="mt-3 text-xs text-slate-500">
            Razones: {reasons || "—"}
          </p>
        </>
      ) : (
        <div className="mt-6 text-sm text-slate-400">
          Esperando prediccion de la IA...
        </div>
      )}
    </div>
  );
}
