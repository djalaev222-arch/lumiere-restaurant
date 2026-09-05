import { test, expect } from '@playwright/test';

test.describe('Public site', () => {
  test('home page loads with hero and no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page.locator('.hero__title')).toBeVisible();
    await expect(page.locator('.site-header__logo')).toHaveText(/Lumi.re/);
    expect(errors).toEqual([]);
  });

  test('menu loads dishes from the API and filters by category', async ({ page }) => {
    await page.goto('/menu');
    await expect(page.locator('.dish-card').first()).toBeVisible();

    const totalCount = await page.locator('.dish-card').count();
    expect(totalCount).toBeGreaterThan(10);

    await page.click('.menu-filters__pill:has-text("Десерты")');
    await expect(page.locator('.dish-card').first()).toBeVisible();
    const dessertCount = await page.locator('.dish-card').count();
    expect(dessertCount).toBeLessThan(totalCount);
  });

  test('menu search narrows results', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForSelector('.dish-card');
    await page.fill('.menu-filters__search input', 'тирамису');
    await expect(page.locator('.dish-card')).toHaveCount(1);
  });

  test('language switch translates the header', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("EN")');
    await expect(page.locator('.site-header__link', { hasText: 'Menu' })).toBeVisible();
  });

  test('mobile nav opens and scrolls to a section', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.click('.site-header__burger');
    await expect(page.locator('.mobile-nav__panel')).toBeVisible();
    await page.click('.mobile-nav__link:has-text("Меню")');
    await expect(page).toHaveURL(/#menu$/);
    await expect(page.locator('#menu')).toBeInViewport();
  });

  test('mobile booking bar links to the booking form', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.click('.mobile-book-bar__cta');
    await expect(page.locator('#booking .booking-form')).toBeVisible();
  });
});
