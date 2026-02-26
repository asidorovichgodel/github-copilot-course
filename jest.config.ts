import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lessons/(.*)$': '<rootDir>/lessons/$1',
    '^@/exercises/(.*)$': '<rootDir>/exercises/$1',
    '^@/docs/(.*)$': '<rootDir>/docs/$1',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  // Exclude Playwright E2E tests — they are run via `npm run e2e`, not Jest
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    // Type declarations — nothing executable to test
    '!src/**/*.d.ts',
    // Storybook stories
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    // Test files themselves
    '!src/**/__tests__/**',
    // Next.js App Router — pages, layouts, loading states, API routes.
    // These are framework-glue files and server actions that require
    // integration/E2E tests (Playwright), not Jest unit tests.
    '!src/app/**',
    // Repositories are data-access infrastructure that talk directly to the
    // database; they are covered by integration/E2E tests, not unit tests.
    '!src/_repositories/**',
    // Infrastructure entry-points / config files
    '!src/proxy.ts',
    // Pure TypeScript type declarations
    '!src/types/**',
    // Zustand stores — state containers tested implicitly via component tests
    '!src/lib/stores/**',
    // shadcn/ui primitives — auto-generated, third-party-managed UI components
    '!src/components/ui/**',
    // Barrel / re-export index files — no executable logic to exercise
    '!src/hooks/index.ts',
    '!src/lib/index.ts',
    '!src/lib/schemas/index.ts',
    '!src/lib/server/index.ts',
    '!src/_services/index.ts',
    // Pure constant declarations — no branching logic to cover
    '!src/lib/constants.ts',
    // TypeScript interface / type declarations — nothing executable
    '!src/lib/types.ts',
    // NextAuth configuration — deep framework integration, covered by E2E tests
    '!src/lib/auth.ts',
    // Prisma singleton — database infrastructure, covered by integration tests
    '!src/lib/server/prisma.ts',
    // PdfParserService — relies on pdfjs-dist dynamic imports with a worker file;
    // cannot be reliably unit-tested in Jest; covered by integration/E2E tests.
    '!src/_services/PdfParserService.ts',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
