import Link from 'next/link';
import { Edit2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { requireAdminRole } from '@/lib/server/roleMiddleware';
import { prisma } from '@/lib/server/prisma';

type UserWithRoles = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  roles: Array<{
    roleId: string;
    role: { name: string };
  }>;
};

export default async function UserManagementPage() {
  await requireAdminRole();

  const users = (await prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })) as UserWithRoles[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="mt-2 text-muted-foreground">View, edit, and manage all system users.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total of {users.length} users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {user.roles.length === 0 ? (
                          <Badge variant="outline">No Role</Badge>
                        ) : (
                          user.roles.map((userRole) => (
                            <Badge key={userRole.roleId} variant="secondary">
                              {userRole.role.name}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/users/${user.id}`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {users.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">No users found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
