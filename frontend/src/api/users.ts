import { ApiError } from './auth';

const API_BASE = 'http://localhost:8080/api/v1';

export interface UserResponse {
  id: number;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  followingCount: number;
  followersCount: number;
  followedByMe: boolean;
}

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function fetchUser(token: string, id: number): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as UserResponse;
}

export async function searchUsers(token: string, keyword: string): Promise<UserResponse[]> {
  const res = await fetch(`${API_BASE}/users?q=${encodeURIComponent(keyword)}`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as UserResponse[];
}

export async function updateUser(
  token: string,
  id: number,
  payload: { username: string; bio: string }
): Promise<UserResponse> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as UserResponse;
}
