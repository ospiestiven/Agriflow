// Componente para hacer scroll al hash de la URL.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Sincroniza el scroll con el hash activo en la URL.
export default function ScrollToHash({ offset = 0 }) {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [location.hash, offset]);

  return null;
}
