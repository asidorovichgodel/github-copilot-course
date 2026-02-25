import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';
import { QueryProvider } from '@/components/QueryProvider';
import { cn } from '@/lib/utils';

const sansFont = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });
const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'CV Manager',
  description: 'Manage candidate profiles extracted from uploaded CVs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background text-foreground antialiased',
          sansFont.variable,
          displayFont.variable
        )}
      >
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
