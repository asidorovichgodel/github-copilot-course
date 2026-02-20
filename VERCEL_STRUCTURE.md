/**
 * Vercel-Aligned Next.js Project Structure
 * README for the reorganized server-side architecture
 */

# Server Architecture - Aligned with Vercel's Recommended Structure

This project follows [Vercel's recommended Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure) from their official documentation.

## New Structure Overview

```
src/
├── app/
│   ├── api/
│   │   ├── (_api)/                    # Private route group for organizing API logic
│   │   │   └── _lib/
│   │   │       └── userHandlers.ts    # Colocated API handlers
│   │   ├── users/
│   │   │   ├── route.ts               # GET /api/users, POST /api/users
│   │   │   └── [id]/
│   │   │       └── route.ts           # GET/PUT/DELETE /api/users/[id]
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/                               # ✨ SHARED UTILITIES (Vercel pattern)
│   ├── types.ts                       # Shared TypeScript types
│   ├── errors.ts                      # AppError class & error codes
│   ├── constants.ts                   # Application constants
│   ├── helpers.ts                     # Response formatting, ID generation
│   ├── validation.ts                  # Input & business validation
│   ├── server/                        # Server-specific utilities
│   │   ├── middleware.ts              # Error handling, wrappers
│   │   └── index.ts
│   └── index.ts                       # Centralized exports
│
├── _services/                         # Private folder - Business logic layer
│   ├── UserService.ts                 # User business logic
│   └── index.ts
│
├── _repositories/                     # Private folder - Data access layer
│   ├── UserRepository.ts              # User data access
│   └── index.ts
│
├── components/                        # Shared React components
├── public/                            # Static assets
└── ...config files
```

## Key Changes from Previous Structure

| Previous | New | Reason |
|----------|-----|--------|
| `src/server/common/types/` | `src/lib/types.ts` | Follows Vercel's `lib` convention for shared utilities |
| `src/server/common/errors/` | `src/lib/errors.ts` | Centralized in lib with other utilities |
| `src/server/common/utils/` | `src/lib/helpers.ts` + `validation.ts` | Split into focused files in lib |
| `src/server/repositories/` | `src/_repositories/` | Private folder (`_`) indicates non-routable code |
| `src/server/services/` | `src/_services/` | Private folder for implementation details |
| `src/server/controllers/` | `src/app/api/(_api)/_lib/` | Colocated near routes in route group |
| `src/server/common/middleware/` | `src/lib/server/middleware.ts` | Server-specific utilities in lib/server |

## Why These Changes

### 1. `src/lib/` - Vercel's Recommended Pattern
Vercel explicitly recommends using `lib` for shared utilities. This is a standard practice in Next.js projects and follows the official Next.js examples.

**Benefits:**
- Follows Vercel's official documentation
- Clear convention for shared code
- Easier onboarding for developers familiar with Next.js
- Better IDE support and import patterns

### 2. Private Folders (`_services`, `_repositories`)
Using underscore prefix indicates these are implementation details, not meant to be directly imported by routes.

**Benefits:**
- Signals non-routable code
- Prevents accidental routing of internal logic
- Clear separation of concerns
- Consistent with Vercel's recommendations

### 3. Colocated API Handlers
Keeping route-specific handlers in `app/api/(_api)/_lib/` (near where they're used) follows Vercel's colococation pattern.

**Benefits:**
- Minimal routing layer
- Easy to find related code
- Clear dependencies between routes and handlers
- Scales better as routes grow

### 4. Route Groups (`(_api)`)
The `(_api)` route group organizes API-related code without affecting URLs (parentheses omit from URL).

**Benefits:**
- Organizes without changing URLs
- Groups related handlers and utilities
- Clear mental model of API structure
- Won't conflict with potential future `api` route

## Layer Organization (Still Maintained)

### `src/lib/` - Shared Utilities Layer
**Responsibility:** Cross-cutting utilities, types, configurations
**Imports:** Nothing (root level)
**Exports:** Used everywhere

```typescript
// Examples
import { AppError, validateEmail, createSuccessResponse } from '@/lib';
```

### `src/_services/` - Business Logic Layer
**Responsibility:** Enforce business rules, orchestrate data
**Imports:** `lib`, `_repositories`
**Exports:** To handlers, server actions, other services

```typescript
// Example: UserService uses validation and repositories
import { validateEmail, AppError } from '@/lib';
import { userRepository } from '@/_repositories';

export class UserService {
  async createUser(input: CreateUserInput) {
    const email = validateEmail(input.email); // Validation from lib
    const existing = await userRepository.findByEmail(email);
    // Business logic...
  }
}
```

### `src/_repositories/` - Data Access Layer
**Responsibility:** CRUD operations, database queries
**Imports:** `lib` (only for error handling)
**Exports:** To services

```typescript
// Example: UserRepository handles data access
import { AppError } from '@/lib';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    // Database query...
  }
}
```

### API Route Handlers (in `src/app/api/(_api)/_lib/`)
**Responsibility:** HTTP request/response handling
**Imports:** `lib`, `_services`
**Exports:** To route.ts files

```typescript
// Example: Handler for API route
import { userService } from '@/_services';
import { createSuccessResponse, withErrorHandling } from '@/lib';

export const createUserHandler = withErrorHandling(async (req) => {
  const body = await req.json();
  const user = await userService.createUser(body);
  return NextResponse.json(createSuccessResponse(user), { status: 201 });
});
```

### API Routes (in `src/app/api/users/route.ts`)
**Responsibility:** Minimal HTTP method mapping
**Imports:** Handlers from `(_api)/_lib`
**Exports:** GET, POST, PUT, DELETE functions

```typescript
// Example: Route delegates to handlers
import { getUsersHandler, createUserHandler } from '@/app/api/(_api)/_lib/userHandlers';

export async function GET(req) {
  return getUsersHandler(req);
}

export async function POST(req) {
  return createUserHandler(req);
}
```

## Data Flow

```
GET /api/users/123
     ↓
src/app/api/users/[id]/route.ts
     ↓
src/app/api/(_api)/_lib/userHandlers.ts (GET handler)
     ↓
src/_services/UserService.ts (getUserById)
     ↓
src/_repositories/UserRepository.ts (findById)
     ↓
Response: 200 {success: true, data: {id: "123", ...}}
```

## Import Patterns

### Correct Imports (Following Structure)

```typescript
// ✅ From lib (shared utilities)
import { AppError, validateEmail, createSuccessResponse } from '@/lib';

// ✅ From _services (business logic)
import { userService } from '@/_services';

// ✅ From _repositories (data access)
import { userRepository } from '@/_repositories';

// ✅ From type-only imports
import type { User, PaginatedResponse } from '@/lib';

// ✅ From route handlers in private folder
import { getUsersHandler } from '@/app/api/(_api)/_lib/userHandlers';
```

### Avoid These (Breaking the Pattern)

```typescript
// ❌ Don't import from implementation details at wrong level
import { UserService } from '@/_services'; // Use userService instance instead

// ❌ Don't import services in routes (wrong layer inversion)
import { userService } from '@/_services';
export const route = (req) => userService.getUser();

// ❌ Don't reach across layers
// For example, handler importing repository directly (skip service layer)

// ❌ Don't expose repository at module level if it should be private
```

## File Structure Guidelines

### Shared Code in `src/lib/`

```
src/lib/
├── types.ts              # Shared TypeScript interfaces
├── errors.ts             # Error handling
├── constants.ts          # Application constants
├── helpers.ts            # Utility functions
├── validation.ts         # Validation utilities
├── server/
│   ├── middleware.ts     # Server-specific middleware
│   └── index.ts
└── index.ts              # Centralized exports
```

Guidelines:
- Keep files focused and single-purpose
- Export from `index.ts` for clean imports
- Use `src/lib/` for anything used by multiple features
- Name files based on their purpose, not their extension

### Private Implementation Details

```
src/_services/
├── UserService.ts
├── PostService.ts
└── index.ts

src/_repositories/
├── UserRepository.ts
├── PostRepository.ts
└── index.ts
```

Guidelines:
- Use `_` prefix to indicate private/implementation
- One service per feature typically
- Export instances, not classes
- Keep business logic here, not HTTP concerns

### API Route Colocated Handlers

```
src/app/api/(_api)/_lib/
├── userHandlers.ts       # All user route handlers
├── postHandlers.ts       # All post route handlers
└── index.ts
```

Guidelines:
- All handlers for an entity in one file
- Name files clearly (`*Handlers.ts`)
- Use `withErrorHandling` wrapper
- Keep minimal, delegate to services

## Adding New Features

### 1. Create a Repository
```bash
# src/_repositories/CommentRepository.ts
```

```typescript
export class CommentRepository {
  async create(input: CreateCommentInput): Promise<Comment> { ... }
  async findById(id: string): Promise<Comment | null> { ... }
  // ... other CRUD
}

export const commentRepository = new CommentRepository();
```

### 2. Create a Service
```bash
# src/_services/CommentService.ts
```

```typescript
import { commentRepository } from '@/_repositories';
import { AppError, validateString } from '@/lib';

export class CommentService {
  async createComment(input: CreateCommentInput): Promise<Comment> {
    const text = validateString(input.text, 'Comment', 1, 500);
    // Business logic...
    return commentRepository.create({ text });
  }
  // ... other methods
}

export const commentService = new CommentService();
```

### 3. Create Handlers
```bash
# src/app/api/(_api)/_lib/commentHandlers.ts
```

```typescript
import { commentService } from '@/_services';
import { createSuccessResponse, withErrorHandling } from '@/lib';

export const createCommentHandler = withErrorHandling(async (req) => {
  const body = await req.json();
  const comment = await commentService.createComment(body);
  return NextResponse.json(createSuccessResponse(comment), { status: 201 });
});
// ... other handlers
```

### 4. Create Routes
```bash
# src/app/api/comments/route.ts
# src/app/api/comments/[id]/route.ts
```

```typescript
import { createCommentHandler } from '@/app/api/(_api)/_lib/commentHandlers';

export async function POST(req) {
  return createCommentHandler(req);
}
```

## Vercel Conventions Reference

### Private Folders
Prefix with underscore: `_folder`
- Not included in routing
- Good for implementation details
- Clear intent that folder is private

### Route Groups
Wrap in parentheses: `(group)`
- Not included in URL
- Good for organizing related routes
- Can create multiple nested layouts

### Colocation
Keep files next to their usage
- Route-specific components near routes
- Handler utilities near handlers
- Promotes code discovery

### Naming
- Folders: `kebab-case`
- Files: `camelCase.ts` or `PascalCase.tsx`
- Special files: Lowercase (`layout.tsx`, `route.ts`)

## Testing

### Testing Services
```typescript
// Services are easiest to test
import { UserService } from '@/_services';
import { userRepository } from '@/_repositories';

describe('UserService', () => {
  it('should create user', async () => {
    const mockRepo = { create: jest.fn() };
    const service = new UserService(mockRepo);
    // Test business logic
  });
});
```

### Testing Handlers
```typescript
// Test route handlers
import { createUserHandler } from '@/app/api/(_api)/_lib/userHandlers';

describe('User Handlers', () => {
  it('should handle POST request', async () => {
    const req = new Request(...);
    const response = await createUserHandler(req);
    expect(response.status).toBe(201);
  });
});
```

## Best Practices

✅ **Do**
- Keep `lib` focused on cross-cutting utilities
- Use private folders for implementation details
- Colocate related code (handlers near routes)
- Keep route files minimal
- Delegate to services from handlers
- Use TypeScript types everywhere
- Import from `src/lib` or barrel exports

❌ **Don't**
- Mix HTTP concerns in services
- Import across layer boundaries incorrectly
- Put business logic in route files
- Hardcode values (use constants)
- Ignore the layer boundaries
- Deep import from nested files (use barrel exports)

## Key Files to Understand

- [src/lib/index.ts](../lib/index.ts) - Centralized exports
- [src/app/api/(_api)/_lib/userHandlers.ts](../app/api/(_api)/_lib/userHandlers.ts) - API handler examples
- [src/_services/UserService.ts](../_services/UserService.ts) - Business logic example
- [src/_repositories/UserRepository.ts](../_repositories/UserRepository.ts) - Data access example

## References

- [Vercel's Project Structure Guide](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
