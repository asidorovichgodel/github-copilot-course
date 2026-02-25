import { test, expect } from '@playwright/test';

/**
 * E2E tests for the application sidebar navigation and UserNav dropdown.
 * Requires an authenticated session.
 */
test.describe('Sidebar navigation (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the CV Manager brand in the sidebar header', async ({ page }) => {
    await expect(page.getByText('CV Manager')).toBeVisible();
  });

  test('should show Overview, Candidates, and My Profile nav links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /overview/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /candidates/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /my profile/i })).toBeVisible();
  });

  test('should navigate to Candidates page via sidebar link', async ({ page }) => {
    await page
      .getByRole('link', { name: /candidates/i })
      .first()
      .click();

    await expect(page).toHaveURL('/candidates');
    await expect(page.getByRole('heading', { name: 'Candidates' })).toBeVisible();
  });

  test('should navigate to My Profile page via sidebar link', async ({ page }) => {
    await page.getByRole('link', { name: /my profile/i }).click();

    await expect(page).toHaveURL('/profile');
    await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
  });

  test('should navigate back to Overview from Candidates page', async ({ page }) => {
    await page.goto('/candidates');
    await page.getByRole('link', { name: /overview/i }).click();

    await expect(page).toHaveURL('/');
  });
});

test.describe('UserNav dropdown (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open the user dropdown when the avatar button is clicked', async ({ page }) => {
    // UserNav renders a SidebarMenuButton with an Avatar inside
    const userMenuButton = page
      .getByRole('button')
      .filter({ has: page.locator('[data-slot="avatar-fallback"]') })
      .first();
    await userMenuButton.click();

    // Dropdown should show Profile and Sign out items
    await expect(page.getByRole('menuitem', { name: /profile/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /sign out/i })).toBeVisible();
  });

  test('should navigate to /profile via the dropdown Profile link', async ({ page }) => {
    const userMenuButton = page
      .getByRole('button')
      .filter({ has: page.locator('[data-slot="avatar-fallback"]') })
      .first();
    await userMenuButton.click();

    await page.getByRole('menuitem', { name: /profile/i }).click();

    await expect(page).toHaveURL('/profile');
  });

  test('should sign out and redirect to sign-in when Sign out is clicked', async ({ page }) => {
    const userMenuButton = page
      .getByRole('button')
      .filter({ has: page.locator('[data-slot="avatar-fallback"]') })
      .first();
    await userMenuButton.click();

    await page.getByRole('menuitem', { name: /sign out/i }).click();

    // After sign-out next-auth redirects to /sign-in or /
    await expect(page).toHaveURL(/sign-in|^\/$/, { timeout: 10_000 });
  });
});
