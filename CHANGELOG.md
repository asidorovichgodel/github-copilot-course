# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-02-26

### Added

- **CV Extraction feature**: App Router integration, PDF upload API, LLM-assisted extraction, candidate conflict resolution UI, and server actions
- **Prisma database layer**: PostgreSQL schema for `User`, `Candidate`, and `Cv` models with migrations
- **Playwright E2E test suite**: public (sign-in, sign-up) and authenticated (dashboard, admin, candidates, CV upload) test groups with auth setup
- **Jest unit tests**: coverage for services, repositories, hooks, and components; refined coverage exclusion rules
- **CI/CD workflows**: GitHub Actions pipeline configuration under `.github/workflows/`
- **Zustand stores** (`src/lib/stores/`): global app state and multi-step form state with DevTools and localStorage persistence
- **Zod schemas** (`src/lib/schemas/`): login, registration, and profile validation with reusable field validators
- **React Query integration**: `QueryProvider`, `queryClient` configuration, and user query/mutation hooks
- **GitHub Copilot custom agent**: `@nextjs-expert` (`.github/agents/nextjs-expert.agent.md`) for Next.js 16 App Router guidance
- **Reusable Copilot prompts**: `#create-nextjs-page`, `#add-shadcn-component`, `#update-changelog`
- **GitHub Copilot instruction files**: database conventions, CI/CD practices added alongside existing code-style, testing, security, and documentation instructions
- **Centralized documentation** (`docs/`): `getting-started.md`, `project-structure.md`, `architecture.md`, `react-query.md`, `zustand-zod.md`, `ai-agents.md`
- **AI agent integration guide** (`docs/ai-agents.md`): documents extension points, data contracts, layer boundaries, and safe change patterns for AI agents and autonomic assistants

### Changed

- README simplified to a concise project index that points to `docs/` for all detail
- `copilot-instructions.md` updated to reflect current project structure, docs location, and available prompts
- ESLint configured to suppress `security/object-injection` false positives in test files

### Removed

- Legacy root-level documentation files (`PROJECT_STRUCTURE.md`, `VERCEL_STRUCTURE.md`, `STRUCTURE_COMPLETE.md`, `REACT_QUERY_SETUP.md`, `ZUSTAND_ZOD_GUIDE.md`, `ZUSTAND_ZOD_SETUP.md`, `ZUSTAND_ZOD_PATTERNS.ts`) — content consolidated into `docs/`
- `src/lib/REACT_QUERY_GUIDE.ts` — content moved to `docs/react-query.md`

## [0.1.0] - 2026-02-19

### Added

- Initial project setup
- Contributing guidelines
- Code of Conduct
- Style guide
- PR and issue templates
- Security policy
- Initial repository structure
- Basic README

---

## Changelog Types

Use these categories for organizing changes:

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

## Version Format

- **Major** (X.0.0) - Breaking changes
- **Minor** (0.X.0) - New features, backward compatible
- **Patch** (0.0.X) - Bug fixes, backward compatible
