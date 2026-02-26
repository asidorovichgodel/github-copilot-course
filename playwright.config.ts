import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration.
 * Tests run against the locally running Next.js dev server.
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use */
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions such as `await page.goto('/')` */
    baseURL: 'http://localhost:3000',
    /* Collect trace on test failure */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
  },

  projects: [
    /* Setup project — authenticates once and saves browser state */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    /* Tests that run without authentication */
    {
      name: 'chromium-public',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*\.auth\.spec\.ts/,
    },
    /* Tests that require an authenticated session */
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      testMatch: /.*\.auth\.spec\.ts/,
      dependencies: ['setup'],
    },
  ],

  /* Start the Next.js dev server automatically when running E2E tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
