const { test, expect } = require('@playwright/test');

const login = async (page, email, password) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
};

test('admin can cancel reservation and filter by status', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());

  await login(page, 'user@test.pl', 'user123');
  await page.waitForURL('**/dashboard');

  await page.goto('/lakes');
  await page.getByTestId('lake-details').first().click();
  await page.getByTestId('reserve-first-available').click();
  await page.waitForURL('**/reservation/**');
  await page.getByTestId('reservation-submit').click();
  await page.waitForURL('**/my-reservations');

  await page.getByRole('button', { name: 'Wyloguj' }).click();

  await login(page, 'admin@test.pl', 'admin123');
  await page.waitForURL('**/admin');

  await page.goto('/admin/reservations');
  await expect(page.getByText('Wszystkie Rezerwacje')).toBeVisible();

  const cancelButton = page.getByRole('button', { name: 'Anuluj' }).first();
  await cancelButton.click();
  await expect(page.getByText('Anulowana')).toBeVisible();

  await page.getByLabel('Status:').selectOption('cancelled');
  await expect(page.getByText('Anulowana')).toBeVisible();
  await expect(page.getByText('Potwierdzona')).toHaveCount(0);
});
