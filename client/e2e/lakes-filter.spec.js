const { test, expect } = require('@playwright/test');

const userEmail = process.env.E2E_USER_EMAIL;
const userPassword = process.env.E2E_USER_PASSWORD;
const emptyLakeName = process.env.E2E_EMPTY_LAKE_NAME;

const login = async (page) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill(userEmail);
  await page.getByTestId('login-password').fill(userPassword);
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/dashboard');
};

test('user can filter lakes and see empty lake details', async ({ page }) => {
  test.skip(
    !userEmail || !userPassword || !emptyLakeName,
    'Set E2E_USER_EMAIL, E2E_USER_PASSWORD, E2E_EMPTY_LAKE_NAME'
  );
  await login(page);

  await page.goto('/lakes');
  await page.getByPlaceholder('Szukaj jeziora po nazwie lub lokalizacji...').fill(emptyLakeName);
  await expect(page.getByText(emptyLakeName)).toBeVisible();

  await page
    .locator('.lake-card', { hasText: emptyLakeName })
    .getByTestId('lake-details')
    .click();

  await expect(page.getByText('Brak dostępnych stanowisk')).toBeVisible();
});
