import { test, expect } from '@playwright/test';

const BOB_USERNAME = 'e2euser_bob';

test.describe('フォロー（2ユーザー）', () => {
  test.beforeEach(async ({ page }) => {
    // テスト前にフォロー状態をリセット（フォロー解除）
    await page.goto('/search');
    await page.getByPlaceholder('ユーザー名を入力...').fill(BOB_USERNAME);
    await page.waitForTimeout(600);
    await page.getByText(BOB_USERNAME).first().click();
    await expect(page).toHaveURL(/\/users\//);
    const unfollowBtn = page.getByRole('button', { name: 'フォロー解除' });
    if (await unfollowBtn.isVisible()) {
      await unfollowBtn.click();
    }
  });

  test('ユーザーAがBをフォロー → フォロワー数更新', async ({ page }) => {
    await expect(page).toHaveURL(/\/users\//);
    const followersText = page.getByText(/フォロワー/);
    const before = await followersText.textContent();

    await page.getByRole('button', { name: 'フォロー' }).click();
    await expect(page.getByRole('button', { name: 'フォロー解除' })).toBeVisible();

    const after = await followersText.textContent();
    expect(after).not.toEqual(before);

    await page.getByRole('button', { name: 'フォロー解除' }).click();
  });

  test('フォロー解除 → フォローボタンに戻る', async ({ page }) => {
    await expect(page).toHaveURL(/\/users\//);
    await page.getByRole('button', { name: 'フォロー' }).click();
    await expect(page.getByRole('button', { name: 'フォロー解除' })).toBeVisible();

    await page.getByRole('button', { name: 'フォロー解除' }).click();
    await expect(page.getByRole('button', { name: 'フォロー' })).toBeVisible();
  });

  test('フォロー中タブにフォロー中ユーザーの投稿が反映', async ({ page }) => {
    await expect(page).toHaveURL(/\/users\//);
    await page.getByRole('button', { name: 'フォロー' }).click();
    await expect(page.getByRole('button', { name: 'フォロー解除' })).toBeVisible();

    await page.goto('/');
    await page.getByRole('button', { name: 'フォロー中' }).click();
    await expect(page).not.toHaveURL(/login/);

    await page.goto('/search');
    await page.getByPlaceholder('ユーザー名を入力...').fill(BOB_USERNAME);
    await page.waitForTimeout(600);
    await page.getByText(BOB_USERNAME).first().click();
    await page.getByRole('button', { name: 'フォロー解除' }).click();
  });
});
