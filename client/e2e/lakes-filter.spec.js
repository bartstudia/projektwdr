const { test, expect } = require('@playwright/test');

const login = async (page) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('user@test.pl');
  await page.getByTestId('login-password').fill('user123');
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/dashboard');
};

test('user can filter lakes and see empty lake details', async ({ page }) => {
  await login(page);

  await page.goto('/lakes');
  await page.getByPlaceholder('Szukaj jeziora po nazwie lub lokalizacji...').fill('Bez Stanowisk');
  await expect(page.getByText('Jezioro Bez Stanowisk')).toBeVisible();
  await expect(page.getByText('Jezioro Testowe')).toHaveCount(0);

  await page
    .locator('.lake-card', { hasText: 'Jezioro Bez Stanowisk' })
    .getByTestId('lake-details')
    .click();

  await expect(page.getByText('Brak dostępnych stanowisk')).toBeVisible();
});
