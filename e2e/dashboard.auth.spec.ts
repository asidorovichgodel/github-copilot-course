import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Dashboard page (/).
 * Requires an authenticated session (uses storageState saved by auth.setup.ts).
 * File is named *.auth.spec.ts so Playwright assigns the `chromium-auth` project.
 */
test.describe('Dashboard page (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the dashboard heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should show candidate statistics cards', async ({ page }) => {
    // The dashboard renders stat cards with numbers
    await expect(page.locator('[data-slot="card"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('should display navigation links for candidates and CV', async ({ page }) => {
    await expect(page.getByRole('link', { name: /candidates/i })).toBeVisible();
  });

  test('should show the user navigation (UserNav)', async ({ page }) => {
    // UserNav renders an avatar button in the header
    await expect(page.getByRole('button', { name: /user menu|avatar/i }).or(
      page.locator('[data-slot="avatar"]'),
    )).toBeVisible();
  });
});

test.describe('Protected routes redirect unauthenticated users', () => {
  test('should redirect / to sign-in when not authenticated', async ({ browser }) => {
    // Create a fresh context with NO stored session
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/');

    await expect(page).toHaveURL(/sign-in/);
    await context.close();
  });

  test('should redirect /candidates to sign-in when not authenticated', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/candidates');

    await expect(page).toHaveURL(/sign-in/);
    await context.close();
  });

  test('should redirect /profile to sign-in when not authenticated', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/profile');

    await expect(page).toHaveURL(/sign-in/);
    await context.close();
  });
});
