const { test, expect } = require('@playwright/test');

test('new user sees empty reservations state', async ({ page }) => {
  const timestamp = Date.now();
  const email = `empty-${timestamp}@test.pl`;

  await page.goto('/register');
  await page.getByTestId('register-name').fill('Empty User');
  await page.getByTestId('register-email').fill(email);
  await page.getByTestId('register-password').fill('user123');
  await page.getByTestId('register-confirm').fill('user123');
  await page.getByTestId('register-submit').click();

  await page.waitForURL('**/dashboard');
  await page.goto('/my-reservations');

  await expect(page.getByText('Brak rezerwacji')).toBeVisible();
});
