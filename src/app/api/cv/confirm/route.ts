/**
 * API Route: POST /api/cv/confirm
 * This endpoint is deprecated – the new upload flow is direct (no confirmation step).
 * Returning 410 Gone to communicate this to any legacy clients.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been removed. CV processing is now direct.' },
    { status: 410 },
  );
}
