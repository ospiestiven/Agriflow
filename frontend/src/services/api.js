// Cliente API para el backend.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function createEventSource() {
  return new EventSource(`${API_URL}/events`);
}

export async function simulateReading(payload) {
  await fetch(`${API_URL}/simulate/reading`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function fetchReadings(params = {}) {
  const query = new URLSearchParams();
  if (typeof params === "number") {
    query.set("limit", params);
  } else if (params) {
    if (params.limit) query.set("limit", params.limit);
    if (params.start) query.set("start", params.start);
    if (params.end) query.set("end", params.end);
    if (params.sensor) query.set("sensor", params.sensor);
    if (params.page) query.set("page", params.page);
    if (params.pageSize) query.set("pageSize", params.pageSize);
  }
  const qs = query.toString();
  const r = await fetch(`${API_URL}/readings${qs ? `?${qs}` : ""}`);
  if (!r.ok) throw new Error("Failed to fetch readings");
  return r.json();
}

export { API_URL };
