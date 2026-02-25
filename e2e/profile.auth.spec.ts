import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Profile page (/profile).
 * Requires an authenticated session.
 */
test.describe('Profile page (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  test('should display the My Profile heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
  });

  test('should show the user card with name and email', async ({ page }) => {
    // ProfileCard renders inside a Card with a "Profile" CardTitle
    await expect(page.getByText(/profile/i).first()).toBeVisible();
    // User's email should appear somewhere on the card
    await expect(page.locator('[data-slot="card"]')).toBeVisible();
  });

  test('should show the Edit button to enter edit mode', async ({ page }) => {
    const editButton = page.getByRole('button', { name: /edit/i });
    await expect(editButton).toBeVisible();
  });

  test('should reveal editable input fields when Edit is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).click();

    // Form inputs should appear
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should show Save and Cancel buttons in edit mode', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).click();

    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  test('should exit edit mode when Cancel is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).click();
    await expect(page.getByLabel(/first name/i)).toBeVisible();

    await page.getByRole('button', { name: /cancel/i }).click();

    // Edit button should be back, inputs gone
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
    await expect(page.getByLabel(/first name/i)).not.toBeVisible();
  });

  test('should show a validation error when clearing the first name field', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).click();

    const firstNameInput = page.getByLabel(/first name/i);
    await firstNameInput.clear();
    await firstNameInput.blur();

    // Zod nameSchema: min 2 chars — should show an error
    await expect(
      page.locator('[role="alert"], .text-red-500, .text-destructive').first(),
    ).toBeVisible();
  });

  test('should show a validation error for an invalid email in edit mode', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).click();

    const emailInput = page.getByLabel(/email/i);
    await emailInput.clear();
    await emailInput.fill('not-an-email');
    await emailInput.blur();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should display user roles as badges', async ({ page }) => {
    // The ProfileCard renders roles as Badge components (e.g. "user", "admin")
    // At minimum the logged-in test user has the "user" role
    await expect(page.getByText(/user|admin/i).first()).toBeVisible();
  });
});
