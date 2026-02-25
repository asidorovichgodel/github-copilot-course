import { NextRequest, NextResponse } from 'next/server';

import { authService } from '@/_services';
import { createSuccessResponse } from '@/lib';
import { userRegistrationSchema } from '@/lib/schemas';
import { withErrorHandling } from '@/lib/server';

export const registerUserHandler = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = userRegistrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten().formErrors.join(', ') || 'Invalid input' },
      { status: 400 }
    );
  }

  const user = await authService.registerUser({
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    email: parsed.data.email,
    password: parsed.data.password,
  });

  return NextResponse.json(
    createSuccessResponse({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    }),
    { status: 201 }
  );
});
