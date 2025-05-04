// src/client/api.ts
export async function fetchHealth() {
  const res = await fetch('/api/health');
  return res.json();
}
