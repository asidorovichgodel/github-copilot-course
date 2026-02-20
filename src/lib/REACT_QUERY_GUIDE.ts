/**
 * React Query Integration Guide
 * 
 * This file documents the React Query setup and how to use it
 * for client-server communication via API.
 */

/*
================================================================================
TABLE OF CONTENTS
================================================================================

1. Overview
2. Setup & Configuration
3. Query Hooks (Fetching Data)
4. Mutation Hooks (Modifying Data)
5. Best Practices
6. Examples
7. Troubleshooting

================================================================================
1. OVERVIEW
================================================================================

React Query (@tanstack/react-query) is a powerful library for:
- Fetching, caching, and synchronizing server state
- Automatic stale state management
- Built-in request deduplication
- Error handling and retries
- DevTools for debugging

This project uses React Query v5 with Next.js App Router.

Key differences from v4:
- gcTime replaces cacheTime
- invalidateQueries is now async
- New QueryKey factories pattern recommended

================================================================================
2. SETUP & CONFIGURATION
================================================================================

The setup is already configured:

a) QueryClient Configuration (src/lib/queryClient.ts):
   - staleTime: 5 minutes
   - gcTime: 10 minutes
   - refetchOnWindowFocus: disabled
   - retry: 1 attempt

b) QueryProvider (src/components/QueryProvider.tsx):
   - Client component wrapper
   - Instantiated once per session
   - Must wrap your entire app

c) Root Layout (src/app/layout.tsx):
   - Already wrapped with <QueryProvider>

If you need custom QueryClient instances per route:
   
   import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
   import { createQueryClient } from '@/lib/queryClient'
   
   export default async function Page() {
     const queryClient = createQueryClient()
     
     // Pre-fetch data on server
     await queryClient.prefetchQuery({
       queryKey: ['users'],
       queryFn: () => fetch('/api/users').then(r => r.json())
     })
     
     return (
       <HydrationBoundary state={dehydrate(queryClient)}>
         <YourComponent />
       </HydrationBoundary>
     )
   }

================================================================================
3. QUERY HOOKS (Fetching Data)
================================================================================

Available in: src/hooks/useUsers.ts

a) useUser(id: string | null)
   Fetches a single user by ID
   
   import { useUser } from '@/hooks/useUsers'
   
   export function UserProfile({ userId }: { userId: string }) {
     const { data, isLoading, error } = useUser(userId)
     
     if (isLoading) return <p>Loading...</p>
     if (error) return <p>Error: {error.message}</p>
     
     return <div>{data?.data?.name}</div>
   }

   Properties:
   - data: User | undefined
   - isLoading: boolean - First fetch
   - isFetching: boolean - Any fetch (includes refetches)
   - isError: boolean
   - error: Error | null
   - status: 'pending' | 'error' | 'success'

b) useUsers(page: number, limit: number)
   Fetches paginated list of users
   
   import { useUsers } from '@/hooks/useUsers'
   
   export function UsersList() {
     const { data, isLoading } = useUsers(1, 10)
     
     return (
       <div>
         {data?.data?.users?.map(user => (
           <div key={user.id}>{user.name}</div>
         ))}
       </div>
     )
   }

Key Properties:
   - data: { success: boolean; data: PaginatedResponse<User> }
   - isLoading: boolean
   - isPending: boolean - Current fetch state
   - isFetching: boolean - Any network request
   - isRefetching: boolean - Background refetch
   - error: Error | null
   - status: 'pending' | 'error' | 'success'
   - refetch: () => Promise<...> - Manual refetch

Manual Refetch:
   const { refetch } = useUsers(1, 10)
   
   const handleRefresh = async () => {
     await refetch()
   }

Conditional Queries:
   const [userId, setUserId] = useState<string | null>(null)
   const { data } = useUser(userId) // Won't fetch if userId is null
   
   // enabled property automatically set based on id

================================================================================
4. MUTATION HOOKS (Modifying Data)
================================================================================

Available in: src/hooks/useUsers.ts

a) useCreateUser()
   Creates a new user
   
   import { useCreateUser } from '@/hooks/useUsers'
   
   export function CreateUserForm() {
     const mutation = useCreateUser()
     
     const handleCreate = async (name: string, email: string) => {
       try {
         const response = await mutation.mutateAsync({
           name,
           email,
         })
         console.log('Created:', response.data)
       } catch (error) {
         console.error('Failed:', error)
       }
     }
     
     return (
       <form onSubmit={(e) => {
         e.preventDefault()
         handleCreate('John', 'john@example.com')
       }}>
         <button disabled={mutation.isPending}>
           {mutation.isPending ? 'Creating...' : 'Create'}
         </button>
       </form>
     )
   }

Mutation States:
   - isPending: boolean - Mutation in progress
   - isError: boolean
   - isSuccess: boolean
   - error: Error | null
   - data: any - Response data
   - status: 'idle' | 'pending' | 'error' | 'success'

b) useUpdateUser(userId: string)
   Updates an existing user
   
   import { useUpdateUser } from '@/hooks/useUsers'
   
   export function UpdateUserForm({ userId }: { userId: string }) {
     const mutation = useUpdateUser(userId)
     
     const handleUpdate = async (name: string) => {
       await mutation.mutateAsync({ name })
     }
     
     return (
       <button onClick={() => handleUpdate('Jane')}>
         Update
       </button>
     )
   }

c) useDeleteUser()
   Deletes a user
   
   import { useDeleteUser } from '@/hooks/useUsers'
   
   export function DeleteUserButton({ userId }: { userId: string }) {
     const mutation = useDeleteUser()
     
     const handleDelete = async () => {
       await mutation.mutateAsync(userId)
     }
     
     return (
       <button onClick={handleDelete} disabled={mutation.isPending}>
         {mutation.isPending ? 'Deleting...' : 'Delete'}
       </button>
     )
   }

Optimistic Updates:
   const mutation = useMutation({
     mutationFn: (data) => updateUser(data),
     onMutate: async (newData) => {
       // Cancel existing queries
       await queryClient.cancelQueries({ queryKey: ['users', newData.id] })
       
       // Snapshot previous data
       const previousData = queryClient.getQueryData(['users', newData.id])
       
       // Optimistically update cache
       queryClient.setQueryData(['users', newData.id], newData)
       
       return { previousData }
     },
     onError: (err, newData, context) => {
       // Revert on error
       if (context?.previousData) {
         queryClient.setQueryData(['users', newData.id], context.previousData)
       }
     },
   })

================================================================================
5. BEST PRACTICES
================================================================================

a) Query Keys
   Use consistent, hierarchical keys:
   
   // Good
   const USERS_QUERY_KEY = ['users'] as const
   
   // In hooks
   queryKey: [...USERS_QUERY_KEY, 'list', page, limit]
   queryKey: [...USERS_QUERY_KEY, id]

b) Error Handling
   Always handle errors in UI:
   
   const { error } = useUsers()
   
   if (error) {
     return <div className="text-red-600">{error.message}</div>
   }

c) Loading States
   Distinguish between first load and refetch:
   
   const { isLoading, isFetching } = useUsers()
   
   // Show skeleton only on first load
   if (isLoading) return <Skeleton />
   
   // Show subtle indicator on refetch
   if (isFetching) return <div>Updating...</div>

d) Cache Invalidation
   Invalidate after mutations:
   
   onSuccess: () => {
     // Option 1: Invalidate entire key
     queryClient.invalidateQueries({ queryKey: ['users'] })
     
     // Option 2: Invalidate specific query
     queryClient.invalidateQueries({
       queryKey: ['users', userId]
     })
     
     // Option 3: Invalidate with predicate
     queryClient.invalidateQueries({
       predicate: (query) =>
         query.queryKey[0] === 'users' && query.queryKey[1] === 'list'
     })
   }

e) Adding New API Endpoints
   If you add new API endpoints (e.g., /api/posts):
   
   // 1. Create src/hooks/usePosts.ts
   import { useQuery, useMutation } from '@tanstack/react-query'
   
   const POSTS_QUERY_KEY = ['posts'] as const
   
   export const usePosts = (page = 1, limit = 10) => {
     return useQuery({
       queryKey: [...POSTS_QUERY_KEY, 'list', page, limit],
       queryFn: async () => {
         const res = await fetch(`/api/posts?page=${page}&limit=${limit}`)
         return res.json()
       }
     })
   }

f) Server-Side Data Fetching
   Use regular fetch for server components:
   
   // Recommended for server components
   export async function PostsList() {
     const res = await fetch('http://localhost:3000/api/posts', {
       cache: 'no-store'
     })
     const data = await res.json()
     // render component here
   }

================================================================================
6. EXAMPLES
================================================================================

Example 1: Simple List Display
   'use client'
   
   import { useUsers } from '@/hooks/useUsers'
   
   export function UserList() {
     const { data, isLoading } = useUsers()
     
     if (isLoading) return <div>Loading...</div>
     
     return (
       <ul>
         {data?.data?.users?.map(user => (
           <li key={user.id}>{user.name}</li>
         ))}
       </ul>
     )
   }

Example 2: Form with Mutation
   'use client'
   
   import { useState } from 'react'
   import { useCreateUser } from '@/hooks/useUsers'
   
   export function CreateUserForm() {
     const [name, setName] = useState('')
     const [email, setEmail] = useState('')
     const mutation = useCreateUser()
     
     const onSubmit = async (e: React.FormEvent) => {
       e.preventDefault()
       try {
         await mutation.mutateAsync({ name, email })
         setName('')
         setEmail('')
       } catch (err) {
         console.error(err)
       }
     }
     
     return (
       <form onSubmit={onSubmit}>
         <input
           value={name}
           onChange={e => setName(e.target.value)}
           placeholder="Name"
         />
         <input
           value={email}
           onChange={e => setEmail(e.target.value)}
           placeholder="Email"
         />
         <button disabled={mutation.isPending}>
           Create
         </button>
         {mutation.error && <p>{mutation.error.message}</p>}
       </form>
     )
   }

Example 3: Dependent Queries
   'use client'
   
   import { useUser } from '@/hooks/useUsers'
   
   export function UserDetails({ userId }: { userId: string | null }) {
     // Query won't run if userId is null
     const { data } = useUser(userId)
     
     return (
       <div>
         <h2>{data?.data?.name}</h2>
         <p>{data?.data?.email}</p>
       </div>
     )
   }

================================================================================
7. TROUBLESHOOTING
================================================================================

Issue: Data not updating after mutation
   Solution: Check cache invalidation
   
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['users'] })
   }

Issue: Queries not fetching on component mount
   Solution: Check if enabled is set correctly
   
   // This won't fetch if id is null
   useQuery({
     queryKey: ['users', id],
     queryFn: () => fetch(`/api/users/${id}`).then(r => r.json()),
     enabled: !!id, // Explicitly set enabled
   })

Issue: Stale data being shown
   Solution: Adjust stale time or use manual refetch
   
   const { refetch } = useUsers()
   
   // Manual refetch when needed
   <button onClick={() => refetch()}>Refresh</button>

Issue: Too many HTTP requests
   Solution: Increase stale time or use request deduplication
   
   // React Query automatically deduplicates identical
   // requests made within the same tick

For more information:
   - Docs: https://tanstack.com/query/latest
   - DevTools: Install @tanstack/react-query-devtools
*/

export {}; // This is a documentation file, not actual code
