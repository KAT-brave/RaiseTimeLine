import { test, expect } from '@playwright/test';

test.describe('プロフィール', () => {
  test('ユーザー名・自己紹介を編集 → 変更反映', async ({ page }) => {
    // タイムラインからaliceのユーザーリンクをクリックしてプロフィールへ
    await page.goto('/');
    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: '@e2euser_alice' }).first()).toBeVisible();
    await page.locator('[data-testid="post-card"]').filter({ hasText: '@e2euser_alice' }).first().getByText('@e2euser_alice').click();

    await expect(page).toHaveURL(/\/users\//);
    await page.getByRole('button', { name: 'プロフィールを編集' }).click();

    const newBio = `自己紹介テスト ${Date.now()}`;
    await page.getByPlaceholder('自己紹介を入力...').clear();
    await page.getByPlaceholder('自己紹介を入力...').fill(newBio);
    await page.getByRole('button', { name: '保存' }).click();

    await expect(page.getByText(newBio)).toBeVisible();
  });

  test('プロフィールページに自分の投稿表示', async ({ page }) => {
    await page.goto('/');
    const content = `プロフィールテスト投稿 ${Date.now()}`;
    await page.getByPlaceholder('いまどうしてる？').fill(content);
    await page.getByRole('button', { name: '投稿する' }).click();
    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: content })).toBeVisible();

    // タイムラインからaliceのユーザーリンクをクリック
    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: content });
    await postCard.getByText('@e2euser_alice').click();

    await expect(page).toHaveURL(/\/users\//);
    await expect(page.getByText(content)).toBeVisible();
  });
});
