import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Admin — Role Management page (/admin/roles).
 * Requires an authenticated admin session.
 *
 * SKIPPED: These tests require a running PostgreSQL database seeded with an
 * admin user. Configure the test environment first —
 * see "E2E Test Environment Setup" in README.md.
 */
test.describe.skip('Admin Role Management page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles');
  });

  test('should display the Role Management heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Role Management' })).toBeVisible();
  });

  test('should render the System Roles card with table headers', async ({ page }) => {
    await expect(page.getByText('System Roles')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Users Assigned' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  });

  test('should show the built-in admin and user roles', async ({ page }) => {
    await expect(page.getByText('admin')).toBeVisible();
    await expect(page.getByText('user')).toBeVisible();
  });

  test('should mark built-in roles as Protected (no delete button)', async ({ page }) => {
    // Protected roles show "Protected" text instead of a delete button
    await expect(page.getByText('Protected').first()).toBeVisible();
  });

  test('should show the Create Role form with a name input and button', async ({ page }) => {
    await expect(page.getByPlaceholder('New role name')).toBeVisible();
    await expect(page.getByRole('button', { name: /create role/i })).toBeVisible();
  });

  test('should show the About Roles informational card', async ({ page }) => {
    await expect(page.getByText('About Roles')).toBeVisible();
    await expect(page.getByText(/administrator with full system access/i)).toBeVisible();
  });

  test('should create and then delete a custom role', async ({ page }) => {
    const uniqueRoleName = `e2e-test-${Date.now()}`;

    // Create the role
    await page.getByPlaceholder('New role name').fill(uniqueRoleName);
    await page.getByRole('button', { name: /create role/i }).click();

    // After server action revalidates, the new role should appear in the table
    await expect(page.getByText(uniqueRoleName)).toBeVisible({ timeout: 10_000 });

    // Delete that custom role — find the delete button in the same row
    // eslint-disable-next-line security/detect-non-literal-regexp
    const roleRow = page.getByRole('row', { name: new RegExp(uniqueRoleName, 'i') });
    await roleRow.getByRole('button').click();

    // Role should disappear after deletion
    await expect(page.getByText(uniqueRoleName)).not.toBeVisible({ timeout: 10_000 });
  });

  test('should show a role count in the card description', async ({ page }) => {
    // "Total of N roles in the system"
    await expect(page.getByText(/total of \d+ roles/i)).toBeVisible();
  });
});
