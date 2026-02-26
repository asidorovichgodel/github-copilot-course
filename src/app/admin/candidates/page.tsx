import Link from 'next/link';
import { Eye, MapPin, Mail } from 'lucide-react';

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

export const metadata = {
  title: 'Candidates | Admin',
};

export default async function AdminCandidatesPage() {
  await requireAdminRole();

  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: 'desc' },
    include: { experiences: false },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Candidates</h1>
        <p className="mt-2 text-muted-foreground">All candidates extracted from uploaded CVs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>
            {candidates.length === 1
              ? '1 candidate in the system'
              : `${candidates.length} candidates in the system`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {candidate.title ?? '—'}
                    </TableCell>
                    <TableCell>
                      {candidate.email ? (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {candidate.email}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {candidate.location ? (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {candidate.location}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/candidates/${candidate.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {candidates.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No candidates found. Upload a CV to extract a candidate profile.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
