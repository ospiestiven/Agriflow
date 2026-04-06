import { NavLink, Link, useLocation } from "react-router-dom";
import { Activity, Brain, LayoutDashboard } from "lucide-react";
import logo from "../assets/agriflow-logo.svg";

const dashboardSections = [
  { id: "overview", label: "Resumen" },
  { id: "metrics", label: "Sensores" },
  { id: "system", label: "Estado" },
  { id: "actions", label: "Acciones" },
];

function NavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item ${isActive ? "is-active" : ""}`
      }
    >
      <span className="nav-icon">
        <Icon size={16} />
      </span>
      <span>{children}</span>
    </NavLink>
  );
}

export default function Sidebar({ activeSection }) {
  const location = useLocation();
  const onDashboard = location.pathname === "/dashboard";

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <img src={logo} alt="AgriFlow" />
        </div>
        <div>
          <p className="brand-name">AgriFlow</p>
          <p className="brand-sub">Centro de Control</p>
        </div>
      </div>

      <nav className="nav">
        <div>
          <NavItem to="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </NavItem>
          {onDashboard ? (
            <div className="nav-sub">
              <p className="nav-sub-title">Secciones</p>
              {dashboardSections.map((section) => (
                <Link
                  key={section.id}
                  to={`/dashboard#${section.id}`}
                  className={`nav-sub-item ${
                    activeSection === section.id ? "is-active" : ""
                  }`}
                >
                  {section.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <NavItem to="/readings" icon={Activity}>
          Lecturas
        </NavItem>
        <NavItem to="/ai" icon={Brain}>
          IA y reglas
        </NavItem>
      </nav>

      <div className="sidebar-footer">
        <p className="text-xs text-slate-500">Modo local con datos simulados</p>
        <span className="chip chip-accent mt-2 inline-flex">Simulado</span>
      </div>
    </aside>
  );
}
