import { test, expect } from '@playwright/test';

test.describe('いいね', () => {
  let postContent: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    postContent = `いいねテスト投稿 ${Date.now()}`;
    await page.getByPlaceholder('いまどうしてる？').fill(postContent);
    await page.getByRole('button', { name: '投稿する' }).click();
    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: postContent })).toBeVisible();
  });

  test('いいね → カウント増加・アイコン変化', async ({ page }) => {
    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: postContent });
    const likeBtn = postCard.locator('[data-testid="like-btn"]');

    await expect(likeBtn).toContainText('♡');
    await likeBtn.click();
    await expect(likeBtn).toContainText('❤');
  });

  test('いいね解除 → カウント減少', async ({ page }) => {
    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: postContent });
    const likeBtn = postCard.locator('[data-testid="like-btn"]');

    await likeBtn.click();
    await expect(likeBtn).toContainText('❤');
    await likeBtn.click();
    await expect(likeBtn).toContainText('♡');
  });

  test('リロード後もいいね状態維持', async ({ page }) => {
    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: postContent });
    const likeBtn = postCard.locator('[data-testid="like-btn"]');

    await likeBtn.click();
    await expect(likeBtn).toContainText('❤');

    await page.reload();
    const reloadedCard = page.locator('[data-testid="post-card"]').filter({ hasText: postContent });
    await expect(reloadedCard.locator('[data-testid="like-btn"]')).toContainText('❤');
  });
});
