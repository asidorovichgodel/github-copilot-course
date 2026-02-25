import { test, expect } from '@playwright/test';

/**
 * E2E tests for the Candidate detail page (/candidates/[id]).
 * Requires an authenticated session.
 */
test.describe('Candidate detail page (authenticated)', () => {
  test('should render a 404 / Not Found page for a non-existent candidate ID', async ({ page }) => {
    // Next.js calls notFound() in the page component when the candidate is not found
    await page.goto('/candidates/non-existent-candidate-id-00000');

    // Next.js renders a "Not Found" page — look for typical 404 content
    await expect(
      page.getByText(/not found|404|could not be found/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('should navigate from Candidates list to a detail page when a row link is clicked', async ({ page }) => {
    await page.goto('/candidates');

    const viewLinks = page.getByRole('link', { name: /view/i });
    const count = await viewLinks.count();

    if (count === 0) {
      // No candidates in the test DB — skip gracefully
      test.skip();
      return;
    }

    await viewLinks.first().click();

    // URL should contain /candidates/<id>
    await expect(page).toHaveURL(/\/candidates\/.+/);

    // Page should show the "Candidate Profile" badge
    await expect(page.getByText('Candidate Profile')).toBeVisible();
  });

  test('should show a Back to All Candidates link on the detail page', async ({ page }) => {
    await page.goto('/candidates');

    const viewLinks = page.getByRole('link', { name: /view/i });
    const count = await viewLinks.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await viewLinks.first().click();

    const backLink = page.getByRole('link', { name: /all candidates/i });
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page).toHaveURL('/candidates');
  });

  test('should show candidate name as the page heading', async ({ page }) => {
    await page.goto('/candidates');

    const viewLinks = page.getByRole('link', { name: /view/i });
    const count = await viewLinks.count();

    if (count === 0) {
      test.skip();
      return;
    }

    await viewLinks.first().click();

    // The page renders <h1> with the candidate's fullName (text-4xl font-semibold)
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
