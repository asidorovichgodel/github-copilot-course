# React Query Guide

React Query (TanStack Query v5) is used for client-side data fetching, caching, and mutations.

## Files

- `src/lib/queryClient.ts` — `QueryClient` configuration with sensible defaults
- `src/components/QueryProvider.tsx` — Client component that provides the query client
- `src/hooks/useUsers.ts` — User-related query and mutation hooks

## Setup

The root layout wraps the app in `QueryProvider`:

```tsx
// src/app/layout.tsx
import { QueryProvider } from '@/components/QueryProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

## Default Configuration

From `src/lib/queryClient.ts`:

- Stale time: 5 minutes
- Garbage collection: 10 minutes
- Retry: 1
- Refetch on window focus: disabled

These can be tuned centrally in `queryClient.ts`.

## User Hooks

`src/hooks/useUsers.ts` exposes:

- `useUser(id)` — fetch a single user
- `useUsers(page, limit)` — fetch paginated users
- `useCreateUser()` — create mutation
- `useUpdateUser(userId)` — update mutation
- `useDeleteUser()` — delete mutation

Example:

```tsx
'use client';

import { useUsers, useCreateUser } from '@/hooks/useUsers';

export function UsersList() {
  const { data, isLoading, error } = useUsers(1, 10);
  const createUser = useCreateUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.items?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button
        onClick={() =>
          createUser.mutate({ name: 'John', email: 'john@example.com' })
        }
        disabled={createUser.isPending}
      >
        Create User
      </button>
    </div>
  );
}
```

## API Contract

Hooks talk to REST endpoints under `src/app/api/`. All responses share this shape:

```ts
{
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

Paginated responses:

```ts
{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Server Components vs React Query

- **Server Components**: For SSR/SSG, use the native `fetch` API with `cache`/`next` options.
- **Client Components**: For interactive views with loading states, use React Query hooks.

Example server component:

```tsx
export async function UsersServer() {
  const res = await fetch('http://localhost:3000/api/users', { cache: 'no-store' });
  const json = await res.json();
  return <pre>{JSON.stringify(json.data, null, 2)}</pre>;
}
```

## DevTools (Optional)

```bash
npm install @tanstack/react-query-devtools
```

Then include in your layout or a debug-only component.

## More Patterns

See `src/hooks/useUsers.ts` and `src/components/QueryProvider.tsx` for working examples of:

- Optimistic updates
- Paginated queries
- Error boundaries
- Query key conventions
