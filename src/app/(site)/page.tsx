import Link from 'next/link';
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  MapPin,
  Trophy,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAuth } from '@/lib/server/roleMiddleware';
import { prisma } from '@/lib/server/prisma';

export const metadata = {
  title: 'Overview',
};

/** Aggregate candidate statistics for the dashboard. */
async function getCandidateStats() {
  const [
    totalCandidates,
    candidatesWithLocation,
    candidatesWithEmail,
    recentCandidates,
    allCandidates,
  ] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.count({ where: { location: { not: null } } }),
    prisma.candidate.count({ where: { email: { not: null } } }),
    prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, fullName: true, title: true, createdAt: true, skills: true },
    }),
    prisma.candidate.findMany({
      select: {
        skills: true,
        technologies: true,
        certifications: true,
        experiences: { select: { company: true } },
      },
    }),
  ]);

  // Count top skills across all candidates
  const skillFrequency: Record<string, number> = {};
  for (const c of allCandidates) {
    for (const skill of c.skills) {
      skillFrequency[skill] = (skillFrequency[skill] ?? 0) + 1;
    }
  }
  const topSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([skill, count]) => ({ skill, count }));

  // Count top technologies
  const techFrequency: Record<string, number> = {};
  for (const c of allCandidates) {
    for (const tech of c.technologies) {
      techFrequency[tech] = (techFrequency[tech] ?? 0) + 1;
    }
  }
  const topTechnologies = Object.entries(techFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tech, count]) => ({ tech, count }));

  // Count unique companies from experiences
  const companySet = new Set<string>();
  for (const c of allCandidates) {
    for (const exp of c.experiences) {
      if (exp.company) companySet.add(exp.company);
    }
  }

  // Total certifications
  const totalCertifications = allCandidates.reduce(
    (sum: number, c: { certifications: string[] }) => sum + c.certifications.length,
    0,
  );

  return {
    totalCandidates,
    candidatesWithLocation,
    candidatesWithEmail,
    recentCandidates,
    topSkills,
    topTechnologies,
    uniqueCompanies: companySet.size,
    totalCertifications,
  };
}

export default async function OverviewPage() {
  await requireAuth();

  const stats = await getCandidateStats();

  const statCards = [
    {
      label: 'Total Candidates',
      value: stats.totalCandidates,
      icon: Users,
      description: 'Profiles extracted from CVs',
    },
    {
      label: 'With Location',
      value: stats.candidatesWithLocation,
      icon: MapPin,
      description: `${stats.totalCandidates > 0 ? Math.round((stats.candidatesWithLocation / stats.totalCandidates) * 100) : 0}% of candidates`,
    },
    {
      label: 'With Contact',
      value: stats.candidatesWithEmail,
      icon: UserCheck,
      description: 'Have an email address',
    },
    {
      label: 'Unique Companies',
      value: stats.uniqueCompanies,
      icon: Briefcase,
      description: 'From work experience entries',
    },
    {
      label: 'Certifications',
      value: stats.totalCertifications,
      icon: Trophy,
      description: 'Across all candidates',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="mt-1 text-muted-foreground">Candidate pipeline at a glance.</p>
        </div>
        <Button asChild>
          <Link href="/candidates">
            View all candidates
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon, description }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent candidates */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Recent Candidates
            </CardTitle>
            <CardDescription>Latest profiles added to the pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentCandidates.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No candidates yet. Upload a CV to get started.
              </p>
            ) : (
              <ul className="divide-y">
                {stats.recentCandidates.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{c.fullName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {c.title ?? 'No title'}
                      </p>
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-3">
                      <div className="hidden gap-1 sm:flex">
                        {c.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/candidates/${c.id}`}>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Top skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Top Skills
            </CardTitle>
            <CardDescription>Most common across all candidates</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topSkills.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No skill data available yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {stats.topSkills.map(({ skill, count }) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    {skill}
                    <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {count}
                    </span>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top technologies */}
      {stats.topTechnologies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Technologies</CardTitle>
            <CardDescription>Most frequently listed technologies across candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {stats.topTechnologies.map(({ tech, count }) => (
                <div
                  key={tech}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <span className="truncate text-sm font-medium">{tech}</span>
                  <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
