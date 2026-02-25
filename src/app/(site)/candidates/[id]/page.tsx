import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Mail, Award, Cpu, Wrench, FileText, Download } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { requireAuth, isAdmin } from '@/lib/server/roleMiddleware';
import { prisma } from '@/lib/server/prisma';
import { CandidateCvUpload } from './_components/CandidateCvUpload';

interface CandidatePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CandidatePageProps) {
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({ where: { id } });

  return {
    title: candidate ? `${candidate.fullName} – Candidate Profile` : 'Candidate Not Found',
  };
}

export default async function CandidateDetailsPage({ params }: CandidatePageProps) {
  const session = await requireAuth();
  const userIsAdmin = isAdmin(session.user?.roles);
  const { id } = await params;

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      experiences: { orderBy: { startDate: 'desc' } },
      cvFiles: { orderBy: { uploadedAt: 'desc' } },
    },
  });

  if (!candidate) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <Badge className="w-fit" variant="secondary">
          Candidate Profile
        </Badge>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/candidates">
              <ArrowLeft className="mr-1 h-4 w-4" />
              All Candidates
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-4xl font-semibold">{candidate.fullName}</h1>
          {candidate.title ? (
            <p className="mt-1 text-xl text-muted-foreground">{candidate.title}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {candidate.email ? (
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {candidate.email}
            </span>
          ) : null}
          {candidate.location ? (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {candidate.location}
            </span>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary + Experience */}
        <div className="lg:col-span-2 space-y-6">
          {candidate.summary ? (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{candidate.summary}</p>
              </CardContent>
            </Card>
          ) : null}

          {candidate.experiences.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.experiences.map((exp, idx) => (
                  <div key={exp.id}>
                    {idx > 0 ? <Separator className="mb-6" /> : null}
                    <div className="space-y-1">
                      <p className="font-semibold">{exp.title}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      {exp.startDate || exp.endDate ? (
                        <p className="text-xs text-muted-foreground">
                          {exp.startDate ?? '?'} – {exp.endDate ?? 'Present'}
                        </p>
                      ) : null}
                      {exp.description ? (
                        <p className="mt-2 text-sm leading-relaxed">{exp.description}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Sidebar: skills, technologies, certifications, CVs */}
        <div className="space-y-6">
          {candidate.skills.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {candidate.technologies.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {candidate.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {candidate.certifications.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {candidate.certifications.map((cert) => (
                  <p key={cert} className="text-sm">
                    {cert}
                  </p>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {candidate.cvFiles.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5" />
                  CV History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidate.cvFiles.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-start justify-between gap-2 rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{cv.originalFileName}</p>
                        {cv.isLatest ? (
                          <Badge variant="default" className="shrink-0 text-xs">
                            Latest
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cv.uploadedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="shrink-0">
                      <a href={`/api/cv/${cv.id}/download`} download={cv.originalFileName}>
                        <Download className="mr-1 h-3.5 w-3.5" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {userIsAdmin ? (
            <CandidateCvUpload
              candidateId={candidate.id}
              candidateName={candidate.fullName}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
