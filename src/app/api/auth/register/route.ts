/**
 * API Route: POST /api/auth/register
 * Handles user self-registration
 */

import { NextRequest } from 'next/server';
import { registerUserHandler } from '@/app/api/(_api)/_lib/authHandlers';

export async function POST(req: NextRequest) {
  return registerUserHandler(req);
}
