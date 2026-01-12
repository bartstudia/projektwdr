const { test, expect } = require('@playwright/test');

const userEmail = process.env.E2E_USER_EMAIL;
const userPassword = process.env.E2E_USER_PASSWORD;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const lakeName = process.env.E2E_LAKE_NAME;

const login = async (page, email, password) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
};

test('admin can cancel reservation and filter by status', async ({ page }) => {
  test.skip(
    !userEmail || !userPassword || !adminEmail || !adminPassword || !lakeName,
    'Set E2E_USER_EMAIL, E2E_USER_PASSWORD, E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_LAKE_NAME'
  );
  page.on('dialog', (dialog) => dialog.accept());

  await login(page, userEmail, userPassword);
  await page.waitForURL('**/dashboard');

  await page.goto('/lakes');
  await page
    .locator('.lake-card', { hasText: lakeName })
    .getByTestId('lake-details')
    .click();
  await page.getByTestId('reserve-first-available').click();
  await page.waitForURL('**/reservation/**');
  await page.getByTestId('reservation-submit').click();
  await page.waitForURL('**/my-reservations');

  await page.getByRole('button', { name: 'Wyloguj' }).click();

  await login(page, adminEmail, adminPassword);
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
