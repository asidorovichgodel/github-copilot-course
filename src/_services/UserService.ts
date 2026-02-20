/**
 * User Service
 * Business logic layer - moved to src/_services (private folder)
 * Following Vercel's convention for non-routable implementation details
 */

import { userRepository, type User, type CreateUserInput, type UpdateUserInput } from '@/_repositories';
import { AppError, validateEmail, validateString, type PaginationParams, type PaginatedResponse } from '@/lib';

export class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    const name = validateString(input.name, 'Name', 1, 100);
    const email = validateEmail(input.email);

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw AppError.conflict('User with this email already exists');
    }

    return userRepository.create({ name, email });
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

    if (input.name !== undefined) {
      updateData.name = validateString(input.name, 'Name', 1, 100);
    }

    if (input.email !== undefined) {
      const email = validateEmail(input.email);

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
}

export const userService = new UserService();
