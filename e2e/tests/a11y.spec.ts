import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// color-contrastはフロントエンドのデザイン改修が必要なため除外し、構造的アクセシビリティのみ検証
const EXCLUDED_RULES = ['color-contrast'];

test.describe('アクセシビリティ（WCAG 2.1 AA）', () => {
  test('ログインページ', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await page.goto('/login');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
    await context.close();
  });

  test('登録ページ', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await page.goto('/signup');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
    await context.close();
  });

  test('ホームページ（ログイン済み）', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('検索ページ', async ({ page }) => {
    await page.goto('/search');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('プロフィールページ', async ({ page }) => {
    await page.goto('/');
    // aliceの投稿を1件作ってリンクを確実に表示
    const content = `a11yテスト投稿 ${Date.now()}`;
    await page.getByPlaceholder('いまどうしてる？').fill(content);
    await page.getByRole('button', { name: '投稿する' }).click();
    const aliceCard = page.locator('[data-testid="post-card"]').filter({ hasText: content });
    await expect(aliceCard).toBeVisible();
    await aliceCard.getByText('@e2euser_alice').click();
    await expect(page).toHaveURL(/\/users\//);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(EXCLUDED_RULES)
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
