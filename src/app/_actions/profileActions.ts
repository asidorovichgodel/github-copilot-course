'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { AppError } from '@/lib';
import { userRepository } from '@/_repositories';
import { userProfileSchema, type UserProfileFormData } from '@/lib/schemas/userSchemas';

/**
 * Server action for the user profile edit form.
 *
 * Validation is performed twice:
 *  1. Client-side by React Hook Form + Zod (fast UX feedback)
 *  2. Server-side here before touching the database (security)
 */
export async function updateProfile(data: UserProfileFormData): Promise<void> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw AppError.unauthorized('Authentication required');
  }

  // Re-validate on the server with the same Zod schema used by the form
  const parsed = userProfileSchema.safeParse(data);
  if (!parsed.success) {
    throw AppError.validation(parsed.error.issues[0].message);
  }

  await userRepository.update(session.user.id, parsed.data);

  revalidatePath('/profile');
}
