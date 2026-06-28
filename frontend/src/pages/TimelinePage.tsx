import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import NewPostsBanner from '../components/NewPostsBanner';
import type { PostResponse } from '../api/posts';

export default function TimelinePage() {
  const { currentUser, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [timelineType, setTimelineType] = useState<'global' | 'following'>('global');
  const { posts, loadMore, hasNext, loading, newPostsCount, refreshPosts, prependPost, replacePost, removePost } = usePosts(timelineType);
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/search" style={styles.searchLink}>ユーザーを検索</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>ログアウト</button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(timelineType === 'global' ? styles.tabActive : {}) }}
          onClick={() => setTimelineType('global')}
        >
          全体
        </button>
        <button
          style={{ ...styles.tab, ...(timelineType === 'following' ? styles.tabActive : {}) }}
          onClick={() => setTimelineType('following')}
        >
          フォロー中
        </button>
      </div>

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

      {!loading && !hasNext && posts.length === 0 && timelineType === 'following' && (
        <div style={styles.empty}>
          まだ投稿がありません。<Link to="/search" style={styles.emptyLink}>ユーザーをフォローしてみましょう。</Link>
        </div>
      )}

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
  searchLink: {
    fontSize: 14, fontWeight: 700, color: '#1d9bf0', textDecoration: 'none',
  },
  logoutBtn: {
    padding: '8px 16px', background: 'transparent', border: '1px solid #cfd9de',
    borderRadius: 9999, fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  tabs: {
    display: 'flex', borderBottom: '1px solid #e7e9ea',
  },
  tab: {
    flex: 1, padding: '16px 0', background: 'transparent', border: 'none',
    fontSize: 15, fontWeight: 700, color: '#536471', cursor: 'pointer',
    borderBottom: '3px solid transparent', transition: 'color 0.2s',
  },
  tabActive: {
    color: '#0f1419', borderBottom: '3px solid #1d9bf0',
  },
  empty: {
    textAlign: 'center', padding: '40px 20px', color: '#536471', fontSize: 15,
  },
  emptyLink: { color: '#1d9bf0', textDecoration: 'none' },
  loading: { textAlign: 'center', padding: '20px', color: '#536471', fontSize: 14 },
  end: { textAlign: 'center', padding: '20px', color: '#536471', fontSize: 14 },
};
