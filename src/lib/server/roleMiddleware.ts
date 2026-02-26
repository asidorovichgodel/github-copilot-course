import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';

/**
 * Middleware to protect admin routes
 * Redirects non-admin users to the home page
 */
export const requireAdminRole = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/sign-in');
  }

  const hasAdminRole = session.user.roles?.includes('admin') ?? false;

  if (!hasAdminRole) {
    redirect('/');
  }

  return session;
};

/**
 * Middleware to check authentication
 * Redirects unauthenticated users to sign-in page
 */
export const requireAuth = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/sign-in');
  }

  return session;
};

/**
 * Check if user has admin role
 */
export const isAdmin = (roles?: string[]): boolean => {
  return roles?.includes('admin') ?? false;
};
