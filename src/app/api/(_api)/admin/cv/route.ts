import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/server/roleMiddleware';
import { AppError, createSuccessResponse } from '@/lib';
import { cvService } from '@/_services';

/**
 * POST /api/admin/cv
 * Upload CV for a specific user (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(session.user.roles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!(file instanceof File)) {
      throw AppError.validation('PDF file is required');
    }

    if (typeof userId !== 'string' || !userId) {
      throw AppError.validation('User ID is required');
    }

    // Validate CV
    cvService.validateUpload(file.type, file.size);

    // Process upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await cvService.processUpload(buffer, file.name, userId);

    return NextResponse.json(createSuccessResponse(result));
  } catch (error) {
    console.error('Error uploading CV:', error);
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
