const { test, expect } = require('@playwright/test');

const emptyEmail = process.env.E2E_EMPTY_EMAIL;
const emptyPassword = process.env.E2E_EMPTY_PASSWORD;

test('user sees empty reservations state', async ({ page }) => {
  test.skip(!emptyEmail || !emptyPassword, 'Set E2E_EMPTY_EMAIL and E2E_EMPTY_PASSWORD');
  await page.goto('/login');
  await page.getByTestId('login-email').fill(emptyEmail);
  await page.getByTestId('login-password').fill(emptyPassword);
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/dashboard');
  await page.goto('/my-reservations');

  await expect(page.getByText('Brak rezerwacji')).toBeVisible();
});
