import { createQueryClient } from '../queryClient';
import { QueryClient } from '@tanstack/react-query';

describe('createQueryClient()', () => {
  it('should return a QueryClient instance', () => {
    // Act
    const client = createQueryClient();

    // Assert
    expect(client).toBeInstanceOf(QueryClient);
  });

  it('should create a new QueryClient on each call', () => {
    // Act
    const client1 = createQueryClient();
    const client2 = createQueryClient();

    // Assert
    expect(client1).not.toBe(client2);
  });

  describe('query defaults', () => {
    it('should set staleTime to 5 minutes', () => {
      const client = createQueryClient();

      expect(client.getDefaultOptions().queries?.staleTime).toBe(1000 * 60 * 5);
    });

    it('should set gcTime to 10 minutes', () => {
      const client = createQueryClient();

      expect(client.getDefaultOptions().queries?.gcTime).toBe(1000 * 60 * 10);
    });

    it('should disable refetchOnWindowFocus', () => {
      const client = createQueryClient();

      expect(client.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(false);
    });

    it('should set query retry to 1', () => {
      const client = createQueryClient();

      expect(client.getDefaultOptions().queries?.retry).toBe(1);
    });
  });

  describe('mutation defaults', () => {
    it('should set mutation retry to 1', () => {
      const client = createQueryClient();

      expect(client.getDefaultOptions().mutations?.retry).toBe(1);
    });
  });
});
