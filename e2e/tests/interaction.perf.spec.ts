import { test, expect } from '@playwright/test';

test.describe('ブラウザパフォーマンス（操作レスポンス）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('投稿送信 → タイムライン反映 < 1s', async ({ page }) => {
    const content = `パフォーマンステスト投稿 ${Date.now()}`;
    await page.getByPlaceholder('いまどうしてる？').fill(content);

    const start = Date.now();
    await page.getByRole('button', { name: '投稿する' }).click();
    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: content })).toBeVisible();
    const elapsed = Date.now() - start;

    console.log(`投稿送信レスポンス: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(1000);
  });

  test('いいねクリック → UI反映 < 300ms', async ({ page }) => {
    const content = `いいねパフォーマンステスト ${Date.now()}`;
    await page.getByPlaceholder('いまどうしてる？').fill(content);
    await page.getByRole('button', { name: '投稿する' }).click();
    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: content })).toBeVisible();

    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: content });
    const likeBtn = postCard.locator('[data-testid="like-btn"]');

    const start = Date.now();
    await likeBtn.click();
    await expect(likeBtn).toContainText('❤');
    const elapsed = Date.now() - start;

    console.log(`いいねレスポンス: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(300);
  });

  test('無限スクロール → 追加表示 < 3s', async ({ page }) => {
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    const initialCount = await page.locator('[data-testid="post-card"]').count();

    const start = Date.now();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(
      (count) => document.querySelectorAll('[data-testid="post-card"]').length > count,
      initialCount,
      { timeout: 3000 }
    ).catch(() => {});
    const elapsed = Date.now() - start;

    console.log(`スクロール追加表示レスポンス: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(3000);
  });

  test('検索入力 → 結果表示 < 1s', async ({ page }) => {
    await page.goto('/search');
    const start = Date.now();
    await page.getByPlaceholder('ユーザー名を入力...').fill('e2euser_bob');
    await expect(page.getByText('e2euser_bob')).toBeVisible();
    const elapsed = Date.now() - start;

    console.log(`検索レスポンス: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(1000);
  });
});
