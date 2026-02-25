import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Admin — User Management page (/admin/users).
 * Requires an authenticated admin session.
 */
test.describe('Admin User Management page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
  });

  test('should display the User Management heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('should display the All Users card', async ({ page }) => {
    await expect(page.getByText('All Users')).toBeVisible();
  });

  test('should render table headers for user data', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Roles' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Joined' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });

  test('should show a total user count in the card description', async ({ page }) => {
    // "Total of N users in the system"
    await expect(page.getByText(/total of \d+ users/i)).toBeVisible();
  });

  test('should have edit links for each user row', async ({ page }) => {
    const editLinks = page.getByRole('link', { name: /edit/i });
    const count = await editLinks.count();

    // There should be at least one user (the seeded admin)
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to the user edit page on clicking Edit', async ({ page }) => {
    const firstEditLink = page.getByRole('link', { name: /edit/i }).first();

    await firstEditLink.click();

    // URL should match /admin/users/<some-id>
    await expect(page).toHaveURL(/\/admin\/users\/.+/);
  });
});
