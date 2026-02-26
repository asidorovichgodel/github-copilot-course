# Getting Started

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18.17 or later |
| npm / yarn | Latest stable |
| Git | Any recent version |
| GitHub Copilot subscription | Required |
| VS Code | Recommended |

## Installation

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/github-copilot-course.git
cd github-copilot-course

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL and NEXTAUTH_SECRET at minimum

# 4. Run database migrations
npx prisma migrate deploy

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run type-check` | TypeScript type check |
| `npm test` | Run unit tests (Jest) |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run e2e` | Run E2E tests (Playwright) |
| `npm run audit` | Security vulnerability scan |

## E2E Test Environment

E2E tests are split into two groups:

| Group | Files | Default |
|---|---|---|
| Public (no auth) | `sign-in.spec.ts`, `sign-up.spec.ts` | Enabled |
| Authenticated | `*.auth.spec.ts`, `auth.setup.ts` | Skipped |

To enable authenticated tests:

```bash
# 1. Start PostgreSQL (or use Docker)
docker run -d --name pg-dev -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16

# 2. Configure .env.local with DATABASE_URL and NEXTAUTH_SECRET

# 3. Run migrations and seed an admin user
npx prisma migrate deploy
npx prisma db seed   # or insert admin@example.com / Password1! manually

# 4. Remove test.describe.skip wrappers from e2e/*.auth.spec.ts
#    and the setup.skip() call from e2e/auth.setup.ts

# 5. Run all E2E tests
npm run e2e
```

## Package Management

Always use **Context7 MCP** (`use context7`) when installing, updating, or researching any npm package to get up-to-date documentation and version information.
