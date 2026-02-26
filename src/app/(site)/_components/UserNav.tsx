'use client';

import { signOut } from 'next-auth/react';
import { ChevronsUpDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

type UserNavProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  /** When true, shows admin-specific quick-links in the dropdown. */
  isAdmin?: boolean;
};

/** Derives 1-2 letter initials from a display name or email. */
function getInitials(name?: string | null, email?: string | null): string {
  const source = name || email || '';
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function UserNav({ name, email, image, isAdmin = false }: UserNavProps) {
  const { isMobile } = useSidebar();
  const displayName = name || email || 'User';
  const initials = getInitials(name, email);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              // Radix UI generates `id` via useId(); the count can differ between
              // SSR (which includes conditional admin nav items) and the client
              // hydration pass, causing a benign attribute mismatch. Suppressing
              // here is the correct fix — the id is only used for aria-controls.
              suppressHydrationWarning
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {image && <AvatarImage src={image} alt={displayName} />}
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                {email && <span className="truncate text-xs">{email}</span>}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {/* User info header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {image && <AvatarImage src={image} alt={displayName} />}
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  {email && <span className="truncate text-xs">{email}</span>}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Quick navigation */}
            <DropdownMenuItem asChild>
              <Link href="/admin/users">
                <User className="mr-2 size-4" />
                My Profile
              </Link>
            </DropdownMenuItem>

            {/* Admin quick-access — only shown to admins */}
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 size-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Sign out */}
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/sign-in' })}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
