/**
 * Helper utilities for common operations
 * Aligned with Vercel's src/lib pattern for shared utilities
 */

import type { ApiResponse } from './types';
import { PAGINATION } from './constants';

/**
 * Creates a standardized API response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generates a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates pagination parameters
 */
export function validatePaginationParams(page?: number, limit?: number) {
  const validPage = Math.max(PAGINATION.DEFAULT_PAGE, page || PAGINATION.DEFAULT_PAGE);
  const validLimit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, limit || PAGINATION.DEFAULT_LIMIT));
  return { page: validPage, limit: validLimit };
}
