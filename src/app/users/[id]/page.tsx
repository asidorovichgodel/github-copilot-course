'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <Badge className="w-fit" variant="secondary">
          User Details
        </Badge>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/users">
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </div>
        <div>
          <h1 className="text-4xl font-semibold">User Details</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            View and edit user information (coming soon).
          </p>
        </div>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>User ID: {params.id}</CardTitle>
            <CardDescription>
              This is a placeholder page. Add and edit functionality will be implemented later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                User details and edit form will be displayed here
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
