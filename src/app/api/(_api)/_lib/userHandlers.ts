/**
 * API Handlers for User routes
 * These can be colocated inside route groups using private folders
 * Following Vercel's pattern of organizing code within the app directory
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/_services';
import { createSuccessResponse, validatePaginationParams } from '@/lib';
import { withErrorHandling } from '@/lib/server';
import type { PaginationParams } from '@/lib';

export const getUsersHandler = withErrorHandling(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const { page: validPage, limit: validLimit } = validatePaginationParams(page, limit);

  const params: PaginationParams = {
    page: validPage,
    limit: validLimit,
  };

  const result = await userService.getAllUsers(params);
  return NextResponse.json(createSuccessResponse(result));
});

export const getUserHandler = withErrorHandling(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'User ID is required' },
      { status: 400 }
    );
  }

  const user = await userService.getUserById(id);
  return NextResponse.json(createSuccessResponse(user));
});

export const createUserHandler = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const user = await userService.createUser(body);
  return NextResponse.json(createSuccessResponse(user), { status: 201 });
});

export const updateUserHandler = withErrorHandling(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'User ID is required' },
      { status: 400 }
    );
  }

  const body = await req.json();
  const user = await userService.updateUser(id, body);
  return NextResponse.json(createSuccessResponse(user));
});

export const deleteUserHandler = withErrorHandling(async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'User ID is required' },
      { status: 400 }
    );
  }

  await userService.deleteUser(id);
  return NextResponse.json(createSuccessResponse(null));
});
