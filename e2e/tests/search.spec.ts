import { test, expect } from '@playwright/test';

test.describe('ユーザー検索', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  test('ユーザー名で検索 → 結果表示', async ({ page }) => {
    await page.getByPlaceholder('ユーザー名を入力...').fill('e2euser_bob');
    await page.waitForTimeout(500);
    await expect(page.getByText('e2euser_bob')).toBeVisible();
  });

  test('検索結果クリック → プロフィールページ遷移', async ({ page }) => {
    await page.getByPlaceholder('ユーザー名を入力...').fill('e2euser_bob');
    await page.waitForTimeout(500);
    await page.getByText('e2euser_bob').click();
    await expect(page).toHaveURL(/\/users\//);
    await expect(page.getByText('@e2euser_bob')).toBeVisible();
  });

  test('該当なし → 適切なメッセージ表示', async ({ page }) => {
    await page.getByPlaceholder('ユーザー名を入力...').fill('nonexistent_xyz_99999');
    await page.waitForTimeout(500);
    await expect(page.getByText(/見つかりません|該当|ユーザーがいません/i)).toBeVisible();
  });
});
