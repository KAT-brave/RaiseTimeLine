import { ApiError } from './auth';

const API_BASE = 'http://localhost:8080/api/v1';

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function addLike(token: string, postId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${postId}/likes`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }
}

export async function removeLike(token: string, postId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${postId}/likes`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }
}
