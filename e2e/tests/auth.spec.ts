import { test, expect } from '@playwright/test';

// 認証テストはstorageStateなしで実行
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('認証フロー', () => {
  test('新規登録 → ホームにリダイレクト', async ({ page }) => {
    const unique = Date.now();
    await page.goto('/signup');

    await page.getByPlaceholder('username').fill(`e2enew${unique}`);
    await page.getByPlaceholder('example@email.com').fill(`e2enew${unique}@e2e.test`);
    await page.getByPlaceholder('パスワードを入力').fill('E2eTestPass1');
    await page.getByRole('button', { name: '登録する' }).click();

    await expect(page).toHaveURL('/');
  });

  test('無効な認証情報でログイン → エラーメッセージ表示', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('example@email.com').fill('wrong@e2e.test');
    await page.getByPlaceholder('パスワードを入力').fill('wrongpass');
    await page.getByRole('button', { name: 'ログイン' }).click();

    await expect(page.getByText(/メールアドレスまたはパスワード/i)).toBeVisible();
  });

  test('重複メールで登録 → バリデーションエラー', async ({ page }) => {
    await page.goto('/signup');
    await page.getByPlaceholder('username').fill('e2euser_duptest');
    await page.getByPlaceholder('example@email.com').fill('e2euser_alice@e2e.test');
    await page.getByPlaceholder('パスワードを入力').fill('E2eTestPass1');
    await page.getByRole('button', { name: '登録する' }).click();

    await expect(page.getByText(/すでに使用|重複|登録済み/i)).toBeVisible();
  });

  test('未認証で / アクセス → /login にリダイレクト', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('ログアウト → ログインページにリダイレクト', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('example@email.com').fill('e2euser_alice@e2e.test');
    await page.getByPlaceholder('パスワードを入力').fill('E2eTestPass1');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/');

    await page.getByRole('button', { name: 'ログアウト' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
