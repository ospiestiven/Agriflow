export function nowISO() {
  return new Date().toISOString().replace("Z", "");
}
