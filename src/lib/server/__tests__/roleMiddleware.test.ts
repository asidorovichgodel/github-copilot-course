// Mock next-auth and next/navigation to avoid ESM parse errors from jose/openid-client
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { isAdmin, requireAuth, requireAdminRole } from '../roleMiddleware';

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe('roleMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // redirect() in Next.js throws internally — simulate that so control flow stops
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
  });

  describe('requireAuth()', () => {
    it('should redirect to /sign-in when there is no session', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      // Act & Assert
      await expect(requireAuth()).rejects.toThrow('NEXT_REDIRECT');
      expect(mockRedirect).toHaveBeenCalledWith('/sign-in');
    });

    it('should redirect to /sign-in when session has no user', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue({ user: null, expires: '' } as never);

      // Act & Assert
      await expect(requireAuth()).rejects.toThrow('NEXT_REDIRECT');
      expect(mockRedirect).toHaveBeenCalledWith('/sign-in');
    });

    it('should return the session when the user is authenticated', async () => {
      // Arrange
      const session = { user: { id: 'u1', email: 'a@b.com', roles: ['user'] }, expires: '' };
      mockGetServerSession.mockResolvedValue(session as never);

      // Act
      const result = await requireAuth();

      // Assert
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBe(session);
    });
  });

  describe('requireAdminRole()', () => {
    it('should redirect to /sign-in when there is no session', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      // Act & Assert
      await expect(requireAdminRole()).rejects.toThrow('NEXT_REDIRECT');
      expect(mockRedirect).toHaveBeenCalledWith('/sign-in');
    });

    it('should redirect to / when the user does not have the admin role', async () => {
      // Arrange
      const session = { user: { id: 'u1', email: 'a@b.com', roles: ['user'] }, expires: '' };
      mockGetServerSession.mockResolvedValue(session as never);

      // Act & Assert
      await expect(requireAdminRole()).rejects.toThrow('NEXT_REDIRECT');
      expect(mockRedirect).toHaveBeenCalledWith('/');
    });

    it('should redirect to / when the user has no roles array', async () => {
      // Arrange
      const session = { user: { id: 'u1', email: 'a@b.com', roles: undefined }, expires: '' };
      mockGetServerSession.mockResolvedValue(session as never);

      // Act & Assert
      await expect(requireAdminRole()).rejects.toThrow('NEXT_REDIRECT');
      expect(mockRedirect).toHaveBeenCalledWith('/');
    });

    it('should return the session when the user has the admin role', async () => {
      // Arrange
      const session = { user: { id: 'u1', email: 'a@b.com', roles: ['admin'] }, expires: '' };
      mockGetServerSession.mockResolvedValue(session as never);

      // Act
      const result = await requireAdminRole();

      // Assert
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBe(session);
    });

    it('should return the session when the user has admin among multiple roles', async () => {
      // Arrange
      const session = { user: { id: 'u1', email: 'a@b.com', roles: ['user', 'admin'] }, expires: '' };
      mockGetServerSession.mockResolvedValue(session as never);

      // Act
      const result = await requireAdminRole();

      // Assert
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(result).toBe(session);
    });
  });

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
