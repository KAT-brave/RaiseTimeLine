import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PostForm from './PostForm'
import * as postsApi from '../api/posts'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'mock-token' }),
}))
vi.mock('../api/posts', () => ({
  createPost: vi.fn(),
}))

describe('PostForm', () => {
  const mockOnCreated = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ========== ブラックボックステスト ==========

  it('テキストエリアのプレースホルダーが表示される', () => {
    render(<PostForm onCreated={mockOnCreated} />)
    expect(screen.getByPlaceholderText('いまどうしてる？')).toBeInTheDocument()
  })

  it('初期状態で「投稿する」ボタンが無効になっている', () => {
    render(<PostForm onCreated={mockOnCreated} />)
    expect(screen.getByText('投稿する')).toBeDisabled()
  })

  it('文字を入力すると「投稿する」ボタンが有効になる', () => {
    render(<PostForm onCreated={mockOnCreated} />)
    fireEvent.change(screen.getByPlaceholderText('いまどうしてる？'), {
      target: { value: 'テスト投稿' },
    })
    expect(screen.getByText('投稿する')).not.toBeDisabled()
  })

  // ========== 境界値テスト ==========

  it('280文字以内のとき残り文字数がカウントダウン表示される', () => {
    render(<PostForm onCreated={mockOnCreated} />)
    expect(screen.getByText('280')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('いまどうしてる？'), {
      target: { value: 'あ'.repeat(10) },
    })
    expect(screen.getByText('270')).toBeInTheDocument()
  })

  it('281文字以上のとき「投稿する」ボタンが無効になる（文字数オーバー）', () => {
    render(<PostForm onCreated={mockOnCreated} />)
    fireEvent.change(screen.getByPlaceholderText('いまどうしてる？'), {
      target: { value: 'a'.repeat(281) },
    })
    expect(screen.getByText('投稿する')).toBeDisabled()
  })

  // ========== インタラクション ==========

  it('投稿送信成功後に onCreated が呼ばれてフォームがクリアされる', async () => {
    const mockPost = {
      id: 1, content: 'テスト投稿', createdAt: '', updatedAt: '',
      user: { id: 1, username: 'user', avatarUrl: null },
      images: [], likesCount: 0, commentsCount: 0, likedByMe: false,
    }
    vi.mocked(postsApi.createPost).mockResolvedValue(mockPost)

    render(<PostForm onCreated={mockOnCreated} />)
    fireEvent.change(screen.getByPlaceholderText('いまどうしてる？'), {
      target: { value: 'テスト投稿' },
    })
    fireEvent.click(screen.getByText('投稿する'))

    await waitFor(() => expect(mockOnCreated).toHaveBeenCalledWith(mockPost))
    expect(screen.getByPlaceholderText('いまどうしてる？')).toHaveValue('')
  })
})
