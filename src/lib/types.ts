/**
 * Common types and interfaces shared across the application
 * Aligned with Vercel's recommended structure using src/lib/ for shared utilities
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RequestContext {
  userId?: string;
  userRole?: string;
  requestId: string;
  timestamp: Date;
}
