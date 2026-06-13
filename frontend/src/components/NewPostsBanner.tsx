interface Props {
  count: number;
  onRefresh: () => void;
}

export default function NewPostsBanner({ count, onRefresh }: Props) {
  if (count === 0) return null;

  function handleClick() {
    onRefresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} onClick={handleClick}>
        <span style={styles.icon}>🔔</span>
        <span style={styles.text}>{count}件の新しい投稿があります</span>
        <span style={styles.sub}>クリックして最新を表示</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    background: '#0f1419',
    color: '#fff',
    padding: '14px 28px',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
    cursor: 'pointer',
    pointerEvents: 'auto',
    minWidth: 220,
    textAlign: 'center',
  },
  icon: {
    fontSize: 22,
  },
  text: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.4,
  },
  sub: {
    fontSize: 12,
    color: '#8899a6',
    fontWeight: 400,
  },
};
