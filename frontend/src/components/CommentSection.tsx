import { useState, useEffect, type FormEvent } from 'react';
import { fetchComments, createComment, deleteComment, type CommentResponse } from '../api/comments';
import { useAuth } from '../context/AuthContext';

interface Props {
  postId: number;
  currentUserId: number;
  onCountChange: (count: number) => void;
}

export default function CommentSection({ postId, currentUserId, onCountChange }: Props) {
  const { token } = useAuth();
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchComments(token, postId)
      .then(data => {
        setComments(data);
        onCountChange(data.length);
      })
      .finally(() => setLoading(false));
  }, [postId, token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || submitting || input.trim().length === 0) return;
    setSubmitting(true);
    try {
      const created = await createComment(token, postId, input.trim());
      const next = [...comments, created];
      setComments(next);
      onCountChange(next.length);
      setInput('');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: number) {
    if (!token) return;
    await deleteComment(token, postId, commentId);
    const next = comments.filter(c => c.id !== commentId);
    setComments(next);
    onCountChange(next.length);
  }

  return (
    <div style={styles.wrap}>
      {loading ? (
        <p style={styles.loading}>読み込み中...</p>
      ) : (
        <ul style={styles.list}>
          {comments.map(c => (
            <li key={c.id} style={styles.item}>
              <div style={styles.commentAvatar}>{c.user.username.charAt(0).toUpperCase()}</div>
              <div style={styles.commentBody}>
                <div style={styles.commentHeader}>
                  <span style={styles.commentUsername}>@{c.user.username}</span>
                  <span style={styles.commentTime}>
                    {new Date(c.createdAt).toLocaleString('ja-JP', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  {c.user.id === currentUserId && (
                    <button style={styles.deleteBtn} onClick={() => handleDelete(c.id)}>削除</button>
                  )}
                </div>
                <p style={styles.commentContent}>{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="コメントを入力..."
          style={styles.input}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={submitting || input.trim().length === 0}
          style={styles.submitBtn}
        >
          {submitting ? '送信中' : '送信'}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { marginTop: 8, borderTop: '1px solid #e7e9ea', paddingTop: 8 },
  loading: { fontSize: 13, color: '#536471', margin: '4px 0' },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  item: { display: 'flex', gap: 8 },
  commentAvatar: {
    width: 28, height: 28, borderRadius: '50%',
    background: '#536471', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  commentBody: { flex: 1, minWidth: 0 },
  commentHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 },
  commentUsername: { fontWeight: 700, fontSize: 13, color: '#0f1419' },
  commentTime: { fontSize: 12, color: '#536471' },
  deleteBtn: {
    marginLeft: 'auto', background: 'none', border: 'none',
    color: '#f4212e', fontSize: 12, cursor: 'pointer', padding: 0,
  },
  commentContent: { fontSize: 14, color: '#0f1419', margin: 0, wordBreak: 'break-word' },
  form: { display: 'flex', gap: 8, marginTop: 10 },
  input: {
    flex: 1, border: '1px solid #cfd9de', borderRadius: 9999,
    padding: '6px 12px', fontSize: 14, outline: 'none',
  },
  submitBtn: {
    background: '#1d9bf0', color: '#fff', border: 'none',
    borderRadius: 9999, padding: '6px 14px', fontSize: 13,
    fontWeight: 700, cursor: 'pointer',
  },
};
