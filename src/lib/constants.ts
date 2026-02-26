/**
 * Application constants
 * Centralized configuration values used across layers
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 255,
} as const;

// API Responses
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  VALIDATION_ERROR: 'Invalid input provided',
} as const;

// File Uploads
export const FILE_UPLOAD = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ['application/pdf'],
} as const;
