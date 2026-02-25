/**
 * API Handlers for CV upload and extraction workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AppError, createSuccessResponse } from '@/lib';
import { withErrorHandling } from '@/lib/server';
import { cvService } from '@/_services';

export const uploadCvHandler = withErrorHandling(async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file');
  const targetUserId = formData.get('targetUserId');
  const candidateId = formData.get('candidateId');

  if (!(file instanceof File)) {
    throw AppError.validation('PDF file is required');
  }

  cvService.validateUpload(file.type, file.size);

  // Resolve the uploading user's ID from session (optional – upload can be anonymous)
  const session = await getServerSession(authOptions);
  const uploadedBy = session?.user?.id ?? null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await cvService.processUpload(
    buffer,
    file.name,
    uploadedBy,
    typeof targetUserId === 'string' ? targetUserId : undefined,
    typeof candidateId === 'string' ? candidateId : undefined,
  );

  return NextResponse.json(createSuccessResponse(result), { status: 201 });
});
