import { NextResponse } from 'next/server';

/**
 * POST /api/admin/cv/confirm
 * Deprecated - the confirmation step was removed.
 * CV uploads now process and persist data directly without a confirmation round-trip.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been removed. CV processing is now direct.' },
    { status: 410 },
  );
}
