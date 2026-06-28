import { ApiError } from './auth';

const API_BASE = 'http://localhost:8080/api/v1';

export interface PostUserDto {
  id: number;
  username: string;
  avatarUrl: string | null;
}

export interface PostImageDto {
  imageUrl: string;
  position: number;
}

export interface PostResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: PostUserDto;
  images: PostImageDto[];
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
}

export interface PostsResponse {
  posts: PostResponse[];
  hasNext: boolean;
}

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function fetchPosts(token: string, page: number, size = 20, type: 'global' | 'following' = 'global'): Promise<PostsResponse> {
  const res = await fetch(`${API_BASE}/posts?page=${page}&size=${size}&type=${type}`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as PostsResponse;
}

export async function fetchNewPostsCount(token: string, afterId: number): Promise<number> {
  const res = await fetch(`${API_BASE}/posts?after=${afterId}`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return (data as { count: number }).count;
}

export async function createPost(token: string, content: string): Promise<PostResponse> {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as PostResponse;
}

export async function updatePost(token: string, id: number, content: string): Promise<PostResponse> {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data);
  return data as PostResponse;
}

export async function deletePost(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }
}
