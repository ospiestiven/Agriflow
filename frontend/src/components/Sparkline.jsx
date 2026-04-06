// Componente de sparkline para tendencias.
// Dibuja una línea de tendencia simple con SVG.
export default function Sparkline({ data = [], stroke = "#1b7f5c" }) {
  if (!data.length) {
    return (
      <div className="h-10 w-full rounded-xl bg-slate-100 animate-pulse" />
    );
  }

  const values = data.map((v) => (typeof v === "number" ? v : 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * 100;
      const y = 40 - ((v - min) / range) * 35;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 40" className="h-10 w-full">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
