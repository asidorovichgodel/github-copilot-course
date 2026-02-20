'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data: usersData, isLoading, error } = useUsers(page, 10);
  const deleteMutation = useDeleteUser();

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <Badge className="w-fit" variant="secondary">
          User Management
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold">Users</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            View and manage users in the system. Delete users or view their details.
          </p>
        </div>
      </section>

      <section>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-sm text-destructive">Failed to load users</p>
              </div>
            ) : usersData?.data?.items && usersData.data.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {usersData.data.items.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              aria-label={`View ${user.name} details`}
                            >
                              <Link href={`/users/${user.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteMutation.isPending}
                              aria-label={`Delete ${user.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No users found</p>
              </div>
            )}

            {usersData?.data && (
              <div className="flex items-center justify-between border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Page {usersData.data.page} of {usersData.data.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= usersData.data.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
