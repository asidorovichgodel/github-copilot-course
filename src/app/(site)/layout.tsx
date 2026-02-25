import Link from 'next/link';
import {
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Settings,
  UserSearch,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { isAdmin } from '@/lib/server/roleMiddleware';
import { UserNav } from './_components/UserNav';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const getNavItems = (userIsAdmin: boolean): NavItem[] => [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/candidates', label: 'Candidates', icon: UserSearch },
  ...(userIsAdmin ? [{ href: '/cv', label: 'CV Extraction', icon: FileText }] : []),
  { href: '/profile', label: 'My Profile', icon: Users },
];

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/roles', label: 'Role Management', icon: Settings },
];

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const userIsAdmin = isAdmin(session?.user?.roles);
  const navItems = getNavItems(userIsAdmin);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_-10%,hsl(var(--muted))_0%,transparent_55%)]" />
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-11 w-11 items-center justify-center rounded-2xl">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-sidebar-foreground/60">Platform</p>
                <p className="text-lg font-semibold">CV Manager</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarSeparator />

          <SidebarContent>
            {/* Main navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
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

            {/* Administration — full section, only visible to admins */}
            {userIsAdmin && (
              <>
                <SidebarSeparator />
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
              </>
            )}
          </SidebarContent>

          <SidebarFooter className="px-6 pb-6">
            <UserNav
              name={session?.user?.name}
              email={session?.user?.email}
              image={session?.user?.image}
              isAdmin={userIsAdmin}
            />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="min-h-svh">
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 lg:px-8">
              <SidebarTrigger />
              <div className="flex flex-1 items-center">
                <div>
                  <p className="text-sm text-muted-foreground">CV Manager</p>
                  <p className="text-base font-semibold leading-tight">Candidate pipeline</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-10 lg:px-10">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>

          <footer className="border-t bg-background/80 py-6 text-center text-sm text-muted-foreground">
            <p>© 2026 CV Manager.</p>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
