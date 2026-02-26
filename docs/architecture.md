# Architecture

## Overview: CV Extraction Application

This is a **Next.js 16 App Router** application implementing a CV/resume extraction workflow. Admins upload PDF CVs; the system parses and structures the data using an LLM, then creates or updates candidate profiles with conflict resolution.

### Core Workflow

```
1. Admin uploads PDF via UI
2. POST /api/cv/upload — file saved locally to uploads/
3. PdfParserService extracts raw text
4. LlmService structures the text into a candidate profile
5. CvService checks for existing candidate conflicts
6. Admin reviews conflicts and confirms
7. CandidateRepository creates/updates the candidate record
8. UI shows success/failure
```

## Tech Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack) |
| Language         | TypeScript                         |
| Database         | PostgreSQL (via Prisma ORM)        |
| Authentication   | NextAuth.js                        |
| State Management | Zustand                            |
| Validation       | Zod                                |
| API Client       | TanStack React Query v5            |
| UI Components    | shadcn/ui + Tailwind CSS           |
| Testing          | Jest + Playwright                  |
| LLM Integration  | Configurable LLM service           |

## Layer Architecture

### Route Layer — `src/app/api/*/route.ts`

**Responsibility:** Map HTTP methods to handlers. Minimal, 5–10 lines.

```typescript
import { getUsersHandler, createUserHandler } from '@/app/api/(_api)/_lib/userHandlers';
export const GET = getUsersHandler;
export const POST = createUserHandler;
```

### Handler Layer — `src/app/api/(_api)/_lib/*Handlers.ts`

**Responsibility:** Parse request, validate HTTP contract, format response. Wraps with `withErrorHandling`.

```typescript
export const createUserHandler = withErrorHandling(async (req) => {
  const body = await req.json();
  const user = await userService.createUser(body);
  return NextResponse.json(createSuccessResponse(user), { status: 201 });
});
```

### Service Layer — `src/_services/`

**Responsibility:** Business logic and orchestration. Validates business rules, calls repositories.

```typescript
export class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    const email = validateEmail(input.email); // from lib
    const existing = await userRepository.findByEmail(email);
    if (existing) throw AppError.conflict('User already exists');
    return userRepository.create({ email, name: input.name });
  }
}
```

### Repository Layer — `src/_repositories/`

**Responsibility:** Data access via Prisma. Returns typed entities.

```typescript
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  }
}
```

### Utilities Layer — `src/lib/`

**Responsibility:** Cross-cutting utilities used by all layers. No dependencies on other layers.

| File                   | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `types.ts`             | Shared TypeScript interfaces             |
| `errors.ts`            | `AppError` class, error codes            |
| `constants.ts`         | App-wide constants (pagination, limits)  |
| `helpers.ts`           | `createSuccessResponse()`, ID generation |
| `validation.ts`        | Input validators (`validateEmail`, etc.) |
| `auth.ts`              | NextAuth configuration                   |
| `queryClient.ts`       | React Query client defaults              |
| `stores/`              | Zustand state stores                     |
| `schemas/`             | Zod validation schemas                   |
| `server/middleware.ts` | `withErrorHandling` wrapper              |

## Data Flow: Create User (Example)

```
POST /api/users  { name: "Alice", email: "alice@example.com" }
  │
  ▼
src/app/api/users/route.ts
  │  delegates to
  ▼
src/app/api/(_api)/_lib/userHandlers.ts  (createUserHandler)
  │  calls
  ▼
src/_services/UserService.ts  (createUser)
  │  validates business rules, calls
  ▼
src/_repositories/UserRepository.ts  (create)
  │  Prisma query
  ▼
PostgreSQL
  │
  ▼
201 Created  { success: true, data: { id: "...", name: "Alice", ... } }
```

## API Response Format

All API responses follow this contract:

```typescript
// Success
{ success: true, data: T, timestamp: string }

// Error
{ success: false, error: string, code?: string, timestamp: string }

// Paginated success
{
  success: true,
  data: {
    items: T[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  },
  timestamp: string
}
```

## Authentication & Authorization

- **NextAuth.js** handles session management.
- Middleware (`middleware.ts`) protects `/dashboard/:path*` and `/admin/:path*` routes.
- Admin operations require the `ADMIN` role checked in service/handler layers.

## Error Handling

`AppError` (in `src/lib/errors.ts`) is the canonical error class. Every layer throws `AppError`; `withErrorHandling` converts it to the correct HTTP response:

```typescript
throw AppError.notFound('User'); // → 404
throw AppError.conflict('Email taken'); // → 409
throw AppError.unauthorized(); // → 401
throw AppError.badRequest('...'); // → 400
```

## Caching Strategy

| Data         | Strategy                                              |
| ------------ | ----------------------------------------------------- |
| User list    | React Query, 5-min stale, revalidated after mutations |
| Static pages | Next.js default or `use cache` directive              |
| CV uploads   | No cache — always fresh                               |
| Session      | NextAuth session cookie                               |

## Database Schema

Managed with Prisma. Schema: `prisma/schema.prisma`. Migrations: `prisma/migrations/`.

Key models: `User`, `Candidate`, `Cv`.

Run migrations:

```bash
npx prisma migrate deploy    # production
npx prisma migrate dev       # development (also generates client)
```

## Related Docs

- [project-structure.md](project-structure.md) — directory layout and conventions
- [react-query.md](react-query.md) — client-side data fetching
- [zustand-zod.md](zustand-zod.md) — state management and validation
- [ai-agents.md](ai-agents.md) — AI agent integration points
