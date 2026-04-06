// Cliente para llamar al servicio de IA.
import fetch from "node-fetch";

export async function callMl({ mlUrl, payload }) {
  const r = await fetch(`${mlUrl}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}
