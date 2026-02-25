/**
 * API Route: POST /api/cv
 * Handles CV PDF upload and extraction
 */

import { NextRequest } from 'next/server';
import { uploadCvHandler } from '@/app/api/(_api)/_lib/cvHandlers';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  return uploadCvHandler(req);
}
