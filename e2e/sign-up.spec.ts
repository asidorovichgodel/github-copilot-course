import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Sign-up page (/sign-up).
 * These tests run without an authenticated session.
 */
test.describe('Sign-up page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-up');
  });

  test('should display the create account heading and all form fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel(/^Password/)).toBeVisible();
    await expect(page.getByLabel(/Confirm Password/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('should show a link to the sign-in page', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: 'Sign in' });

    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/sign-in');
  });

  test('should show validation errors when submitting an empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Create account' }).click();

    // At least one error should appear
    await expect(page.locator('.text-destructive').first()).toBeVisible();
  });

  test('should show an error when passwords do not match', async ({ page }) => {
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel(/^Password/).fill('Password1!');
    await page.getByLabel(/Confirm Password/).fill('Different1!');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should show an error for a weak password (no uppercase)', async ({ page }) => {
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel(/^Password/).fill('password1!');
    await page.getByLabel(/^Password/).blur();

    await expect(page.getByText(/uppercase/i)).toBeVisible();
  });

  test('should show an error for a password shorter than 8 characters', async ({ page }) => {
    await page.getByLabel(/^Password/).fill('Abc1!');
    await page.getByLabel(/^Password/).blur();

    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });

  test('should show an error for an invalid email', async ({ page }) => {
    await page.getByLabel('Email').fill('not-valid');
    await page.getByLabel('Email').blur();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should clear a field error when the user starts typing a correction', async ({ page }) => {
    // Trigger validation
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.locator('.text-destructive').first()).toBeVisible();

    // Correct the first name field
    await page.getByLabel('First Name').fill('John');

    // The first name error should be gone
    await expect(page.getByLabel('First Name').locator('~ .text-destructive')).not.toBeVisible();
  });
});
