/**
 * Query Provider Component
 * Provides React Query client to the entire application
 * Must be used as a client component
 */

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { createQueryClient } from '@/lib/queryClient';

const queryClient = createQueryClient();

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
};
