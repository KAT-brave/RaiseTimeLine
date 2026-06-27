import { test, expect } from '@playwright/test';

test('like API debug', async ({ page }) => {
  const responses: {url: string, status: number, body: string}[] = [];
  
  page.on('response', async (resp) => {
    if (resp.url().includes('/likes') || resp.url().includes('/posts')) {
      const body = await resp.text().catch(() => '');
      responses.push({ url: resp.url(), status: resp.status(), body: body.slice(0, 200) });
    }
  });

  await page.goto('/');
  const content = `Like debug test ${Date.now()}`;
  await page.getByPlaceholder('いまどうしてる？').fill(content);
  await page.getByRole('button', { name: '投稿する' }).click();
  await expect(page.getByText(content).first()).toBeVisible();

  const firstPost = page.locator('[data-testid="post-card"]').first();
  const likeBtn = firstPost.locator('[data-testid="like-btn"]');
  
  console.log('Before check - btn text:', await likeBtn.textContent());
  await likeBtn.click();
  await page.waitForTimeout(3000);
  console.log('After click - btn text:', await likeBtn.textContent());

  for (const r of responses) {
    console.log(`${r.status} ${r.url} body: ${r.body}`);
  }
});
