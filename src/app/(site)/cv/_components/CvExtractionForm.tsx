'use client';

import { useRef, useState, useTransition, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { uploadCv } from '@/app/_actions/cvActions';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function CvExtractionForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpload = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      toast.error('Select a PDF file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    startTransition(async () => {
      try {
        const result = await uploadCv(formData);

        toast.success(
          result.isNewCandidate
            ? `New candidate "${result.candidate.fullName}" created successfully.`
            : `Candidate "${result.candidate.fullName}" updated successfully.`,
        );

        router.push(`/candidates/${result.candidateId}`);
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : 'Unexpected error occurred.';
        toast.error(message);
      }
    });
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <Badge className="w-fit" variant="secondary">
          CV Extraction
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold">Upload and structure CVs</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Upload a PDF to extract candidate details and create or update candidate profiles using
            AI.
          </p>
        </div>
      </section>

      <section className="max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Upload CV</CardTitle>
            <CardDescription>
              PDF only, max 5 MB. Data is extracted automatically via AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleUpload}>
              <Input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={!file || isPending}>
                  {isPending ? 'Processing…' : 'Upload CV'}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
