/**
 * User Repository
 * Data access layer - moved to src/_repositories (private folder)
 * Following Vercel's convention for non-routable implementation details
 */

import type { PaginatedResponse, PaginationParams } from '@/lib';
import { prisma } from '@/lib/server/prisma';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  roles: string[];
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  roles?: string[];
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const mapUser = (user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: { role: { name: string } }[];
  createdAt: Date;
  updatedAt: Date;
}): User => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  roles: user.roles.map((role) => role.role.name),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const mapAuthUser = (user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  roles: { role: { name: string } }[];
}): AuthUser => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  passwordHash: user.passwordHash,
  roles: user.roles.map((role) => role.role.name),
});

export class UserRepository {
  async create(input: CreateUserInput): Promise<User> {
    const roles = input.roles?.length ? input.roles : ['user'];

    const user = await prisma.user.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        passwordHash: input.passwordHash,
        roles: {
          create: roles.map((role) => ({
            role: {
              connectOrCreate: {
                where: { name: role },
                create: { name: role },
              },
            },
          })),
        },
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    return mapUser(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    return user ? mapUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    return user ? mapUser(user) : null;
  }

  async findAuthByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    return user ? mapAuthUser(user) : null;
  }

  async findAll(params: PaginationParams): Promise<PaginatedResponse<User>> {
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: {
            include: { role: true },
          },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      items: items.map(mapUser),
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    };
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(input.firstName ? { firstName: input.firstName } : {}),
        ...(input.lastName ? { lastName: input.lastName } : {}),
        ...(input.email ? { email: input.email } : {}),
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    return mapUser(user);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  /**
   * Replace all roles for a user atomically.
   * Deletes existing assignments and creates the new set in one transaction.
   */
  async updateRoles(id: string, roleIds: string[]): Promise<User> {
    await prisma.$transaction([
      prisma.userRole.deleteMany({ where: { userId: id } }),
      ...(roleIds.length > 0
        ? [
            prisma.userRole.createMany({
              data: roleIds.map((roleId) => ({ userId: id, roleId })),
            }),
          ]
        : []),
    ]);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: { roles: { include: { role: true } } },
    });

    return mapUser(user);
  }
}

export const userRepository = new UserRepository();
