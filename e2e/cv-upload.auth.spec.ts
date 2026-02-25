import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * E2E tests for the CV Extraction page (/cv).
 * Requires an authenticated admin session (page uses requireAdminRole).
 */
test.describe('CV Extraction page (admin authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cv');
  });

  test('should display the Upload and structure CVs heading', async ({ page }) => {
    await expect(page.getByText('Upload and structure CVs')).toBeVisible();
  });

  test('should show the CV Extraction badge', async ({ page }) => {
    await expect(page.getByText('CV Extraction')).toBeVisible();
  });

  test('should render the Upload CV card with a file input', async ({ page }) => {
    await expect(page.getByText('Upload CV')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should state PDF-only restriction and 5 MB limit in the card description', async ({
    page,
  }) => {
    await expect(page.getByText(/PDF only/i)).toBeVisible();
    await expect(page.getByText(/5 MB/i)).toBeVisible();
  });

  test('should have the Upload CV button disabled when no file is selected', async ({ page }) => {
    const uploadButton = page.getByRole('button', { name: /upload cv/i });

    await expect(uploadButton).toBeDisabled();
  });

  test('should enable Upload CV button once a PDF file is attached', async ({ page }) => {
    // Create a minimal valid-looking PDF buffer in a temporary file
    const tmpDir = os.tmpdir();
    const tmpPdf = path.join(tmpDir, 'test-cv.pdf');
    // A real PDF starts with %PDF- ; we use a tiny stub so the file input accepts it
    fs.writeFileSync(tmpPdf, '%PDF-1.4 stub content for e2e test');

    await page.locator('input[type="file"]').setInputFiles(tmpPdf);

    const uploadButton = page.getByRole('button', { name: /upload cv/i });
    await expect(uploadButton).toBeEnabled();

    fs.unlinkSync(tmpPdf);
  });

  test('should reset the file input when Clear is clicked', async ({ page }) => {
    const tmpDir = os.tmpdir();
    const tmpPdf = path.join(tmpDir, 'test-cv-clear.pdf');
    fs.writeFileSync(tmpPdf, '%PDF-1.4 stub');

    await page.locator('input[type="file"]').setInputFiles(tmpPdf);
    await expect(page.getByRole('button', { name: /upload cv/i })).toBeEnabled();

    await page.getByRole('button', { name: /clear/i }).click();

    // After clearing, Upload CV button should be disabled again
    await expect(page.getByRole('button', { name: /upload cv/i })).toBeDisabled();

    fs.unlinkSync(tmpPdf);
  });
});

/**
 * Access control: non-admin and unauthenticated users cannot reach /cv.
 */
test.describe('CV page access control', () => {
  test('should redirect unauthenticated users from /cv to sign-in', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('/cv');

    await expect(page).toHaveURL(/sign-in/);
    await context.close();
  });
});
