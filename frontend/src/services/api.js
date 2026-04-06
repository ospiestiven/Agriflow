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

export { API_URL };
