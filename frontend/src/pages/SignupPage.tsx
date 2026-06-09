import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, ApiError } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await signup(username, email, password);
      saveAuth(res.token, res.user);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body as { errors?: Record<string, string>; error?: string };
        if (body.errors) {
          setFieldErrors(body.errors);
        } else if (body.error) {
          setError(body.error);
        }
      } else {
        setError('エラーが発生しました。しばらくしてからお試しください。');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>RaiseTimeLine</h1>
      <h2 style={styles.subtitle}>新規登録</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>ユーザー名</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={styles.input}
            placeholder="username"
          />
          {fieldErrors.username && <span style={styles.fieldError}>{fieldErrors.username}</span>}
        </div>
        <div style={styles.field}>
          <label style={styles.label}>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
            placeholder="example@email.com"
          />
          {fieldErrors.email && <span style={styles.fieldError}>{fieldErrors.email}</span>}
        </div>
        <div style={styles.field}>
          <label style={styles.label}>パスワード（8文字以上）</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="パスワードを入力"
          />
          {fieldErrors.password && <span style={styles.fieldError}>{fieldErrors.password}</span>}
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? '登録中...' : '登録する'}
        </button>
      </form>
      <p style={styles.switchText}>
        すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 400, margin: '80px auto', padding: '0 24px' },
  title: { fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 22, fontWeight: 700, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 14, color: '#536471' },
  input: { padding: '12px 16px', border: '1px solid #cfd9de', borderRadius: 8, fontSize: 15 },
  fieldError: { color: '#f4212e', fontSize: 13 },
  error: { color: '#f4212e', fontSize: 14, margin: 0 },
  button: {
    padding: '12px 20px', background: '#0f1419', color: '#fff', border: 'none',
    borderRadius: 9999, fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  switchText: { textAlign: 'center', marginTop: 16, fontSize: 14, color: '#536471' },
};
