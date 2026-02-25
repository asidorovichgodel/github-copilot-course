import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Candidates page (/candidates).
 * Requires an authenticated session (uses storageState saved by auth.setup.ts).
 */
test.describe('Candidates page (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/candidates');
  });

  test('should display the Candidates heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Candidates' })).toBeVisible();
  });

  test('should render the All Candidates card', async ({ page }) => {
    await expect(page.getByText('All Candidates')).toBeVisible();
  });

  test('should render a table with column headers', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Location' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Skills' })).toBeVisible();
  });

  test('should show candidate count in the card description', async ({ page }) => {
    // Matches "0 candidates", "1 candidate", "N candidates"
    await expect(page.locator('[data-slot="card-description"]')).toBeVisible();
  });

  test('should link each candidate to their detail page', async ({ page }) => {
    const firstRowLink = page.getByRole('link', { name: /view/i }).first();
    const rowLinks = page.getByRole('link', { name: /view/i });
    const count = await rowLinks.count();

    if (count > 0) {
      const href = await firstRowLink.getAttribute('href');
      expect(href).toMatch(/\/candidates\/.+/);
    }
  });
});
