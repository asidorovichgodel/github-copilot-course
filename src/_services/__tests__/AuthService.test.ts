import { AuthService } from '../AuthService';

jest.mock('@/_repositories', () => ({
  userRepository: {
    findAuthByEmail: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/lib/auth/password', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  verifyPassword: jest.fn(),
}));

import { userRepository } from '@/_repositories';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;
const mockVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>;

const authUser = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  passwordHash: 'hashed_password',
  roles: ['user'],
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  describe('registerUser()', () => {
    const validInput = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@Example.COM',
      password: 'Password1!',
    };

    it('should register a new user and return auth user data', async () => {
      // Arrange
      const createdUser = {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: ['user'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepository.findAuthByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(createdUser);

      // Act
      const result = await authService.registerUser(validInput);

      // Assert
      expect(result).toMatchObject({
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        passwordHash: 'hashed_password',
        roles: ['user'],
      });
    });

    it('should normalize email to lowercase before checking', async () => {
      // Arrange
      mockUserRepository.findAuthByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: ['user'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      await authService.registerUser(validInput);

      // Assert
      expect(mockUserRepository.findAuthByEmail).toHaveBeenCalledWith('john@example.com');
    });

    it('should assign default role "user" to new registrations', async () => {
      // Arrange
      mockUserRepository.findAuthByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: ['user'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      await authService.registerUser(validInput);

      // Assert
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ roles: ['user'] }),
      );
    });

    it('should throw CONFLICT when email already exists', async () => {
      // Arrange
      mockUserRepository.findAuthByEmail.mockResolvedValue(authUser);

      // Act & Assert
      await expect(authService.registerUser(validInput)).rejects.toMatchObject({
        code: 'CONFLICT',
        message: 'User with this email already exists',
      });
    });

    it('should hash the password before persisting', async () => {
      // Arrange
      mockUserRepository.findAuthByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: ['user'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      await authService.registerUser(validInput);

      // Assert
      expect(hashPassword).toHaveBeenCalledWith(validInput.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: 'hashed_password' }),
      );
    });
  });

  describe('validateCredentials()', () => {
    it('should return the user when credentials are valid', async () => {
      // Arrange
      mockUserRepository.findAuthByEmail.mockResolvedValue(authUser);
      mockVerifyPassword.mockResolvedValue(true);

      // Act
      const result = await authService.validateCredentials('John@Example.COM', 'Password1!');

      // Assert
      expect(result).toEqual(authUser);
      expect(mockUserRepository.findAuthByEmail).toHaveBeenCalledWith('john@example.com');
    });

    it('should return null when user is not found', async () => {
      // Arrange
      mockUserRepository.findAuthByEmail.mockResolvedValue(null);

      // Act
      const result = await authService.validateCredentials('unknown@example.com', 'password');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      // Arrange
      mockUserRepository.findAuthByEmail.mockResolvedValue(authUser);
      mockVerifyPassword.mockResolvedValue(false);

      // Act
      const result = await authService.validateCredentials('john@example.com', 'wrong-password');

      // Assert
      expect(result).toBeNull();
    });

    it('should normalize email to lowercase before lookup', async () => {
      // Arrange
      mockUserRepository.findAuthByEmail.mockResolvedValue(null);

      // Act
      await authService.validateCredentials('JOHN@EXAMPLE.COM', 'password');

      // Assert
      expect(mockUserRepository.findAuthByEmail).toHaveBeenCalledWith('john@example.com');
    });
  });
});
