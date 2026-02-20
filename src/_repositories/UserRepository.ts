/**
 * User Repository
 * Data access layer - moved to src/_repositories (private folder)
 * Following Vercel's convention for non-routable implementation details
 */

import type { PaginatedResponse, PaginationParams } from '@/lib';
import { AppError } from '@/lib';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export class UserRepository {
  // Simulated database storage
  private users: Map<string, User> = new Map();
  private nextId = 1;

  async create(input: CreateUserInput): Promise<User> {
    const id = `user_${this.nextId++}`;
    const now = new Date();

    const user: User = {
      id,
      name: input.name,
      email: input.email,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findAll(params: PaginationParams): Promise<PaginatedResponse<User>> {
    const items = Array.from(this.users.values());
    const total = items.length;
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;

    return {
      items: items.slice(start, end),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    };
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const updated: User = {
      ...user,
      ...input,
      updatedAt: new Date(),
    };

    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

export const userRepository = new UserRepository();
