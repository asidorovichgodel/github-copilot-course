import { redirect } from 'next/navigation';

import { requireAdminRole } from '@/lib/server/roleMiddleware';
import { prisma } from '@/lib/server/prisma';
import { UserEditForm } from './_components/UserEditForm';

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>;
}

type UserWithRoles = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Array<{
    roleId: string;
    role: { name: string };
  }>;
};

type Role = {
  id: string;
  name: string;
};

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  await requireAdminRole();

  const { id } = await params;

  const [userResult, rolesResult] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } },
    }),
    prisma.role.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const user = userResult as UserWithRoles | null;
  const roles = rolesResult as Role[];

  if (!user) {
    redirect('/admin/users');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit User</h1>
        <p className="mt-2 text-muted-foreground">Update profile details and role assignments.</p>
      </div>

      <UserEditForm
        userId={user.id}
        defaultValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roleIds: user.roles.map((ur) => ur.roleId),
        }}
        roles={roles}
      />
    </div>
  );
}

