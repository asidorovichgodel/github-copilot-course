import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/server/roleMiddleware';
import { prisma } from '@/lib/server/prisma';

/**
 * GET /api/admin/candidates
 * Retrieve list of all candidates (admin only)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const candidates = await prisma.candidate.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        title: true,
      },
      orderBy: { fullName: 'asc' },
    });

    return NextResponse.json(
      { success: true, data: candidates, timestamp: new Date().toISOString() },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
