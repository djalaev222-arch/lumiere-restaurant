import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DB_FILE = path.join(ROOT, 'test.db');

const TEST_ENV = {
  ...process.env,
  DATABASE_URL: 'file:./test.db',
  ADMIN_EMAIL: 'admin@lumiere-restaurant.ru',
  ADMIN_PASSWORD: 'test-admin-password',
};

export async function setup() {
  for (const file of [DB_FILE, `${DB_FILE}-journal`]) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  execSync('npx prisma migrate deploy', { cwd: ROOT, env: TEST_ENV, stdio: 'inherit' });
  execSync('node prisma/seed.js', { cwd: ROOT, env: TEST_ENV, stdio: 'inherit' });
}

export async function teardown() {
  for (const file of [DB_FILE, `${DB_FILE}-journal`]) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}
