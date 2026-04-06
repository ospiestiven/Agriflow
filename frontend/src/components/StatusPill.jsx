// Indicador visual de estado de conexión.
const styles = {
  connected: "bg-emerald-100 text-emerald-900 border-emerald-200",
  error: "bg-rose-100 text-rose-900 border-rose-200",
  connecting: "bg-amber-100 text-amber-900 border-amber-200",
};

// Muestra el estado de conexión en una píldora.
export default function StatusPill({ status }) {
  const cls = styles[status] || styles.connecting;
  const label =
    status === "connected" ? "Conectado" : status === "error" ? "Error" : "Conectando";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${cls}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
