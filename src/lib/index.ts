/**
 * Index file for src/lib
 * Centralized exports for shared utilities, types, and helpers
 * Following Vercel's recommended structure for shared code
 */

// Types
export type * from './types';

// Errors
export { AppError, type ErrorCode } from './errors';

// Constants
export * from './constants';

// Utilities
export * from './helpers';
export * from './validation';
export * from './utils';

// Zustand Stores
export * from './stores';

// Zod Schemas
export * from './schemas';

// React Query
export { createQueryClient } from './queryClient';
