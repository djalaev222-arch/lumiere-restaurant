import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: './tests/globalSetup.js',
    fileParallelism: false, // all test files share one SQLite test.db
    env: {
      DATABASE_URL: 'file:./test.db',
      JWT_SECRET: 'test-secret-do-not-use-in-production',
      CORS_ORIGIN: 'http://127.0.0.1:5199',
      NODE_ENV: 'test',
    },
    testTimeout: 15000,
  },
});
