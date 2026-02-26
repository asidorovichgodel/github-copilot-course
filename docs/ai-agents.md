# AI Agent Integration

This codebase is designed to work well with AI agents (assistants and autonomic agents) that read, modify, and extend the project.

## Goals

- Clear, documented extension points
- Stable data contracts and conventions
- Minimal implicit behavior

## Extension Points

### 1. API Layer

- Route handlers live in `src/app/api/*/route.ts`
- Request/response logic is centralized in `src/app/api/(_api)/_lib/*Handlers.ts`
- All responses use the shared `ApiResponse<T>` shape from `src/lib/types.ts`

Agents can:
- Add new entities by following the patterns for `users` routes and handlers
- Add new endpoints that reuse existing `AppError`, `helpers`, and `validation` utilities

### 2. Service Layer

- Business logic: `src/_services/`
- Each service encapsulates a domain: `UserService`, `CvService`, `AuthService`, etc.

Agents should:
- Put new domain logic into services rather than route files
- Reuse existing validation and error types

### 3. Repository Layer

- Data access: `src/_repositories/`
- Repositories hide Prisma details and expose typed operations

Agents should:
- Add new repository methods instead of querying Prisma directly from services
- Keep DB access limited to this layer

### 4. Shared Utilities

- Types, constants, helpers, validation, schemas, and stores are all under `src/lib/`
- Barrel exports (`src/lib/index.ts`, `src/lib/stores/index.ts`, `src/lib/schemas/index.ts`) simplify imports

Agents should:
- Prefer barrel exports when importing utilities
- Keep new cross-cutting utilities in `src/lib/`

## Data Contracts

### API

All API responses follow this pattern:

```ts
{
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

Paginated responses wrap `data` as:

```ts
{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Validation

- Zod schemas live in `src/lib/schemas/`
- Form helpers `validateFormData` / `validateFormDataAsync` centralize error mapping

Agents should:
- Extend or add schemas in `src/lib/schemas/` for new forms and APIs
- Use these helpers for consistent error shapes

### State

- Zustand stores are under `src/lib/stores/`
- One store for global UI (`useAppStore`), one for forms (`useFormStore`)

Agents should:
- Reuse these stores for global flags (e.g., loading indicators, theme)
- Create new stores only when a distinct domain warrants it

## Safety & Security

- Never commit secrets — use environment variables and `.env.local`
- Use `AppError` for controlled failures rather than throwing generic errors
- Validate all external input with Zod or dedicated validators
- Respect role checks for admin-only routes and services

## Recommended Agent Behaviors

- Prefer **composition over modification**: create new files or functions instead of rewriting existing logic where possible.
- Follow the patterns in:
  - `docs/project-structure.md`
  - `docs/architecture.md`
  - `docs/react-query.md`
  - `docs/zustand-zod.md`
- Keep changes small and localized per PR or commit scope.

## Examples

- Add a new entity (e.g., `Post`):
  1. Define types in `src/lib/types.ts`
  2. Add Zod schemas in `src/lib/schemas/postSchemas.ts`
  3. Create `PostRepository` and `PostService`
  4. Add `postHandlers` in `src/app/api/(_api)/_lib/postHandlers.ts`
  5. Add `posts` API routes under `src/app/api/posts/`

- Add a new client feature:
  1. Add React Query hooks in `src/hooks/usePosts.ts`
  2. Add UI components under `src/components/`
  3. Wire them into the appropriate route in `src/app/`

Agents can use this document as a high-level map for safe, predictable changes.
