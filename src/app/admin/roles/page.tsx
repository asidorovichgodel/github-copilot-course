import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppError, validateString } from '@/lib';
import { requireAdminRole } from '@/lib/server/roleMiddleware';
import { prisma } from '@/lib/server/prisma';

const PROTECTED_ROLES = new Set(['admin', 'user']);

type RoleWithUsers = {
  id: string;
  name: string;
  users: Array<{
    userId: string;
    roleId: string;
  }>;
};

const createRole = async (formData: FormData) => {
  'use server';

  await requireAdminRole();

  const nameValue = formData.get('name');

  if (typeof nameValue !== 'string') {
    throw AppError.validation('Role name is required');
  }

  const name = validateString(nameValue, 'Role name', 2, 50).toLowerCase();

  const existingRole = await prisma.role.findUnique({
    where: { name },
  });

  if (existingRole) {
    throw AppError.conflict('Role already exists');
  }

  await prisma.role.create({
    data: { name },
  });

  revalidatePath('/admin/roles');
  redirect('/admin/roles');
};

const deleteRole = async (formData: FormData) => {
  'use server';

  await requireAdminRole();

  const roleId = formData.get('roleId');
  const roleName = formData.get('roleName');

  if (typeof roleId !== 'string' || typeof roleName !== 'string') {
    throw AppError.validation('Role ID is required');
  }

  if (PROTECTED_ROLES.has(roleName)) {
    throw AppError.validation('Protected roles cannot be deleted');
  }

  await prisma.role.delete({
    where: { id: roleId },
  });

  revalidatePath('/admin/roles');
  redirect('/admin/roles');
};

export default async function RoleManagementPage() {
  await requireAdminRole();

  const roles = (await prisma.role.findMany({
    include: {
      users: true,
    },
    orderBy: {
      name: 'asc',
    },
  })) as RoleWithUsers[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="mt-2 text-muted-foreground">
            Create, edit, and manage system roles and permissions.
          </p>
        </div>
        <form action={createRole} className="flex flex-wrap items-center gap-2">
          <input
            name="name"
            className="h-10 w-56 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="New role name"
            required
          />
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Roles</CardTitle>
          <CardDescription>Total of {roles.length} roles in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Users Assigned</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{role.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{role.users.length}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {role.name === 'admin'
                        ? 'Administrator with full system access'
                        : role.name === 'user'
                          ? 'Regular user with basic access'
                          : 'Custom role'}
                    </TableCell>
                    <TableCell className="text-right">
                      {PROTECTED_ROLES.has(role.name) ? (
                        <span className="text-xs text-muted-foreground">Protected</span>
                      ) : (
                        <form action={deleteRole}>
                          <input type="hidden" name="roleId" value={role.id} />
                          <input type="hidden" name="roleName" value={role.name} />
                          <Button
                            className="text-destructive hover:text-destructive"
                            size="sm"
                            type="submit"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {roles.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">No roles found.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Roles</CardTitle>
          <CardDescription>Understanding the role system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Admin:</strong> Full access to all system features and management tools
            </li>
            <li>
              <strong>User:</strong> Regular user access with ability to view own profile and upload CV
            </li>
            <li>
              <strong>Custom Roles:</strong> Additional roles can be created for specific use cases
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
