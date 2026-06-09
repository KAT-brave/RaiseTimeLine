import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, ApiError } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      saveAuth(res.token, res.user);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('メールアドレスまたはパスワードが正しくありません');
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
      <h2 style={styles.subtitle}>ログイン</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
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
        </div>
        <div style={styles.field}>
          <label style={styles.label}>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
            placeholder="パスワードを入力"
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
      <p style={styles.switchText}>
        アカウントをお持ちでない方は <Link to="/signup">新規登録</Link>
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
  error: { color: '#f4212e', fontSize: 14, margin: 0 },
  button: {
    padding: '12px 20px', background: '#0f1419', color: '#fff', border: 'none',
    borderRadius: 9999, fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  switchText: { textAlign: 'center', marginTop: 16, fontSize: 14, color: '#536471' },
};
