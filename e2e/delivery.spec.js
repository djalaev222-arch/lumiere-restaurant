import { test, expect } from '@playwright/test';

test.describe('Delivery', () => {
  test('empty cart shows the empty state', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/delivery');
    await page.evaluate(() => localStorage.removeItem('lumiere_cart'));
    await page.reload();
    await expect(page.getByText('Корзина пока пуста')).toBeVisible();
  });

  test('adding a dish updates the header cart badge', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForSelector('.dish-card');
    await page.locator('.dish-card__add').first().click();
    await expect(page.locator('.site-header__cart-badge')).toHaveText('1');
  });

  test('completes checkout with cash payment', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForSelector('.dish-card');
    await page.locator('.dish-card__add').first().click();

    await page.goto('/delivery');
    await page.waitForSelector('#c-name');
    await page.fill('#c-name', 'E2E Доставка');
    await page.fill('#c-phone', '+7 999 000-11-22');
    await page.fill('#c-address', 'ул. Тестовая, д. 1');
    await page.check('input[name="payment"][value="cash"]');

    await page.click('button[type="submit"]');
    await expect(page.getByText('Заказ принят')).toBeVisible({ timeout: 5000 });
  });
});
