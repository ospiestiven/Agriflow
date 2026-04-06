import { useLiveData } from "../hooks/useLiveData.js";

export default function ManualControl() {
  const { status, reading } = useLiveData();

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">AgriFlow · Riego</p>
        <h1 className="title">Control manual</h1>
        <p className="subtitle">
          Acciones directas sobre la bomba y estados del relay.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800">Acciones</h2>
          <p className="mt-2 text-sm text-slate-500">
            Control manual disponible para pruebas locales.
          </p>
          <div className="mt-4 flex gap-3">
            <button className="btn-primary" disabled>
              Start
            </button>
            <button className="btn-secondary" disabled>
              Stop
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Botones simulados, sin conexion a hardware.
          </p>
        </div>
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800">Estado bomba</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Conexion backend</span>
              <span className={`status-pill ${status === "connected" ? "ok" : "warn"}`}>
                {status === "connected" ? "Activo" : "Pendiente"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ultima lectura</span>
              <span className="font-semibold text-slate-900">
                {reading?.ts || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estado relay</span>
              <span className="font-semibold text-slate-900">Apagado</span>
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800">
            Reglas de seguridad
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>No activar si humedad supera 60%.</li>
            <li>Suspender con temperatura extrema.</li>
            <li>Registrar cada accion manual.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
