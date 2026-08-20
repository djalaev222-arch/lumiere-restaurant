import { test, expect } from '@playwright/test';

test.describe('Admin panel', () => {
  test('redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('rejects a wrong password', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#email', 'admin@lumiere-restaurant.ru');
    await page.fill('#password', 'definitely-wrong');
    await page.click('button[type="submit"]');
    await expect(page.locator('.admin-error-banner')).toBeVisible();
  });

  test('logs in, sees the dashboard, and logs out', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#email', 'admin@lumiere-restaurant.ru');
    await page.fill('#password', 'change-me-now');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.locator('.admin-stat-card').first()).toBeVisible();

    await page.click('text=Выйти');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
