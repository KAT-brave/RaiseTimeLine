import { execSync } from 'child_process';
import { chromium } from '@playwright/test';
import path from 'path';

const API = 'http://localhost:8080/api/v1';

async function saveStorageState(email: string, password: string, file: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:5173/login');
  await page.getByPlaceholder('example@email.com').fill(email);
  await page.getByPlaceholder('パスワードを入力').fill(password);
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.waitForURL('**/');

  await context.storageState({ path: file });
  await browser.close();
}

export default async function globalSetup() {
  // DBシード
  execSync(
    'psql -h localhost -p 5432 -U raisetimeline -d raisetimeline_dev -f data/seed-e2e.sql',
    { cwd: path.resolve(__dirname, '..'), env: { ...process.env, PGPASSWORD: 'password' } }
  );

  // storageState を保存（各ユーザー）
  await saveStorageState('e2euser_alice@e2e.test',   'E2eTestPass1', 'auth/user-a.json');
  await saveStorageState('e2euser_bob@e2e.test',     'E2eTestPass1', 'auth/user-b.json');
  await saveStorageState('e2euser_charlie@e2e.test', 'E2eTestPass1', 'auth/user-c.json');
}
