/**
 * Server-specific utilities and middleware
 * Error handling and request/response wrappers for Next.js Route Handlers
 */

import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '../errors';
import { createErrorResponse } from '../helpers';

/**
 * Error handler for API routes
 * Catches and formats errors into standardized responses
 */
export function errorHandler(error: unknown) {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(createErrorResponse(error.message), {
      status: error.statusCode,
    });
  }

  if (error instanceof Error) {
    return NextResponse.json(createErrorResponse(error.message), {
      status: 500,
    });
  }

  return NextResponse.json(
    createErrorResponse('An unexpected error occurred'),
    { status: 500 }
  );
}

/**
 * Wrapper for API route handlers with error handling
 * Ensures all errors are caught and formatted consistently
 */
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      return errorHandler(error);
    }
  };
}
