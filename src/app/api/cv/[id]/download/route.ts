/**
 * API Route: GET /api/cv/[id]/download
 * Streams a stored CV PDF file to the client for download.
 * The [id] is the CandidateCv record id.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';

import { prisma } from '@/lib/server/prisma';
import { requireAuth } from '@/lib/server/roleMiddleware';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  // Only authenticated users may download CV files
  await requireAuth();

  const { id } = await params;

  const cvFile = await prisma.candidateCv.findUnique({ where: { id } });

  if (!cvFile) {
    return NextResponse.json({ error: 'CV file not found' }, { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(cvFile.filePath);

    // Use the original (user-visible) file name for the download prompt, sanitised for HTTP headers
    const safeDownloadName = cvFile.originalFileName.replace(/[^\w\s.-]/g, '_');

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeDownloadName}"`,
        'Content-Length': String(fileBuffer.length),
      },
    });
  } catch {
    // File exists in DB but is missing on disk
    return NextResponse.json({ error: 'File not available on disk' }, { status: 404 });
  }
}