function StatusRow({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`status-pill ${tone}`}>{value}</span>
    </div>
  );
}

export default function SystemStatusCard({ status, ml }) {
  const backendTone = status === "connected" ? "ok" : status === "error" ? "bad" : "warn";
  const backendLabel =
    status === "connected" ? "Activo" : status === "error" ? "Error" : "Conectando";

  const mlTone = ml ? "ok" : "warn";
  const mlLabel = ml ? "Disponible" : "Sin datos";

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Estado del sistema</h3>
        <span className="chip">Simulado</span>
      </div>
      <div className="mt-4 space-y-3">
        <StatusRow label="Backend" value={backendLabel} tone={backendTone} />
        <StatusRow label="IA" value={mlLabel} tone={mlTone} />
        <StatusRow label="Base de datos" value="Conectada" tone="ok" />
        <StatusRow label="Sensores" value="Simulados" tone="warn" />
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Estado calculado con datos simulados del flujo local.
      </p>
    </div>
  );
}
