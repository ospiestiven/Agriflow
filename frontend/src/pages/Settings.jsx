export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">AgriFlow · Configuracion</p>
        <h1 className="title">Parametros del sistema</h1>
        <p className="subtitle">
          Ajustes de conexion, sensores y modos operativos.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800">
            Conexion local
          </h2>
          <div className="mt-4 space-y-3">
            <label className="form-field">
              <span>URL backend</span>
              <input type="text" placeholder="http://localhost:3000" disabled />
            </label>
            <label className="form-field">
              <span>URL IA</span>
              <input type="text" placeholder="http://127.0.0.1:8001" disabled />
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Configuracion solo informativa (modo simulado).
          </p>
        </div>
        <div className="card">
          <h2 className="text-base font-semibold text-slate-800">
            Perfil de cultivo
          </h2>
          <div className="mt-4 space-y-3">
            <label className="form-field">
              <span>Tipo de cultivo</span>
              <input type="text" placeholder="Tomate" disabled />
            </label>
            <label className="form-field">
              <span>Humedad objetivo</span>
              <input type="text" placeholder="45 - 55%" disabled />
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Ajustes disponibles en la siguiente fase.
          </p>
        </div>
      </section>
    </div>
  );
}
