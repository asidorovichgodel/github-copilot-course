import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser, useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../useUsers';

/**
 * Creates a fresh QueryClient wrapper for each test.
 * Retries are disabled so failed queries surface immediately.
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useUser()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not fetch when id is null', () => {
    // Arrange
    global.fetch = jest.fn();
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useUser(null), { wrapper });

    // Assert — query is disabled, fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('should fetch and return data for a valid user id', async () => {
    // Arrange
    const userData = { id: '1', email: 'john@example.com' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => userData,
    });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useUser('1'), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(userData);
    expect(global.fetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('should set isError when the response is not ok', async () => {
    // Arrange
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useUser('99'), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe('Failed to fetch user: 404');
  });
});

describe('useUsers()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch with default pagination (page=1, limit=10)', async () => {
    // Arrange
    const responseData = { success: true, data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 } };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => responseData,
    });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useUsers(), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(global.fetch).toHaveBeenCalledWith('/api/users?page=1&limit=10');
    expect(result.current.data).toEqual(responseData);
  });

  it('should fetch with custom pagination parameters', async () => {
    // Arrange
    const responseData = { success: true, data: { items: [], total: 0, page: 2, limit: 5, totalPages: 0 } };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => responseData,
    });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useUsers(2, 5), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(global.fetch).toHaveBeenCalledWith('/api/users?page=2&limit=5');
  });

  it('should set isError when the response is not ok', async () => {
    // Arrange
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useUsers(), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe('Failed to fetch users: 500');
  });
});

describe('useCreateUser()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should POST to /api/users with JSON body and return created user', async () => {
    // Arrange
    const newUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'Password1!',
    };
    const createdUser = { id: '2', ...newUser };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => createdUser,
    });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useCreateUser(), { wrapper });
    const data = await result.current.mutateAsync(newUser);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    expect(data).toEqual(createdUser);
  });

  it('should throw when the response is not ok', async () => {
    // Arrange
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 400 });
    const wrapper = createWrapper();
    const newUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'Password1!',
    };

    // Act
    const { result } = renderHook(() => useCreateUser(), { wrapper });

    // Assert
    await expect(result.current.mutateAsync(newUser)).rejects.toThrow('Failed to create user: 400');
  });
});

describe('useUpdateUser()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should PATCH /api/users/:id with JSON body and return updated user', async () => {
    // Arrange
    const updatedUser = { id: '1', firstName: 'John', lastName: 'Updated' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => updatedUser,
    });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useUpdateUser('1'), { wrapper });
    const input = { firstName: 'John', lastName: 'Updated' };
    const data = await result.current.mutateAsync(input);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith('/api/users/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    expect(data).toEqual(updatedUser);
  });

  it('should throw when the response is not ok', async () => {
    // Arrange
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useUpdateUser('999'), { wrapper });

    // Assert
    await expect(result.current.mutateAsync({ firstName: 'x', lastName: 'y' })).rejects.toThrow(
      'Failed to update user: 404',
    );
  });
});

describe('useDeleteUser()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should DELETE /api/users/:id and return response data', async () => {
    // Arrange
    const deleteResponse = { success: true };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => deleteResponse,
    });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useDeleteUser(), { wrapper });
    const data = await result.current.mutateAsync('1');

    // Assert
    expect(global.fetch).toHaveBeenCalledWith('/api/users/1', { method: 'DELETE' });
    expect(data).toEqual(deleteResponse);
  });

  it('should throw when the response is not ok', async () => {
    // Arrange
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 403 });
    const wrapper = createWrapper();

    // Act
    const { result } = renderHook(() => useDeleteUser(), { wrapper });

    // Assert
    await expect(result.current.mutateAsync('1')).rejects.toThrow('Failed to delete user: 403');
  });
});
