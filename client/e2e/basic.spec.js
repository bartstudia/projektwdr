const { test, expect } = require('@playwright/test');

const login = async (page) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('user@test.pl');
  await page.getByTestId('login-password').fill('user123');
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/dashboard');
};

test('user can reserve, review, and cancel', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());

  await login(page);

  await page.goto('/lakes');
  await page.getByTestId('lake-details').first().click();
  await page.getByTestId('reserve-first-available').click();

  await page.waitForURL('**/reservation/**');
  await page.getByTestId('reservation-submit').click();

  await page.waitForURL('**/my-reservations');

  await page.goto('/lakes');
  await page.getByTestId('lake-details').first().click();
  await page.getByTestId('review-star-5').click();
  await page.getByTestId('review-comment').fill('Super miejsce na testy E2E.');
  await page.getByTestId('review-submit').click();
  await expect(page.getByText('Super miejsce na testy E2E.')).toBeVisible();

  await page.goto('/my-reservations');
  const cancelButton = page.getByTestId('reservation-cancel').first();
  await cancelButton.click();
  await expect(cancelButton).toBeHidden();
});
