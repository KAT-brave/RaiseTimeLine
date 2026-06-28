import { ApiError } from './auth';

const API_BASE = 'http://localhost:8080/api/v1';

export interface CommentUserDto {
  id: number;
  username: string;
  avatarUrl: string | null;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  user: CommentUserDto;
}

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function fetchComments(token: string, postId: number): Promise<CommentResponse[]> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as CommentResponse[];
}

export async function createComment(token: string, postId: number, content: string): Promise<CommentResponse> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as CommentResponse;
}

export async function deleteComment(token: string, postId: number, commentId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }
}
