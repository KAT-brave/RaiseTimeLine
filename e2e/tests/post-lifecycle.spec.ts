import { test, expect } from '@playwright/test';

test.describe('投稿CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('テキスト投稿作成 → タイムラインに表示', async ({ page }) => {
    const content = `E2Eテスト投稿 ${Date.now()}`;
    await page.getByPlaceholder('いまどうしてる？').fill(content);
    await page.getByRole('button', { name: '投稿する' }).click();

    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: content })).toBeVisible();
  });

  test('自分の投稿を編集 → 内容更新を確認', async ({ page }) => {
    const original = `編集前テスト ${Date.now()}`;
    const updated = `編集後テスト ${Date.now()}`;

    await page.getByPlaceholder('いまどうしてる？').fill(original);
    await page.getByRole('button', { name: '投稿する' }).click();
    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: original })).toBeVisible();

    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: original });
    await postCard.locator('[data-testid="menu-btn"]').click();
    await page.getByRole('button', { name: '編集' }).click();

    // 編集モード中はoriginalテキストが消えるので最初のカードから取得
    const editingCard = page.locator('[data-testid="post-card"]').first();
    const editArea = editingCard.getByRole('textbox');
    await editArea.clear();
    await editArea.fill(updated);
    await editingCard.getByRole('button', { name: '保存' }).click();

    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: updated })).toBeVisible();
  });

  test('自分の投稿を削除 → タイムラインから消失', async ({ page }) => {
    const content = `削除テスト ${Date.now()}`;
    await page.getByPlaceholder('いまどうしてる？').fill(content);
    await page.getByRole('button', { name: '投稿する' }).click();
    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: content })).toBeVisible();

    const postCard = page.locator('[data-testid="post-card"]').filter({ hasText: content });
    await postCard.locator('[data-testid="menu-btn"]').click();
    await page.getByRole('button', { name: '削除' }).first().click();
    await page.getByRole('button', { name: '削除' }).last().click();

    await expect(page.locator('[data-testid="post-card"]').filter({ hasText: content })).not.toBeVisible();
  });

  test('280文字制限の境界値テスト', async ({ page }) => {
    const text280 = 'あ'.repeat(280);
    const text281 = 'あ'.repeat(281);

    await page.getByPlaceholder('いまどうしてる？').fill(text280);
    await expect(page.getByRole('button', { name: '投稿する' })).toBeEnabled();

    await page.getByPlaceholder('いまどうしてる？').fill(text281);
    await expect(page.getByRole('button', { name: '投稿する' })).toBeDisabled();
  });
});
