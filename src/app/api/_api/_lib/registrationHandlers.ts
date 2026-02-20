/**
 * Example API route demonstrating Zod validation on the server.
 * 
 * Best practices:
 * - Always validate input on the server (never trust client)
 * - Return structured error responses
 * - Use TypeScript for type safety
 * - Handle errors gracefully
 */

import { NextRequest, NextResponse } from 'next/server';
import { userRegistrationSchema, ValidationResult } from '@/lib/schemas';
import { validateFormDataAsync } from '@/lib/schemas/formValidation';

/**
 * Format Zod validation errors for API response
 */
interface ErrorResponse {
  success: false;
  errors: Record<string, string>;
}

interface SuccessResponse {
  success: true;
  message: string;
  data: unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validation = await validateFormDataAsync(userRegistrationSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors || {},
        },
        { status: 400 },
      );
    }

    // Validated data is type-safe
    const registrationData = validation.data as Record<string, unknown>;

    // TODO: Save to database
    console.log('Registering user:', registrationData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: {
          email: registrationData.email,
          // Don't return passwords in response!
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json(
      {
        success: false,
        errors: {
          form: 'An unexpected error occurred',
        },
      },
      { status: 500 },
    );
  }
}
