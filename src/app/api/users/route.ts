/**
 * API Route: GET /api/users and POST /api/users
 * Handles listing all users and creating new users
 * 
 * This route demonstrates Vercel's recommended structure:
 * - Route handlers stay minimal in app/api/
 * - Private folder (_lib) colocates handlers near routes
 * - Business logic lives in _services and _repositories (outside app)
 */

import { NextRequest } from 'next/server';
import { getUsersHandler, createUserHandler } from '@/app/api/(_api)/_lib/userHandlers';

export async function GET(req: NextRequest) {
  return getUsersHandler(req);
}

export async function POST(req: NextRequest) {
  return createUserHandler(req);
}
