'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { AppError } from '@/lib';
import { requireAdminRole } from '@/lib/server/roleMiddleware';
import { userService } from '@/_services';
import { userEditSchema, type UserEditFormData } from '@/lib/schemas';

/**
 * Server action for the admin user-edit form.
 *
 * Architecture: Server Action → Service → Repository → Prisma
 * Server actions call the service layer directly — routing through
 * an API endpoint would add unnecessary HTTP overhead for server-side code.
 *
 * Validation is performed twice:
 *  1. Client-side by React Hook Form + Zod (fast UX feedback)
 *  2. Server-side here before touching the database (security)
 */
export const updateUser = async (userId: string, data: UserEditFormData): Promise<void> => {
  await requireAdminRole();

  if (!userId) {
    throw AppError.validation('User ID is required');
  }

  // Re-validate on the server with the same Zod schema used by the form
  const parsed = userEditSchema.safeParse(data);
  if (!parsed.success) {
    throw AppError.validation(parsed.error.issues[0].message);
  }

  await userService.updateUserWithRoles(userId, parsed.data);

  revalidatePath('/admin/users');
  redirect('/admin/users');
};
