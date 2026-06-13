import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPosts, fetchNewPostsCount, type PostResponse } from '../api/posts';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 20;
const POLL_INTERVAL_MS = 60000;

export function usePosts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const latestIdRef = useRef<number | null>(null);

  const loadPage = useCallback(async (pageNum: number, replace: boolean) => {
    if (!token || loading) return;
    setLoading(true);
    try {
      const data = await fetchPosts(token, pageNum, PAGE_SIZE);
      setPosts(prev => {
        const next = replace ? data.posts : [...prev, ...data.posts];
        if (next.length > 0) latestIdRef.current = next[0].id;
        return next;
      });
      setHasNext(data.hasNext);
      if (replace && data.posts.length > 0) latestIdRef.current = data.posts[0].id;
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPage(0, true);
  }, []);

  const loadMore = useCallback(() => {
    if (!hasNext || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, false);
  }, [hasNext, loading, page, loadPage]);

  const refreshPosts = useCallback(async () => {
    setPage(0);
    setNewPostsCount(0);
    await loadPage(0, true);
  }, [loadPage]);

  const prependPost = useCallback((post: PostResponse) => {
    setPosts(prev => [post, ...prev]);
    latestIdRef.current = post.id;
  }, []);

  const replacePost = useCallback((updated: PostResponse) => {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  const removePost = useCallback((id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  useEffect(() => {
    if (!token) return;
    const timer = setInterval(async () => {
      if (latestIdRef.current == null) return;
      try {
        const count = await fetchNewPostsCount(token, latestIdRef.current);
        if (count > 0) setNewPostsCount(count);
      } catch {
        // ignore polling errors silently
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [token]);

  return { posts, loadMore, hasNext, loading, newPostsCount, refreshPosts, prependPost, replacePost, removePost };
}
