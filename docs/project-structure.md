# Project Structure

This project follows [Vercel's official Next.js project structure recommendations](https://nextjs.org/docs/app/getting-started/project-structure).

## Directory Layout

```
project-root/
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── (auth)/                     # Auth route group (login, signup)
│   │   ├── (site)/                     # Public site route group
│   │   ├── admin/                      # Admin-only pages
│   │   ├── api/
│   │   │   ├── (_api)/                 # Private route group for API logic
│   │   │   │   └── _lib/
│   │   │   │       └── userHandlers.ts # Colocated API handlers
│   │   │   └── users/
│   │   │       ├── route.ts            # GET /api/users, POST /api/users
│   │   │       └── [id]/
│   │   │           └── route.ts        # GET/PUT/DELETE /api/users/[id]
│   │   ├── _actions/                   # Next.js Server Actions
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── lib/                            # Shared utilities (Vercel pattern)
│   │   ├── types.ts                    # TypeScript interfaces
│   │   ├── errors.ts                   # AppError class & error codes
│   │   ├── constants.ts                # App-wide constants
│   │   ├── helpers.ts                  # Response formatting, ID generation
│   │   ├── validation.ts               # Input validation utilities
│   │   ├── auth.ts                     # NextAuth config
│   │   ├── utils.ts                    # General utilities
│   │   ├── queryClient.ts              # React Query configuration
│   │   ├── stores/                     # Zustand stores
│   │   │   ├── useAppStore.ts
│   │   │   ├── useFormStore.ts
│   │   │   └── index.ts
│   │   ├── schemas/                    # Zod validation schemas
│   │   │   ├── userSchemas.ts
│   │   │   ├── formValidation.ts
│   │   │   └── index.ts
│   │   ├── server/
│   │   │   └── middleware.ts           # Error handling wrappers
│   │   └── index.ts                    # Barrel exports
│   │
│   ├── _services/                      # Private: Business logic layer
│   │   ├── AuthService.ts
│   │   ├── CvService.ts
│   │   ├── LlmService.ts
│   │   ├── PdfParserService.ts
│   │   ├── UserService.ts
│   │   └── index.ts
│   │
│   ├── _repositories/                  # Private: Data access layer
│   │   ├── CandidateRepository.ts
│   │   ├── CvRepository.ts
│   │   ├── UserRepository.ts
│   │   └── index.ts
│   │
│   ├── components/                     # Shared React components
│   │   ├── ui/                         # shadcn/ui primitives
│   │   ├── QueryProvider.tsx
│   │   ├── AppSettings.tsx
│   │   └── RegistrationForm.tsx
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useUsers.ts
│   │   ├── use-mobile.ts
│   │   └── index.ts
│   │
│   └── types/                          # Global type augmentations
│       └── next-auth.d.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── e2e/                                # Playwright E2E tests
├── docs/                               # Project documentation
├── .github/
│   ├── agents/                         # Custom Copilot agents
│   ├── instructions/                   # Copilot instruction files
│   ├── prompts/                        # Reusable Copilot prompts
│   └── workflows/                      # GitHub Actions CI/CD
└── public/                             # Static assets
```

## Layer Boundaries

```
┌─────────────────────────────────────────────────┐
│  Route Layer     src/app/api/*/route.ts          │  HTTP method mapping only
├─────────────────────────────────────────────────┤
│  Handler Layer   src/app/api/(_api)/_lib/        │  Request parsing, response formatting
├─────────────────────────────────────────────────┤
│  Service Layer   src/_services/                  │  Business logic & rules
├─────────────────────────────────────────────────┤
│  Repository Layer  src/_repositories/            │  Data access (Prisma)
├─────────────────────────────────────────────────┤
│  Utilities Layer   src/lib/                      │  Cross-cutting: types, errors, helpers
└─────────────────────────────────────────────────┘
```

## "What Goes Where" Quick Reference

| Need | Location | Example |
|---|---|---|
| TypeScript types | `src/lib/types.ts` | `User`, `ApiResponse<T>` |
| Error classes | `src/lib/errors.ts` | `AppError.notFound('User')` |
| Constants | `src/lib/constants.ts` | `PAGINATION.MAX_LIMIT` |
| Helper functions | `src/lib/helpers.ts` | `createSuccessResponse(data)` |
| Input validation | `src/lib/validation.ts` | `validateEmail(email)` |
| Zod schemas | `src/lib/schemas/` | `loginSchema`, `userRegistrationSchema` |
| Zustand stores | `src/lib/stores/` | `useAppStore`, `useFormStore` |
| Server middleware | `src/lib/server/` | `withErrorHandling(handler)` |
| Business logic | `src/_services/` | `userService.createUser(input)` |
| Database queries | `src/_repositories/` | `userRepository.findById(id)` |
| API handlers | `src/app/api/(_api)/_lib/` | `getUsersHandler`, `createUserHandler` |
| Route definitions | `src/app/api/*/route.ts` | `export async function GET(req)` |
| Server Actions | `src/app/_actions/` | Form mutations |
| Client UI state | `src/lib/stores/` | `useAppStore` |
| API client hooks | `src/hooks/` | `useUsers()`, `useCreateUser()` |

## Key Conventions

### Private Folders (`_prefix`)
Folders prefixed with `_` are **non-routable implementation details**:
- `src/_services/` — business logic, never imported by route files directly
- `src/_repositories/` — data access, only imported by services
- `src/app/api/(_api)/` — API handlers colocated near routes

### Route Groups (`(name)`)
Parenthesized folders are omitted from URLs:
- `(auth)/` — groups login/signup pages without affecting URLs
- `(site)/` — groups public pages
- `(_api)/` — organizes API handlers; URL `/api/users` still works

### Import Rules

```typescript
// ✅ Correct — use barrel exports
import { AppError, validateEmail } from '@/lib';
import { userService } from '@/_services';
import type { User } from '@/lib';

// ❌ Incorrect — deep imports
import { UserService } from '@/_services/UserService';
import { AppError } from '@/lib/errors';
```

## Adding a New Feature

```bash
# Example: adding "Posts" entity

# 1. Repository (data access)
touch src/_repositories/PostRepository.ts   # copy from UserRepository pattern

# 2. Service (business logic)
touch src/_services/PostService.ts           # copy from UserService pattern

# 3. API Handlers
touch src/app/api/(_api)/_lib/postHandlers.ts

# 4. Routes
mkdir -p src/app/api/posts/[id]
touch src/app/api/posts/route.ts src/app/api/posts/[id]/route.ts

# 5. Update barrel exports in _repositories/index.ts, _services/index.ts
```

## References

- [Vercel Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [architecture.md](architecture.md) — detailed data flow and layer descriptions
