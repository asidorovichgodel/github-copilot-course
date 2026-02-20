import type { Metadata } from 'next';
import Link from 'next/link';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import {
  BookOpen,
  LogIn,
  NotebookPen,
  Sparkles,
  UserPlus,
  Users,
  WandSparkles,
} from 'lucide-react';

import './globals.css';
import { QueryProvider } from '@/components/QueryProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const sansFont = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });
const displayFont = Fraunces({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'GitHub Copilot Course',
  description: 'A comprehensive course for learning GitHub Copilot and AI-assisted development',
};

const navItems = [
  { href: '/', label: 'Overview', icon: Sparkles },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/exercises', label: 'Exercises', icon: NotebookPen, badge: 'Soon' },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/sign-in', label: 'Sign in', icon: LogIn },
  { href: '/sign-up', label: 'Sign up', icon: UserPlus },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background text-foreground antialiased', sansFont.variable, displayFont.variable)}>
        <QueryProvider>
          <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_-10%,hsl(var(--muted))_0%,transparent_55%)]" />
            <SidebarProvider>
            <Sidebar>
              <SidebarHeader className="px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-11 w-11 items-center justify-center rounded-2xl">
                    <WandSparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-sidebar-foreground/60">Course</p>
                    <p className="text-lg font-semibold">GitHub Copilot</p>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarSeparator />
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="px-6 pb-6">
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <p className="text-sm font-semibold">Ready for your first prompt?</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jump into curated starter lessons or explore Copilot best practices.
                  </p>
                  <Button asChild className="mt-4 w-full">
                    <Link href="/lessons">Start learning</Link>
                  </Button>
                </div>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>

            <SidebarInset className="min-h-svh">
              <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
                <div className="flex items-center gap-3 px-4 py-4 lg:px-8">
                  <SidebarTrigger className="lg:hidden" />

                  <div className="flex flex-1 items-center gap-3">
                    <div className="hidden lg:block">
                      <p className="text-sm text-muted-foreground">GitHub Copilot Course</p>
                      <p className="text-lg font-semibold">Ship better prompts</p>
                    </div>
                    <div className="ml-auto hidden w-72 lg:block">
                      <Input aria-label="Search lessons" placeholder="Search lessons" type="search" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild className="hidden sm:inline-flex">
                      <Link href="/lessons">Start learning</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Quick links</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/lessons">Browse lessons</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href="https://github.com/YOUR_USERNAME/github-copilot-course" target="_blank" rel="noreferrer">
                            GitHub repo
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <a href="https://docs.github.com/copilot" target="_blank" rel="noreferrer">
                            Copilot docs
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>

              <main className="flex-1 px-4 py-10 lg:px-10">
                <div className="mx-auto w-full max-w-6xl">{children}</div>
              </main>

              <footer className="border-t bg-background/80 py-6 text-center text-sm text-muted-foreground">
                <p>© 2026 GitHub Copilot Course. Licensed under MIT.</p>
              </footer>
            </SidebarInset>
            </SidebarProvider>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
