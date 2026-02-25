import { UserService } from '../UserService';
import { AppError } from '@/lib/errors';

// Mock the repository module
jest.mock('@/_repositories', () => ({
  userRepository: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateRoles: jest.fn(),
  },
}));

// Mock the password utility
jest.mock('@/lib/auth/password', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
}));

import { userRepository } from '@/_repositories';
import { hashPassword } from '@/lib/auth/password';

const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;
const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;

const baseUser = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  roles: ['user'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  describe('createUser()', () => {
    const validInput = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password1!',
    };

    it('should create a user when input is valid and email is not taken', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(baseUser);

      // Act
      const result = await userService.createUser(validInput);

      // Assert
      expect(result).toEqual(baseUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockHashPassword).toHaveBeenCalledWith(validInput.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          passwordHash: 'hashed_password',
        }),
      );
    });

    it('should lowercase the email before saving', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(baseUser);

      // Act
      await userService.createUser({ ...validInput, email: 'JOHN@EXAMPLE.COM' });

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'john@example.com' }),
      );
    });

    it('should throw CONFLICT when email already exists', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(baseUser);

      // Act & Assert
      await expect(userService.createUser(validInput)).rejects.toThrow(AppError);
      await expect(userService.createUser(validInput)).rejects.toMatchObject({
        code: 'CONFLICT',
      });
    });

    it('should throw VALIDATION_ERROR when first name is too short', async () => {
      await expect(
        userService.createUser({ ...validInput, firstName: '' }),
      ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
    });

    it('should throw VALIDATION_ERROR when email is invalid', async () => {
      await expect(
        userService.createUser({ ...validInput, email: 'not-an-email' }),
      ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
    });

    it('should throw VALIDATION_ERROR when password is too short', async () => {
      await expect(
        userService.createUser({ ...validInput, password: 'short' }),
      ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
    });
  });

  describe('getUserById()', () => {
    it('should return the user when found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(baseUser);

      // Act
      const result = await userService.getUserById('user-1');

      // Assert
      expect(result).toEqual(baseUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw NOT_FOUND when user does not exist', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById('nonexistent')).rejects.toMatchObject({
        code: 'NOT_FOUND',
      });
    });
  });

  describe('getAllUsers()', () => {
    it('should return paginated users', async () => {
      // Arrange
      const paginatedResult = {
        items: [baseUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockUserRepository.findAll.mockResolvedValue(paginatedResult);

      // Act
      const result = await userService.getAllUsers({ page: 1, limit: 10 });

      // Assert
      expect(result).toEqual(paginatedResult);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('updateUser()', () => {
    it('should update a user when found and input is valid', async () => {
      // Arrange
      const updatedUser = { ...baseUser, firstName: 'Jane' };
      mockUserRepository.findById.mockResolvedValue(baseUser);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateUser('user-1', { firstName: 'Jane' });

      // Assert
      expect(result).toEqual(updatedUser);
    });

    it('should throw NOT_FOUND when user does not exist', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateUser('nonexistent', { firstName: 'Jane' })).rejects.toMatchObject({
        code: 'NOT_FOUND',
      });
    });

    it('should throw CONFLICT when new email is taken by another user', async () => {
      // Arrange
      const otherUser = { ...baseUser, id: 'user-2', email: 'taken@example.com' };
      mockUserRepository.findById.mockResolvedValue(baseUser);
      mockUserRepository.findByEmail.mockResolvedValue(otherUser);

      // Act & Assert
      await expect(
        userService.updateUser('user-1', { email: 'taken@example.com' }),
      ).rejects.toMatchObject({ code: 'CONFLICT' });
    });

    it('should allow updating email to the same user own email', async () => {
      // Arrange — findByEmail returns the same user
      const updatedUser = { ...baseUser };
      mockUserRepository.findById.mockResolvedValue(baseUser);
      mockUserRepository.findByEmail.mockResolvedValue(baseUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      // Act & Assert — should not throw
      await expect(
        userService.updateUser('user-1', { email: 'john@example.com' }),
      ).resolves.toEqual(updatedUser);
    });
  });

  describe('deleteUser()', () => {
    it('should delete a user when found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(baseUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      // Act
      await userService.deleteUser('user-1');

      // Assert
      expect(mockUserRepository.delete).toHaveBeenCalledWith('user-1');
    });

    it('should throw NOT_FOUND when user does not exist', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser('nonexistent')).rejects.toMatchObject({
        code: 'NOT_FOUND',
      });
    });
  });

  describe('updateUserWithRoles()', () => {
    it('should update user profile and replace roles', async () => {
      // Arrange
      const updatedUser = { ...baseUser, roles: ['admin'] };
      mockUserRepository.findById.mockResolvedValue(baseUser);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.update.mockResolvedValue(baseUser);
      mockUserRepository.updateRoles.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateUserWithRoles('user-1', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roleIds: ['role-admin'],
      });

      // Assert
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.updateRoles).toHaveBeenCalledWith('user-1', ['role-admin']);
    });
  });
});
