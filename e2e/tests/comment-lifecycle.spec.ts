import { test, expect } from '@playwright/test';

test.describe('コメント', () => {
  let postContent: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    postContent = `コメントテスト用投稿 ${Date.now()}`;
    await page.getByPlaceholder('いまどうしてる？').fill(postContent);
    await page.getByRole('button', { name: '投稿する' }).click();
    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: postContent })).toBeVisible();
  });

  test('投稿にコメント追加 → スレッドに表示', async ({ page }) => {
    const commentText = `テストコメント ${Date.now()}`;
    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: postContent });

    await postCard.locator('[data-testid="comment-toggle-btn"]').click();
    await postCard.getByPlaceholder('コメントを入力...').fill(commentText);
    await postCard.getByRole('button', { name: '送信' }).click();

    await expect(postCard.getByText(commentText)).toBeVisible();
  });

  test('自分のコメントを削除', async ({ page }) => {
    const commentText = `削除コメント ${Date.now()}`;
    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: postContent });

    await postCard.locator('[data-testid="comment-toggle-btn"]').click();
    await postCard.getByPlaceholder('コメントを入力...').fill(commentText);
    await postCard.getByRole('button', { name: '送信' }).click();
    await expect(postCard.getByText(commentText)).toBeVisible();

    await postCard.getByText(commentText).locator('..').locator('..').getByRole('button', { name: '削除' }).click();
    await expect(postCard.getByText(commentText)).not.toBeVisible();
  });

  test('空のコメントは送信ボタンが無効', async ({ page }) => {
    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: postContent });
    await postCard.locator('[data-testid="comment-toggle-btn"]').click();
    await expect(postCard.getByRole('button', { name: '送信' })).toBeDisabled();

    await postCard.getByPlaceholder('コメントを入力...').fill('テスト');
    await expect(postCard.getByRole('button', { name: '送信' })).toBeEnabled();
  });
});
