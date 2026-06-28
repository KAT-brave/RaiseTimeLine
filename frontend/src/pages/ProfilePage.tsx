import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser, updateUser, type UserResponse } from '../api/users';
import { followUser, unfollowUser } from '../api/follows';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, currentUser, saveAuth } = useAuth();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [followSubmitting, setFollowSubmitting] = useState(false);
  const [error, setError] = useState('');

  const userId = Number(id);
  const isOwner = currentUser?.id === userId;

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    fetchUser(token, userId)
      .then(data => {
        setUser(data);
        setUsername(data.username);
        setBio(data.bio ?? '');
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  async function handleFollowToggle() {
    if (!token || !user || followSubmitting) return;
    setFollowSubmitting(true);
    try {
      if (user.followedByMe) {
        await unfollowUser(token, userId);
        setUser({ ...user, followedByMe: false, followersCount: user.followersCount - 1 });
      } else {
        await followUser(token, userId);
        setUser({ ...user, followedByMe: true, followersCount: user.followersCount + 1 });
      }
    } finally {
      setFollowSubmitting(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || submitting || username.trim().length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const updated = await updateUser(token, userId, { username: username.trim(), bio: bio.trim() });
      setUser(updated);
      if (currentUser) {
        saveAuth(token, { ...currentUser, username: updated.username });
      }
      setEditing(false);
    } catch (err: unknown) {
      const e = err as { body?: { message?: string } };
      setError(e?.body?.message ?? '更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div style={styles.loading}>読み込み中...</div>;
  }

  if (!user) {
    return <div style={styles.loading}>ユーザーが見つかりません</div>;
  }

  const avatarChar = user.username.charAt(0).toUpperCase();

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← タイムライン</button>
      </div>

      <div style={styles.profileCard}>
        <div style={styles.avatar}>{avatarChar}</div>

        {editing ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>ユーザー名</label>
            <input
              style={styles.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={50}
              required
            />
            <span style={styles.hint}>{username.length}/50</span>

            <label style={styles.label}>自己紹介</label>
            <textarea
              style={styles.textarea}
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={160}
              placeholder="自己紹介を入力..."
            />
            <span style={styles.hint}>{bio.length}/160</span>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.formActions}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => { setEditing(false); setUsername(user.username); setBio(user.bio ?? ''); setError(''); }}
              >
                キャンセル
              </button>
              <button
                type="submit"
                style={styles.saveBtn}
                disabled={submitting || username.trim().length === 0}
              >
                {submitting ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 style={styles.username}>@{user.username}</h2>
            <p style={styles.bio}>{user.bio ?? '自己紹介はありません'}</p>

            <div style={styles.stats}>
              <span style={styles.stat}><strong>{user.followingCount}</strong> フォロー中</span>
              <span style={styles.stat}><strong>{user.followersCount}</strong> フォロワー</span>
            </div>

            {isOwner ? (
              <button style={styles.editBtn} onClick={() => setEditing(true)}>
                プロフィールを編集
              </button>
            ) : (
              <button
                style={user.followedByMe ? styles.unfollowBtn : styles.followBtn}
                onClick={handleFollowToggle}
                disabled={followSubmitting}
              >
                {user.followedByMe ? 'フォロー解除' : 'フォロー'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 600, margin: '0 auto', padding: '0 16px' },
  header: { padding: '12px 0', borderBottom: '1px solid #e7e9ea' },
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 14, color: '#1d9bf0', fontWeight: 700,
  },
  loading: { textAlign: 'center', padding: 40, color: '#536471' },
  profileCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '32px 16px', gap: 12,
  },
  avatar: {
    width: 72, height: 72, borderRadius: '50%',
    background: '#1d9bf0', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, fontWeight: 700,
  },
  username: { fontSize: 20, fontWeight: 800, margin: 0, color: '#0f1419' },
  bio: { fontSize: 15, color: '#536471', margin: 0, textAlign: 'center', maxWidth: 400 },
  stats: { display: 'flex', gap: 24, fontSize: 14, color: '#536471' },
  stat: {},
  followBtn: {
    background: '#0f1419', color: '#fff', border: 'none',
    borderRadius: 9999, padding: '8px 20px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  unfollowBtn: {
    background: 'none', border: '1px solid #cfd9de', color: '#0f1419',
    borderRadius: 9999, padding: '8px 20px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  editBtn: {
    background: 'none', border: '1px solid #cfd9de',
    borderRadius: 9999, padding: '8px 20px', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', color: '#0f1419',
  },
  form: { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 400, gap: 4 },
  label: { fontSize: 13, fontWeight: 700, color: '#536471', marginTop: 8 },
  input: {
    border: '1px solid #cfd9de', borderRadius: 4,
    padding: '8px 12px', fontSize: 15, outline: 'none',
  },
  textarea: {
    border: '1px solid #cfd9de', borderRadius: 4,
    padding: '8px 12px', fontSize: 15, outline: 'none',
    minHeight: 80, resize: 'none', fontFamily: 'inherit',
  },
  hint: { fontSize: 12, color: '#536471', textAlign: 'right' },
  error: { color: '#f4212e', fontSize: 13, margin: '4px 0' },
  formActions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  cancelBtn: {
    background: 'none', border: '1px solid #cfd9de',
    borderRadius: 9999, padding: '8px 20px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  saveBtn: {
    background: '#0f1419', color: '#fff', border: 'none',
    borderRadius: 9999, padding: '8px 20px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
};
