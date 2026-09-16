/**
 * frontend/js/api.js - API bindings to FastAPI / Express backend
 */

const API_BASE = '';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  return res.json();
}

export async function verifySubmission(data) {
  const res = await fetch(`${API_BASE}/api/verify-submission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Submission verification failed');
  return res.json();
}

export async function startViva(data) {
  const res = await fetch(`${API_BASE}/api/viva/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to start viva session');
  return res.json();
}

export async function submitVivaTurn(data) {
  const res = await fetch(`${API_BASE}/api/viva/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to evaluate viva turn');
  return res.json();
}

export async function finalizeViva(data) {
  const res = await fetch(`${API_BASE}/api/viva/finalize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to finalize assessment ledger');
  return res.json();
}
