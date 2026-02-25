import Link from 'next/link';
import { BarChart3, FileText, Settings, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAdminRole } from '@/lib/server/roleMiddleware';
import { prisma } from '@/lib/server/prisma';

export default async function AdminDashboard() {
  await requireAdminRole();

  const totalUsers = await prisma.user.count();
  const totalRoles = await prisma.role.count();
  const totalCVs = await prisma.candidateCv.count();

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      description: 'Active users in the system',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Roles',
      value: totalRoles,
      description: 'System roles',
      href: '/admin/roles',
      icon: Settings,
    },
    {
      title: 'CV Uploads',
      value: totalCVs,
      description: 'Total CVs on file',
      href: '/admin/cv',
      icon: FileText,
    },
    {
      title: 'System Health',
      value: 'OK',
      description: 'All systems operational',
      href: '#',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to the administrator panel. Manage users, roles, and system resources.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-shadow hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <stat.icon className="h-4 w-4 text-destructive" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-2 text-xs text-muted-foreground">{stat.description}</p>
              {stat.href !== '#' && (
                <Button asChild className="mt-4 w-full text-xs" size="sm" variant="ghost">
                  <Link href={stat.href}>View Details</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/roles">Manage Roles</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/cv">Upload CV for User</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Application details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Environment: </span>
              <span className="font-medium">{process.env.NODE_ENV}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Database: </span>
              <span className="font-medium">PostgreSQL</span>
            </div>
            <div>
              <span className="text-muted-foreground">Version: </span>
              <span className="font-medium">1.0.0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
