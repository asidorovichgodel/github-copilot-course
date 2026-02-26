import { test as setup, expect } from '@playwright/test';
import path from 'path';

/**
 * Authentication setup.
 * Logs in once and saves the browser storage state so auth tests
 * can reuse the session instead of logging in before every test.
 *
 * The credentials here should match a seeded test user in your database.
 * Use environment variables in CI:  E2E_EMAIL / E2E_PASSWORD
 */
const authFile = path.join(__dirname, '.auth/user.json');

// SKIPPED: Requires a running PostgreSQL database seeded with an admin user
// (admin@example.com / Password1!). Configure the test environment first —
// see "E2E Test Environment Setup" in README.md.
setup('authenticate', async ({ page }) => {
  setup.skip(true, 'Test environment not configured: database and seeded admin user required.');
  const email = process.env.E2E_EMAIL ?? 'admin@example.com';
  const password = process.env.E2E_PASSWORD ?? 'Password1!';

  await page.goto('/sign-in');

  // Wait for the login form to render
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

  // Fill in credentials
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait until redirected to the dashboard — confirms sign-in succeeded
  await page.waitForURL('/', { timeout: 15_000 });

  // Persist session cookies + localStorage for subsequent tests
  await page.context().storageState({ path: authFile });
});
