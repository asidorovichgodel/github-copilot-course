/**
 * Custom Hooks for User API
 * Provides React Query hooks for user-related API calls
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserInput, UpdateUserInput } from '@/_repositories';
import type { PaginatedResponse } from '@/lib';

const USERS_QUERY_KEY = ['users'] as const;

/**
 * Fetch a single user by ID
 */
export const useUser = (id: string | null) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');

      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!id,
  });
};

/**
 * Fetch paginated list of users
 */
export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, 'list', page, limit],
    queryFn: async (): Promise<{ success: boolean; data: PaginatedResponse<User> }> => {
      const response = await fetch(`/api/users?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      return response.json();
    },
  });
};

/**
 * Create a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

/**
 * Update an existing user
 */
export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Update specific user cache
      queryClient.setQueryData([...USERS_QUERY_KEY, userId], data);
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

/**
 * Delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};
