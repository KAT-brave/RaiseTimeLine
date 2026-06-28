import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NewPostsBanner from './NewPostsBanner'

describe('NewPostsBanner', () => {
  // ========== ブラックボックステスト ==========

  it('count=0 のとき何も表示されない', () => {
    const { container } = render(<NewPostsBanner count={0} onRefresh={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('count>0 のとき新着件数が表示される', () => {
    render(<NewPostsBanner count={3} onRefresh={vi.fn()} />)
    expect(screen.getByText('3件の新しい投稿があります')).toBeInTheDocument()
  })

  it('クリックすると onRefresh が呼ばれる', () => {
    const onRefresh = vi.fn()
    render(<NewPostsBanner count={3} onRefresh={onRefresh} />)
    fireEvent.click(screen.getByText('3件の新しい投稿があります'))
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  // ========== 境界値テスト ==========

  it('count=1 のとき「1件の新しい投稿があります」が表示される', () => {
    render(<NewPostsBanner count={1} onRefresh={vi.fn()} />)
    expect(screen.getByText('1件の新しい投稿があります')).toBeInTheDocument()
  })
})
