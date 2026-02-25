/**
 * User Service
 * Business logic layer - moved to src/_services (private folder)
 * Following Vercel's convention for non-routable implementation details
 */

import { userRepository, type User, type UpdateUserInput } from '@/_repositories';
import { AppError, validateEmail, validateString, type PaginationParams, type PaginatedResponse } from '@/lib';
import { hashPassword } from '@/lib/auth/password';

interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: string[];
}

export class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    const firstName = validateString(input.firstName, 'First name', 1, 100);
    const lastName = validateString(input.lastName, 'Last name', 1, 100);
    const email = validateEmail(input.email).toLowerCase();
    const password = validateString(input.password, 'Password', 8, 255);

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw AppError.conflict('User with this email already exists');
    }

    const passwordHash = await hashPassword(password);

    return userRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      roles: input.roles,
    });
  }

  async getUserById(id: string): Promise<User> {
    const user = await userRepository.findById(id);

    if (!user) {
      throw AppError.notFound(`User with ID ${id} not found`);
    }

    return user;
  }

  async getAllUsers(params: PaginationParams): Promise<PaginatedResponse<User>> {
    return userRepository.findAll(params);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    await this.getUserById(id);

    const updateData: UpdateUserInput = {};

    if (input.firstName !== undefined) {
      updateData.firstName = validateString(input.firstName, 'First name', 1, 100);
    }

    if (input.lastName !== undefined) {
      updateData.lastName = validateString(input.lastName, 'Last name', 1, 100);
    }

    if (input.email !== undefined) {
      const email = validateEmail(input.email).toLowerCase();

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== id) {
        throw AppError.conflict('Email already in use by another user');
      }

      updateData.email = email;
    }

    return userRepository.update(id, updateData);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);
    await userRepository.delete(id);
  }

  /**
   * Update a user's profile fields AND replace their role assignments.
   * Used by admin edit forms where both profile and roles are submitted together.
   */
  async updateUserWithRoles(
    id: string,
    input: UpdateUserInput & { roleIds: string[] },
  ): Promise<User> {
    // updateUser handles profile validation and email uniqueness checks
    await this.updateUser(id, {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    });

    return userRepository.updateRoles(id, input.roleIds);
  }
}

export const userService = new UserService();
