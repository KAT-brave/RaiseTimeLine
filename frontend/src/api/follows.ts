import { ApiError } from './auth';

const API_BASE = 'http://localhost:8080/api/v1';

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function followUser(token: string, userId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${userId}/follow`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }
}

export async function unfollowUser(token: string, userId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${userId}/follow`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }
}
