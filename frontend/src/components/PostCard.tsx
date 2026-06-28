import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { updatePost, deletePost, type PostResponse } from '../api/posts';
import { addLike, removeLike } from '../api/likes';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

const MAX_CHARS = 280;

interface Props {
  post: PostResponse;
  currentUserId: number;
  onUpdated: (post: PostResponse) => void;
  onDeleted: (id: number) => void;
}

export default function PostCard({ post, currentUserId, onUpdated, onDeleted }: Props) {
  const { token } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [likedByMe, setLikedByMe] = useState(post.likedByMe);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = post.user.id === currentUserId;
  const remaining = MAX_CHARS - editContent.length;
  const overLimit = remaining < 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLikeToggle() {
    if (!token || likeSubmitting) return;
    setLikeSubmitting(true);
    try {
      if (likedByMe) {
        await removeLike(token, post.id);
        setLikedByMe(false);
        setLikesCount(c => c - 1);
      } else {
        await addLike(token, post.id);
        setLikedByMe(true);
        setLikesCount(c => c + 1);
      }
    } finally {
      setLikeSubmitting(false);
    }
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!token || submitting || overLimit || editContent.trim().length === 0) return;
    setSubmitting(true);
    try {
      const updated = await updatePost(token, post.id, editContent.trim());
      onUpdated(updated);
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!token) return;
    setDeleteError('');
    try {
      await deletePost(token, post.id);
      onDeleted(post.id);
    } catch {
      setDeleteError('削除に失敗しました。もう一度お試しください。');
    }
  }

  const formattedTime = new Date(post.createdAt).toLocaleString('ja-JP', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const avatarChar = post.user.username.charAt(0).toUpperCase();

  return (
    <div style={styles.card} data-testid="post-card">
      <div style={styles.avatar}>{avatarChar}</div>
      <div style={styles.body}>
        <div style={styles.header}>
          <Link to={`/users/${post.user.id}`} style={styles.username}>@{post.user.username}</Link>
          <span style={styles.time}>{formattedTime}</span>
          {isOwner && (
            <div style={styles.menuWrap} ref={menuRef}>
              <button style={styles.menuBtn} onClick={() => setMenuOpen(v => !v)} data-testid="menu-btn">⋯</button>
              {menuOpen && (
                <div style={styles.dropdown}>
                  <button style={styles.dropItem} onClick={() => { setEditing(true); setMenuOpen(false); }}>
                    編集
                  </button>
                  <button style={{ ...styles.dropItem, color: '#f4212e' }} onClick={() => { setShowDeleteConfirm(true); setMenuOpen(false); }}>
                    削除
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} style={styles.editForm}>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              style={styles.editTextarea}
              autoFocus
            />
            <div style={styles.editFooter}>
              <span style={{ fontSize: 13, color: overLimit ? '#f4212e' : '#536471' }}>{remaining}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" style={styles.cancelBtn} onClick={() => { setEditing(false); setEditContent(post.content); }}>
                  キャンセル
                </button>
                <button type="submit" disabled={submitting || overLimit || editContent.trim().length === 0} style={styles.saveBtn}>
                  {submitting ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <p style={styles.content}>{post.content}</p>
        )}

        <div style={styles.actions}>
          <button
            style={{ ...styles.likeAction, color: likedByMe ? '#f4212e' : '#536471' }}
            onClick={handleLikeToggle}
            disabled={likeSubmitting}
            data-testid="like-btn"
          >
            {likedByMe ? '❤' : '♡'} {likesCount}
          </button>
          <button style={styles.commentAction} onClick={() => setShowComments(v => !v)} data-testid="comment-toggle-btn">
            💬 {commentsCount}
          </button>
        </div>

        {showComments && (
          <CommentSection
            postId={post.id}
            currentUserId={currentUserId}
            onCountChange={setCommentsCount}
          />
        )}
      </div>

      {showDeleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <h3 style={styles.dialogTitle}>投稿を削除しますか？</h3>
            <p style={styles.dialogDesc}>この操作は取り消せません。</p>
            {deleteError && <p style={{ color: '#f4212e', fontSize: 13, margin: '0 0 12px' }}>{deleteError}</p>}
            <div style={styles.dialogActions}>
              <button style={styles.cancelBtn} onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }}>キャンセル</button>
              <button style={{ ...styles.saveBtn, background: '#f4212e' }} onClick={handleDelete}>削除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex', gap: 12, padding: '12px 16px',
    borderBottom: '1px solid #e7e9ea',
  },
  avatar: {
    width: 40, height: 40, borderRadius: '50%',
    background: '#1d9bf0', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700, flexShrink: 0,
  },
  body: { flex: 1, minWidth: 0 },
  header: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  username: { fontWeight: 700, fontSize: 15, color: '#0f1419', textDecoration: 'none' },
  time: { fontSize: 13, color: '#536471' },
  menuWrap: { marginLeft: 'auto', position: 'relative' },
  menuBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 18, color: '#536471', padding: '0 4px',
  },
  dropdown: {
    position: 'absolute', right: 0, top: '100%',
    background: '#fff', border: '1px solid #e7e9ea',
    borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 10, minWidth: 100,
  },
  dropItem: {
    display: 'block', width: '100%', padding: '10px 16px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 600, textAlign: 'left',
  },
  content: { fontSize: 15, color: '#0f1419', margin: '0 0 8px', wordBreak: 'break-word', lineHeight: 1.6 },
  actions: { display: 'flex', gap: 20 },
  action: { fontSize: 13, color: '#536471', cursor: 'default' },
  likeAction: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 13, padding: 0, fontFamily: 'inherit',
  },
  commentAction: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 13, color: '#536471', padding: 0,
  },
  editForm: { marginBottom: 8 },
  editTextarea: {
    width: '100%', minHeight: 80, border: '1px solid #1d9bf0',
    borderRadius: 4, padding: 8, fontSize: 15, resize: 'none',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'sans-serif',
  },
  editFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cancelBtn: {
    background: 'none', border: '1px solid #cfd9de',
    borderRadius: 9999, padding: '6px 16px', fontSize: 14,
    fontWeight: 700, cursor: 'pointer',
  },
  saveBtn: {
    background: '#0f1419', color: '#fff',
    border: 'none', borderRadius: 9999, padding: '6px 16px',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  dialog: {
    background: '#fff', borderRadius: 16, padding: '24px',
    maxWidth: 360, width: '90%',
  },
  dialogTitle: { fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: '#0f1419' },
  dialogDesc: { fontSize: 14, color: '#536471', margin: '0 0 20px' },
  dialogActions: { display: 'flex', justifyContent: 'flex-end', gap: 12 },
};
