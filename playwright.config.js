import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5199',
    trace: 'retain-on-failure',
    // The site's i18n falls back to the browser locale when nothing is
    // cached in localStorage yet — pin it so tests see Russian by default,
    // matching the site's primary language, instead of Chromium's en-US default.
    locale: 'ru-RU',
  },
  webServer: [
    {
      command: 'npm run dev',
      cwd: './server',
      url: 'http://127.0.0.1:4310/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'npm run dev -- --port 5199 --strictPort --host 127.0.0.1',
      url: 'http://127.0.0.1:5199',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
