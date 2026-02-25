/**
 * Vercel-Aligned Project Structure Quick Reference
 * One-page guide for the reorganized architecture
 */

# 🚀 Project Structure - Vercel Aligned

This project now follows [Vercel's official Next.js project structure recommendations](https://nextjs.org/docs/app/getting-started/project-structure).

## Project Idea: CV Extraction

Core workflow to guide new features:

1. Admin uploads a CV in PDF format.
2. The file is uploaded to the server (locally) via an API endpoint.
3. The file is analyzed and structured with a Copilot-assisted extraction step.
4. A user is created or updated from the extracted data (with conflict confirmation when needed).
5. The UI shows success or failure to the admin.

## Complete Project Tree

```
project-root/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   ├── (_api)/               # Private route group for API
│   │   │   │   └── _lib/
│   │   │   │       └── userHandlers.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts          # POST /api/users, GET /api/users
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET/PUT/DELETE /api/users/[id]
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── lib/                          # ✨ SHARED UTILITIES (Vercel pattern)
│   │   ├── types.ts                  # TypeScript interfaces
│   │   ├── errors.ts                 # AppError class
│   │   ├── constants.ts              # App constants
│   │   ├── helpers.ts                # Helper functions
│   │   ├── validation.ts             # Validation utilities
│   │   ├── server/
│   │   │   ├── middleware.ts         # Error handling, wrappers
│   │   │   └── index.ts
│   │   └── index.ts                  # Barrel exports
│   │
│   ├── _services/                    # Private: Business logic
│   │   ├── UserService.ts
│   │   └── index.ts
│   │
│   ├── _repositories/                # Private: Data access
│   │   ├── UserRepository.ts
│   │   └── index.ts
│   │
│   ├── components/                   # Shared React components
│   │   └── ...
│   │
│   └── ...
│
├── public/                           # Static assets
├── VERCEL_STRUCTURE.md               # Detailed structure guide
├── MIGRATION_GUIDE.md                # Changes from previous structure
├── package.json
├── tsconfig.json
├── next.config.ts
└── ...
```

## What Goes Where

| Purpose | Location | Purpose |
|---------|----------|---------|
| **Types** | `src/lib/types.ts` | Shared TypeScript interfaces |
| **Errors** | `src/lib/errors.ts` | AppError, error codes |
| **Constants** | `src/lib/constants.ts` | HTTP status, defaults, rules |
| **Helpers** | `src/lib/helpers.ts` | Response formatting, ID generation |
| **Validation** | `src/lib/validation.ts` | Input validators |
| **Middleware** | `src/lib/server/middleware.ts` | Error handlers, wrappers |
| **Business Logic** | `src/_services/` | Services (UserService, etc.) |
| **Data Access** | `src/_repositories/` | Repositories (UserRepository, etc.) |
| **API Handlers** | `src/app/api/(_api)/_lib/` | Handler functions (userHandlers, etc.) |
| **Routes** | `src/app/api/users/route.ts` | HTTP method handlers (GET, POST, etc.) |

## Key Vercel Conventions Used

### 1. `src/lib/` for Shared Utilities
✅ Vercel's recommended folder for utilities that are used across the app

```typescript
import { AppError, validateEmail, createSuccessResponse } from '@/lib';
```

### 2. Private Folders (`_folder`)
✅ Prefix with underscore indicates non-routable implementation details

- `src/_services/` - Private business logic
- `src/_repositories/` - Private data access
- `src/app/api/(_api)/_lib/` - Public route handlers

### 3. Route Groups (`(name)`)
✅ Parentheses omit folder from URL, useful for organization

- `src/app/api/(_api)/` organizes API handlers without changing URLs
- PUT /api/users still works, just `(_api)` helps organize the code

### 4. Colococation
✅ Keep related code together for discoverability

- API handlers colocated in `app/api` route group
- Right-click on route → find handler easily

## Data Flow (Example: Create User)

```
1. POST /api/users
   Body: {name: "Alice", email: "alice@example.com"}
   ↓
2. src/app/api/users/route.ts
   - Routes to POST method
   - Calls createUserHandler
   ↓
3. src/app/api/(_api)/_lib/userHandlers.ts
   - parseRequest, validate format
   - Calls userService.createUser()
   ↓
4. src/_services/UserService.ts
   - Validates email format, business rules
   - Calls userRepository.create()
   ↓
5. src/_repositories/UserRepository.ts
   - Saves to database
   - Returns created user
   ↓
6. Response flows back up
   ↓
7. 201 Created
   {success: true, data: {id: "user_1", name: "Alice", ...}}
```

## Layer Breakdown

### Route Layer (`src/app/api/[entity]/route.ts`)
- **Size:** Minimal (5-10 lines)
- **Purpose:** Map HTTP methods
- **Imports:** Handlers from `(_api)/_lib`
- **Example:** GET → handler function

### Handler Layer (`src/app/api/(_api)/_lib/[entity]Handlers.ts`)
- **Size:** Medium (20-50 lines each)
- **Purpose:** Request parsing, response formatting
- **Imports:** Services from `_services`, utils from `lib`
- **Wraps:** `withErrorHandling` for consistent errors

### Service Layer (`src/_services/[Entity]Service.ts`)
- **Size:** Medium (50-200 lines)
- **Purpose:** Business logic, orchestration
- **Imports:** Repositories, lib utilities
- **Validates:** Business rules, constraints

### Repository Layer (`src/_repositories/[Entity]Repository.ts`)
- **Size:** Medium (30-100 lines)
- **Purpose:** Data access CRUD
- **Imports:** lib (errors only), database client
- **Returns:** Entity objects

### Utilities Layer (`src/lib/`)
- **Size:** Small focused files
- **Purpose:** Cross-cutting utilities
- **Imports:** None (root level)
- **Used by:** Everything

## Import Examples

### ✅ Correct Imports

```typescript
// From lib (shared utilities)
import { AppError, validateEmail, createSuccessResponse } from '@/lib';

// From services (business logic)
import { userService } from '@/_services';

// From repositories (data access)
import { userRepository } from '@/_repositories';

// From handlers (API functions)
import { userHandlers } from '@/app/api/(_api)/_lib/userHandlers';

// Type-only
import type { User, ApiResponse } from '@/lib';
```

### ❌ Incorrect Imports

```typescript
// Deep imports (use barrel exports instead)
import { userService } from '@/_services/UserService';

// Crossing layers
import { userRepository } from '@/_repositories'; // ← Don't use directly in handlers

// Not using private folders correctly
import { something } from '@/server/services'; // ← Old structure
```

## Adding a New Feature (Post)

### 1. Create Repository
```bash
touch src/_repositories/PostRepository.ts
```
Copy pattern from UserRepository.ts, adapt for Post entity

### 2. Create Service
```bash
touch src/_services/PostService.ts
```
Copy pattern from UserService.ts, import PostRepository

### 3. Create Handlers
```bash
touch src/app/api/(_api)/_lib/postHandlers.ts
```
Copy pattern from userHandlers.ts, adapt for Posts

### 4. Create Routes
```bash
mkdir -p src/app/api/posts/[id]
touch src/app/api/posts/route.ts src/app/api/posts/[id]/route.ts
```
Copy pattern from user routes, import postHandlers

Done! Full CRUD endpoint created.

## File Usage Reference

| I need to... | Go to... | Pattern |
|--------------|----------|---------|
| Access database | `src/_repositories/` | `userRepository.findById(id)` |
| Apply business logic | `src/_services/` | `userService.createUser(input)` |
| Validate input | `src/lib/validation.ts` | `validateEmail(email)` |
| Create API response | `src/lib/helpers.ts` | `createSuccessResponse(data)` |
| Handle errors | `src/lib/errors.ts` | `AppError.notFound('User')` |
| Handle API request | `src/app/api/(_api)/_lib/` | `withErrorHandling(handler)` |
| Define routes | `src/app/api/[entity]/route.ts` | `export async function GET(req)` |
| Share types | `src/lib/types.ts` | `import type { User } from '@/lib'` |
| Get constants | `src/lib/constants.ts` | `PAGINATION.MAX_LIMIT` |

## Quick Links

- 📖 [Detailed Structure Guide](./VERCEL_STRUCTURE.md) - Complete architecture explanation
- 🔄 [Migration Guide](./MIGRATION_GUIDE.md) - What changed from previous structure
- 🚀 [Vercel Docs](https://nextjs.org/docs/app/getting-started/project-structure) - Official reference
- 📋 [Old README Archive](./src/server/README.md) - Previous documentation

## Key Takeaways

1. **`src/lib/`** = Shared utilities (Vercel pattern)
2. **`_folder`** = Private, non-routable code
3. **`(_api)`** = Route group organizing API handlers
4. **Colocate handlers** near their routes for easy discovery
5. **Keep layer boundaries** - don't cross layers
6. **Import from `@/lib`** for utilities, not individual files

This structure is:
- ✅ Officially recommended by Vercel
- ✅ Easier to onboard developers
- ✅ More scalable as project grows
- ✅ Industry standard pattern
- ✅ Fully aligned with Next.js examples

