import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Sign-in page (/sign-in).
 * These tests run without an authenticated session.
 */
test.describe('Sign-in page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
  });

  test('should display the sign-in heading and form fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should show a link to the sign-up page', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: 'Sign up' });

    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click();

    // React Hook Form (onBlur mode) — trigger blur on both fields
    await page.getByLabel('Email').focus();
    await page.getByLabel('Password').focus();
    await page.getByLabel('Email').focus();

    await expect(
      page.locator('[role="alert"], .text-red-500, .text-destructive').first(),
    ).toBeVisible();
  });

  test('should show an error for an invalid email format', async ({ page }) => {
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Password').fill('somepassword');
    await page.getByLabel('Email').blur();

    // Expect validation message to appear
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should show an error toast for wrong credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('WrongPassword1!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for the toast error message
    await expect(page.getByText(/login failed/i)).toBeVisible({ timeout: 10_000 });
  });

  test('should disable the submit button during submission', async ({ page }) => {
    // Intercept the NextAuth sign-in request to introduce a delay so we can
    // observe the disabled / loading state before the response arrives.
    await page.route('**/api/auth/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      await route.continue();
    });

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('Password1!');

    // Use a type-based selector so it still matches after the label changes to
    // 'Signing in...' (isSubmitting = true)
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Button should be disabled while the network request is pending
    await expect(submitButton).toBeDisabled();
  });
});
