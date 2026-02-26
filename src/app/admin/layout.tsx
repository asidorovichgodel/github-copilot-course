import Link from 'next/link';
import {
  ArrowLeft,
  BriefcaseBusiness,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { requireAdminRole } from '@/lib/server/roleMiddleware';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserNav } from '@/app/(site)/_components/UserNav';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/roles', label: 'Role Management', icon: Settings },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminRole();
  const session = await getServerSession(authOptions);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_-10%,hsl(var(--destructive))_0%,transparent_55%)]" />
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="px-6 py-6">
            {/* Admin mode identity */}
            <div className="flex items-center gap-3">
              <div className="bg-destructive text-destructive-foreground flex h-11 w-11 items-center justify-center rounded-2xl">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs uppercase tracking-[0.35em] text-sidebar-foreground/60">
                    Admin
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    Active
                  </span>
                </div>
                <p className="text-lg font-semibold">Control Panel</p>
              </div>
            </div>

            {/* Exit admin — prominent, always visible */}
            <Link
              href="/"
              className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit Admin
            </Link>
          </SidebarHeader>

          <SidebarSeparator />

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="px-6 pb-6">
            <UserNav
              name={session?.user?.name}
              email={session?.user?.email}
              image={session?.user?.image}
              isAdmin
            />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="min-h-svh">
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 lg:px-8">
              <SidebarTrigger />
              <div className="flex flex-1 items-center gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Administrator Panel</p>
                  <p className="text-base font-semibold leading-tight">System Management</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-10 lg:px-10">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>

          <footer className="border-t bg-background/80 py-6 text-center text-sm text-muted-foreground">
            <p>© 2026 CV Manager — Administrator Panel.</p>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
