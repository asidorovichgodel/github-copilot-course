import { userRepository, type AuthUser } from '@/_repositories';
import { AppError } from '@/lib';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class AuthService {
  async registerUser(input: RegisterInput): Promise<AuthUser> {
    const email = input.email.toLowerCase();

    const existingUser = await userRepository.findAuthByEmail(email);
    if (existingUser) {
      throw AppError.conflict('User with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);

    const created = await userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      passwordHash,
      roles: ['user'],
    });

    return {
      id: created.id,
      firstName: created.firstName,
      lastName: created.lastName,
      email: created.email,
      passwordHash,
      roles: created.roles,
    };
  }

  async validateCredentials(email: string, password: string): Promise<AuthUser | null> {
    const normalizedEmail = email.toLowerCase();
    const user = await userRepository.findAuthByEmail(normalizedEmail);

    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return user;
  }
}

export const authService = new AuthService();
