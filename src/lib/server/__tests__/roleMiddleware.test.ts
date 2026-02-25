// Mock next-auth and next/navigation to avoid ESM parse errors from jose/openid-client
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

import { isAdmin } from '../roleMiddleware';

describe('roleMiddleware', () => {
  describe('isAdmin()', () => {
    it('should return true when roles include "admin"', () => {
      // Arrange & Act
      const result = isAdmin(['user', 'admin']);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when roles do not include "admin"', () => {
      const result = isAdmin(['user', 'editor']);

      expect(result).toBe(false);
    });

    it('should return false for an empty roles array', () => {
      const result = isAdmin([]);

      expect(result).toBe(false);
    });

    it('should return false when roles is undefined', () => {
      const result = isAdmin(undefined);

      expect(result).toBe(false);
    });

    it('should return true for roles containing only "admin"', () => {
      const result = isAdmin(['admin']);

      expect(result).toBe(true);
    });

    it('should be case-sensitive and not match "Admin"', () => {
      const result = isAdmin(['Admin']);

      expect(result).toBe(false);
    });
  });
});
