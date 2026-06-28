import { execSync } from 'child_process';
import path from 'path';

export default async function globalTeardown() {
  execSync(
    'psql -h localhost -p 5432 -U raisetimeline -d raisetimeline_dev -f data/cleanup-e2e.sql',
    { cwd: path.resolve(__dirname, '..'), env: { ...process.env, PGPASSWORD: 'password' } }
  );
}
