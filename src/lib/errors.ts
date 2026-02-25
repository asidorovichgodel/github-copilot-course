/**
 * Custom error class for application-level errors
 * Provides consistent error handling across the application
 */

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'DATABASE_ERROR'
  | 'EXTERNAL_API_ERROR';

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static validation(message: string, details?: Record<string, unknown>) {
    return new AppError('VALIDATION_ERROR', 400, message, details);
  }

  static notFound(message: string) {
    return new AppError('NOT_FOUND', 404, message);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new AppError('UNAUTHORIZED', 401, message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError('FORBIDDEN', 403, message);
  }

  static conflict(message: string) {
    return new AppError('CONFLICT', 409, message);
  }

  static internal(message: string = 'Internal server error') {
    return new AppError('INTERNAL_ERROR', 500, message);
  }

  static database(message: string) {
    return new AppError('DATABASE_ERROR', 500, message);
  }

  static externalApi(message: string) {
    return new AppError('EXTERNAL_API_ERROR', 502, message);
  }
}
