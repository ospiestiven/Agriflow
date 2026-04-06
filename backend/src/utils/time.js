// Utilidad para timestamps ISO sin sufijo Z.
export function nowISO() {
  return new Date().toISOString().replace("Z", "");
}
