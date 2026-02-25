/**
 * API Route: GET /api/users/[id], PUT /api/users/[id], DELETE /api/users/[id]
 * Handles retrieving, updating, and deleting individual users
 * 
 * This route demonstrates Vercel's recommended structure:
 * - Route handlers stay minimal in app/api/
 * - Private folder (_lib) colocates handlers near routes
 * - Business logic lives in _services and _repositories (outside app)
 */

import { NextRequest } from 'next/server';
import {
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '@/app/api/(_api)/_lib/userHandlers';

export async function GET(req: NextRequest) {
  return getUserHandler(req);
}

export async function PUT(req: NextRequest) {
  return updateUserHandler(req);
}

export async function PATCH(req: NextRequest) {
  return updateUserHandler(req);
}

export async function DELETE(req: NextRequest) {
  return deleteUserHandler(req);
}
