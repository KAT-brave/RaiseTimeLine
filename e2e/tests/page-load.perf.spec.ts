import { test, expect } from '@playwright/test';

type PerfMetrics = {
  fcp: number;
  lcp: number;
  cls: number;
  domContentLoaded: number;
};

async function measurePerf(page: import('@playwright/test').Page): Promise<PerfMetrics> {
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime ?? 0;

    return {
      fcp,
      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
    };
  });

  const lcp = await page.evaluate(() =>
    new Promise<number>((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries[entries.length - 1]?.startTime ?? 0);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve(0), 3000);
    })
  );

  const cls = await page.evaluate(() =>
    new Promise<number>((resolve) => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        resolve(clsValue);
      }).observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => resolve(clsValue), 2000);
    })
  );

  return { fcp: metrics.fcp, lcp, cls, domContentLoaded: metrics.domContentLoaded };
}

test.describe('ブラウザパフォーマンス（ページ読み込み）', () => {
  test('ホームページ: FCP < 2s / LCP < 3s / CLS < 0.1 / DCL < 3s', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const metrics = await measurePerf(page);

    console.log('ホームページ metrics:', metrics);
    expect(metrics.fcp).toBeLessThan(2000);
    expect(metrics.lcp).toBeLessThan(3000);
    expect(metrics.cls).toBeLessThan(0.1);
    expect(metrics.domContentLoaded).toBeLessThan(3000);
  });

  test('ログインページ: FCP < 2s / CLS < 0.1 / DCL < 3s', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await page.goto('/login', { waitUntil: 'networkidle' });
    const metrics = await measurePerf(page);

    console.log('ログインページ metrics:', metrics);
    expect(metrics.fcp).toBeLessThan(2000);
    expect(metrics.cls).toBeLessThan(0.1);
    expect(metrics.domContentLoaded).toBeLessThan(3000);
    await context.close();
  });

  test('検索ページ: FCP < 2s / CLS < 0.1 / DCL < 3s', async ({ page }) => {
    await page.goto('/search', { waitUntil: 'networkidle' });
    const metrics = await measurePerf(page);

    console.log('検索ページ metrics:', metrics);
    expect(metrics.fcp).toBeLessThan(2000);
    expect(metrics.cls).toBeLessThan(0.1);
    expect(metrics.domContentLoaded).toBeLessThan(3000);
  });
});
