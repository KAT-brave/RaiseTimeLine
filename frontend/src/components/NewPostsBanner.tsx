interface Props {
  count: number;
  onRefresh: () => void;
}

export default function NewPostsBanner({ count, onRefresh }: Props) {
  if (count === 0) return null;
  return (
    <div style={styles.banner} onClick={onRefresh}>
      {count}件の新しい投稿があります
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  banner: {
    background: '#1d9bf0',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 9999,
    margin: '8px 16px',
  },
};
