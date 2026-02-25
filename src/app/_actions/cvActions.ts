'use server';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/server/roleMiddleware';
import { AppError } from '@/lib';
import { cvService, type CvProcessingResult } from '@/_services';

/**
 * Server action: validate and process a CV PDF upload.
 * Architecture: Server Action → CvService → CandidateRepository → Prisma
 *
 * Accepts a FormData payload containing:
 *   - file          (File)   — the PDF
 *   - targetUserId  (string) — optional: link CV to an existing system user
 *   - candidateId   (string) — optional: update an existing candidate record
 *
 * Used by: (site)/cv/page, admin/cv/page,
 *          candidates/[id]/_components/CandidateCvUpload,
 *          admin/users/[id]/_components/CvUploadWidget
 */
export const uploadCv = async (formData: FormData): Promise<CvProcessingResult> => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw AppError.unauthorized('Authentication required');
  }

  if (!isAdmin(session.user.roles)) {
    throw AppError.forbidden('Admin role required to upload CVs');
  }

  const file = formData.get('file');
  const targetUserId = formData.get('targetUserId');
  const candidateId = formData.get('candidateId');

  if (!(file instanceof File)) {
    throw AppError.validation('PDF file is required');
  }

  cvService.validateUpload(file.type, file.size);

  const uploadedBy = session.user.id ?? null;

  const buffer = Buffer.from(await file.arrayBuffer());

  return cvService.processUpload(
    buffer,
    file.name,
    uploadedBy,
    typeof targetUserId === 'string' && targetUserId ? targetUserId : undefined,
    typeof candidateId === 'string' && candidateId ? candidateId : undefined,
  );
};
