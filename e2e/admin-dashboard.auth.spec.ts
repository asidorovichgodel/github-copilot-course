import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Admin Dashboard (/admin).
 * Requires an authenticated admin session.
 */
test.describe('Admin Dashboard (admin authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
  });

  test('should display the Admin Dashboard heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  });

  test('should show all four stat cards', async ({ page }) => {
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('Roles')).toBeVisible();
    await expect(page.getByText('CV Uploads')).toBeVisible();
    await expect(page.getByText('System Health')).toBeVisible();
  });

  test('should show System Health value as OK', async ({ page }) => {
    await expect(page.getByText('OK')).toBeVisible();
  });

  test('should have clickable links on stat cards', async ({ page }) => {
    const usersLink = page.getByRole('link', { name: /manage users/i });
    const rolesLink = page.getByRole('link', { name: /manage roles/i });

    // Links exist on the cards (the "Manage" CTAs)
    await expect(usersLink.or(page.getByRole('link', { name: /users/i }).first())).toBeVisible();
    await expect(rolesLink.or(page.getByRole('link', { name: /roles/i }).first())).toBeVisible();
  });

  test('should render the admin sidebar navigation', async ({ page }) => {
    // Admin layout renders its own sidebar with these items
    await expect(page.getByRole('link', { name: /user management/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /role management/i })).toBeVisible();
  });

  test('should navigate to User Management when sidebar link is clicked', async ({ page }) => {
    await page.getByRole('link', { name: /user management/i }).click();

    await expect(page).toHaveURL('/admin/users');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  });

  test('should navigate to Role Management when sidebar link is clicked', async ({ page }) => {
    await page.getByRole('link', { name: /role management/i }).click();

    await expect(page).toHaveURL('/admin/roles');
    await expect(page.getByRole('heading', { name: 'Role Management' })).toBeVisible();
  });
});

/**
 * Access control: Non-admin sessions should be redirected away from /admin.
 * Uses a fresh browser context with no stored session to test unauthenticated access.
 */
test.describe('Admin access control', () => {
  test('should redirect unauthenticated users from /admin to sign-in', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/admin');

    await expect(page).toHaveURL(/sign-in/);
    await context.close();
  });

  test('should redirect unauthenticated users from /admin/users to sign-in', async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/admin/users');

    await expect(page).toHaveURL(/sign-in/);
    await context.close();
  });

  test('should redirect unauthenticated users from /admin/roles to sign-in', async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/admin/roles');

    await expect(page).toHaveURL(/sign-in/);
    await context.close();
  });
});
