import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import NewPostsBanner from '../components/NewPostsBanner';
import type { PostResponse } from '../api/posts';

export default function TimelinePage() {
  const { currentUser, clearAuth } = useAuth();
  const navigate = useNavigate();
  const { posts, loadMore, hasNext, loading, newPostsCount, refreshPosts, prependPost, replacePost, removePost } = usePosts();
  const sentinelRef = useRef<HTMLDivElement>(null);

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  function handleCreated(post: PostResponse) {
    prependPost(post);
  }

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '100px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.logo}>ホーム</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>ログアウト</button>
      </header>

      <PostForm onCreated={handleCreated} />

      <NewPostsBanner count={newPostsCount} onRefresh={refreshPosts} />

      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUser?.id ?? -1}
          onUpdated={replacePost}
          onDeleted={removePost}
        />
      ))}

      {loading && <div style={styles.loading}>読み込み中...</div>}

      {!hasNext && posts.length > 0 && (
        <div style={styles.end}>これ以上の投稿はありません</div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 16px', borderBottom: '1px solid #e7e9ea',
    position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)', zIndex: 10,
  },
  logo: { fontSize: 20, fontWeight: 800, color: '#0f1419' },
  logoutBtn: {
    padding: '8px 16px', background: 'transparent', border: '1px solid #cfd9de',
    borderRadius: 9999, fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  loading: { textAlign: 'center', padding: '20px', color: '#536471', fontSize: 14 },
  end: { textAlign: 'center', padding: '20px', color: '#536471', fontSize: 14 },
};
