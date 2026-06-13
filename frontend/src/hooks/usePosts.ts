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
  // useRefでloadingを管理し、クロージャによる競合状態を防ぐ
  const loadingRef = useRef(false);

  const loadPage = useCallback(async (pageNum: number, replace: boolean) => {
    if (!token || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const data = await fetchPosts(token, pageNum, PAGE_SIZE);
      setPosts(prev => {
        const next = replace ? data.posts : [...prev, ...data.posts];
        if (next.length > 0) latestIdRef.current = next[0].id;
        return next;
      });
      setHasNext(data.hasNext);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPage(0, true);
  }, [token]);

  const loadMore = useCallback(() => {
    if (!hasNext || loadingRef.current) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, false);
  }, [hasNext, page, loadPage]);

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
