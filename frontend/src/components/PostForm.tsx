import { useState, type FormEvent } from 'react';
import { createPost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import type { PostResponse } from '../api/posts';

const MAX_CHARS = 280;

interface Props {
  onCreated: (post: PostResponse) => void;
}

export default function PostForm({ onCreated }: Props) {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const remaining = MAX_CHARS - content.length;
  const overLimit = remaining < 0;
  const isEmpty = content.trim().length === 0;

  const counterColor = overLimit ? '#f4212e' : remaining <= 20 ? '#ff7900' : '#536471';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isEmpty || overLimit || submitting || !token) return;
    setSubmitting(true);
    setError('');
    try {
      const post = await createPost(token, content.trim());
      onCreated(post);
      setContent('');
    } catch {
      setError('投稿の送信に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="いまどうしてる？"
        style={styles.textarea}
        maxLength={MAX_CHARS + 50}
      />
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.footer}>
        <span style={{ ...styles.counter, color: counterColor }}>
          {remaining}
        </span>
        <div style={styles.rightGroup}>
          <button
            type="button"
            style={styles.imageBtn}
            disabled
            title="画像添付（準備中）"
          >
            🖼
          </button>
          <button
            type="submit"
            disabled={isEmpty || overLimit || submitting}
            style={{
              ...styles.submitBtn,
              opacity: isEmpty || overLimit || submitting ? 0.5 : 1,
            }}
          >
            {submitting ? '投稿中...' : '投稿する'}
          </button>
        </div>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    padding: '12px 16px',
    borderBottom: '1px solid #e7e9ea',
  },
  textarea: {
    width: '100%',
    minHeight: 80,
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontSize: 18,
    fontFamily: 'sans-serif',
    boxSizing: 'border-box',
    lineHeight: 1.5,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  counter: {
    fontSize: 14,
    fontWeight: 600,
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  imageBtn: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    cursor: 'not-allowed',
    opacity: 0.4,
    padding: '4px 8px',
  },
  submitBtn: {
    background: '#0f1419',
    color: '#fff',
    border: 'none',
    borderRadius: 9999,
    padding: '8px 20px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: { color: '#f4212e', fontSize: 13, margin: '4px 0 0' },
};
