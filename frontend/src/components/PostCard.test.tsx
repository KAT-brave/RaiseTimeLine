import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PostCard from './PostCard'
import type { PostResponse } from '../api/posts'

// AuthContext をモック
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'mock-token' }),
}))

// APIをモック
vi.mock('../api/posts', () => ({
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}))
vi.mock('../api/likes', () => ({
  addLike: vi.fn(),
  removeLike: vi.fn(),
}))
vi.mock('./CommentSection', () => ({
  default: () => <div data-testid="comment-section" />,
}))

const mockPost: PostResponse = {
  id: 1,
  content: 'テスト投稿の内容',
  createdAt: '2024-01-01T10:00:00',
  updatedAt: '2024-01-01T10:00:00',
  user: { id: 1, username: 'testuser', avatarUrl: null },
  images: [],
  likesCount: 5,
  commentsCount: 3,
  likedByMe: false,
}

function renderCard(overrides: Partial<PostResponse> = {}, currentUserId = 2) {
  const post = { ...mockPost, ...overrides }
  return render(
    <MemoryRouter>
      <PostCard
        post={post}
        currentUserId={currentUserId}
        onUpdated={vi.fn()}
        onDeleted={vi.fn()}
      />
    </MemoryRouter>
  )
}

describe('PostCard', () => {
  // ========== ブラックボックステスト（表示内容の検証）==========

  it('投稿内容が表示される', () => {
    renderCard()
    expect(screen.getByText('テスト投稿の内容')).toBeInTheDocument()
  })

  it('ユーザー名が表示される', () => {
    renderCard()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
  })

  it('いいね数が表示される', () => {
    renderCard()
    expect(screen.getByText('♡ 5')).toBeInTheDocument()
  })

  it('コメント数が表示される', () => {
    renderCard()
    expect(screen.getByText('💬 3')).toBeInTheDocument()
  })

  // ========== ホワイトボックステスト（所有者チェック分岐）==========

  it('自分の投稿には編集メニューが表示される', () => {
    renderCard({}, 1) // currentUserId=1 = post.user.id
    const menuBtn = screen.getByText('⋯')
    expect(menuBtn).toBeInTheDocument()
  })

  it('他人の投稿には編集メニューが表示されない', () => {
    renderCard({}, 2) // currentUserId=2 ≠ post.user.id=1
    expect(screen.queryByText('⋯')).not.toBeInTheDocument()
  })

  // ========== ブラックボックステスト（いいね状態の表示）==========

  it('likedByMe=true のとき❤が表示される', () => {
    renderCard({ likedByMe: true, likesCount: 10 })
    expect(screen.getByText('❤ 10')).toBeInTheDocument()
  })

  it('likedByMe=false のとき♡が表示される', () => {
    renderCard({ likedByMe: false, likesCount: 5 })
    expect(screen.getByText('♡ 5')).toBeInTheDocument()
  })

  // ========== インタラクション ==========

  it('💬ボタンをクリックするとコメントセクションが表示される', () => {
    renderCard()
    expect(screen.queryByTestId('comment-section')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('💬 3'))
    expect(screen.getByTestId('comment-section')).toBeInTheDocument()
  })

  it('⋯ボタンをクリックすると編集・削除メニューが表示される', () => {
    renderCard({}, 1)
    fireEvent.click(screen.getByText('⋯'))
    expect(screen.getByText('編集')).toBeInTheDocument()
    expect(screen.getByText('削除')).toBeInTheDocument()
  })
})
