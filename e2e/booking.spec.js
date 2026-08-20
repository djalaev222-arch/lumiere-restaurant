import { test, expect } from '@playwright/test';

test.describe('Booking', () => {
  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/booking');
    await page.click('button[type="submit"]');
    await expect(page.locator('.booking-form__error').first()).toBeVisible();
  });

  test('rejects an obviously invalid phone number', async ({ page }) => {
    await page.goto('/booking');
    await page.fill('#name', 'Иван Иванов');
    await page.fill('#phone', '123');
    await page.selectOption('#time', '19:00');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Проверьте номер телефона')).toBeVisible();
  });

  test('submits successfully with valid data', async ({ page }) => {
    await page.goto('/booking');
    await page.fill('#name', 'E2E Тест');
    await page.fill('#phone', '+7 999 123-45-67');
    await page.selectOption('#time', '19:00');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Заявка отправлена')).toBeVisible({ timeout: 5000 });
  });
});
