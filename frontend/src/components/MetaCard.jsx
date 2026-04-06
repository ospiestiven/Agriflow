// Tarjeta con el JSON de la última lectura.
// Presenta la lectura cruda en formato JSON.
export default function MetaCard({ reading }) {
  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Última lectura</h3>
        <span className="chip">JSON</span>
      </div>
      <pre className="mt-4 h-44 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
        {reading ? JSON.stringify(reading, null, 2) : "—"}
      </pre>
    </div>
  );
}
