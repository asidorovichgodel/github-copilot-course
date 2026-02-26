'use server';

import { authService } from '@/_services';
import { userRegistrationSchema, type UserRegistrationFormData } from '@/lib/schemas';

/**
 * Server action: register a new user account.
 * Architecture: Server Action → AuthService → UserRepository → Prisma
 *
 * Returns { error } on failure so the client form can display it,
 * or an empty object on success so the client can redirect.
 */
export const registerUser = async (data: UserRegistrationFormData): Promise<{ error?: string }> => {
  const parsed = userRegistrationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await authService.registerUser({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    return {};
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Registration failed. Please try again.',
    };
  }
};
