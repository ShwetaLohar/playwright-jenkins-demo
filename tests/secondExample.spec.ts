import { test, expect } from '@playwright/test';

test('Playwright Demo - Third test', async ({ page }) => {

  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

 