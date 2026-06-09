import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { currentUser, clearAuth } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.logo}>RaiseTimeLine</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>ログアウト</button>
      </header>
      <main style={styles.main}>
        <h1 style={styles.greeting}>Hello, {currentUser?.username}! 👋</h1>
        <p style={styles.desc}>ログインに成功しました。タイムライン機能は今後実装予定です。</p>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 16px', borderBottom: '1px solid #e7e9ea',
    position: 'sticky', top: 0, background: '#fff',
  },
  logo: { fontSize: 20, fontWeight: 800 },
  logoutBtn: {
    padding: '8px 16px', background: 'transparent', border: '1px solid #cfd9de',
    borderRadius: 9999, fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  main: { padding: '48px 24px', textAlign: 'center' },
  greeting: { fontSize: 28, fontWeight: 700, marginBottom: 12 },
  desc: { fontSize: 16, color: '#536471' },
};
