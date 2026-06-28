import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchUsers, type UserResponse } from '../api/users';
import { followUser, unfollowUser } from '../api/follows';
import { useAuth } from '../context/AuthContext';

export default function SearchPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (keyword.trim().length === 0) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await searchUsers(token, keyword.trim());
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [keyword, token]);

  async function handleFollowToggle(user: UserResponse) {
    if (!token) return;
    try {
      if (user.followedByMe) {
        await unfollowUser(token, user.id);
      } else {
        await followUser(token, user.id);
      }
      setResults(prev => prev.map(u =>
        u.id === user.id
          ? { ...u, followedByMe: !u.followedByMe, followersCount: u.followersCount + (u.followedByMe ? -1 : 1) }
          : u
      ));
    } catch {
      // エラー時は何もしない
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← タイムライン</button>
        <h2 style={styles.title}>ユーザーを検索</h2>
      </div>

      <div style={styles.searchWrap}>
        <input
          style={styles.input}
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="ユーザー名を入力..."
          autoFocus
        />
      </div>

      {loading && <p style={styles.message}>検索中...</p>}

      {!loading && keyword.trim().length > 0 && results.length === 0 && (
        <p style={styles.message}>ユーザーが見つかりませんでした</p>
      )}

      <ul style={styles.list}>
        {results.map(user => (
          <li key={user.id} style={styles.item}>
            <Link to={`/users/${user.id}`} style={styles.userLink}>
              <div style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
              <span style={styles.username}>@{user.username}</span>
            </Link>
            <button
              style={user.followedByMe ? styles.unfollowBtn : styles.followBtn}
              onClick={() => handleFollowToggle(user)}
            >
              {user.followedByMe ? 'フォロー解除' : 'フォロー'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 600, margin: '0 auto', padding: '0 16px' },
  header: { padding: '12px 0', borderBottom: '1px solid #e7e9ea', display: 'flex', alignItems: 'center', gap: 12 },
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 14, color: '#1d9bf0', fontWeight: 700,
  },
  title: { fontSize: 18, fontWeight: 800, margin: 0, color: '#0f1419' },
  searchWrap: { padding: '16px 0' },
  input: {
    width: '100%', border: '1px solid #cfd9de', borderRadius: 9999,
    padding: '10px 16px', fontSize: 15, outline: 'none',
    boxSizing: 'border-box',
  },
  message: { textAlign: 'center', color: '#536471', fontSize: 14, padding: '20px 0' },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  item: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 0', borderBottom: '1px solid #e7e9ea',
  },
  userLink: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none', flex: 1,
  },
  avatar: {
    width: 40, height: 40, borderRadius: '50%',
    background: '#1d9bf0', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700, flexShrink: 0,
  },
  username: { fontWeight: 700, fontSize: 15, color: '#0f1419' },
  followBtn: {
    background: '#0f1419', color: '#fff', border: 'none',
    borderRadius: 9999, padding: '6px 16px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  unfollowBtn: {
    background: 'none', border: '1px solid #cfd9de', color: '#0f1419',
    borderRadius: 9999, padding: '6px 16px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
  },
};
