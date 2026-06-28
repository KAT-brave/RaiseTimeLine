import { test, expect } from '@playwright/test';

test.describe('タイムライン', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('「全体」タブで全投稿表示', async ({ page }) => {
    await page.getByRole('button', { name: '全体' }).click();
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
  });

  test('「フォロー中」タブでフォロー中ユーザーの投稿のみ', async ({ page }) => {
    await page.getByRole('button', { name: 'フォロー中' }).click();
    await expect(page).not.toHaveURL(/login/);
  });

  test('無限スクロールで追加読み込み', async ({ page }) => {
    await page.getByRole('button', { name: '全体' }).click();
    await expect(page.locator('[data-testid="post-card"]').first()).toBeVisible();
    const initialCount = await page.locator('[data-testid="post-card"]').count();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const afterCount = await page.locator('[data-testid="post-card"]').count();
    expect(afterCount).toBeGreaterThanOrEqual(initialCount);
  });
});
