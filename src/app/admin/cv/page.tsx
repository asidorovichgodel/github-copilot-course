'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CandidateSummary {
  id: string;
  fullName: string;
  email: string | null;
  title: string | null;
}

export default function AdminCvUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [candidates, setCandidates] = useState<CandidateSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/candidates');
        if (response.ok) {
          const data = await response.json();
          setCandidates(data.data || []);
        }
      } catch (loadError) {
        console.error('Failed to load candidates:', loadError);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, []);

  const handleUpload = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError('Select a PDF file before uploading.');
      return;
    }

    if (!selectedCandidateId) {
      setError('Select a candidate to upload the CV for.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetUserId', selectedCandidateId);

      const response = await fetch('/api/cv', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Upload failed. Please try again.');
      }

      setStatusMessage('CV successfully uploaded and candidate profile updated!');
      setFile(null);
      setSelectedCandidateId('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => {
        router.push('/admin/candidates');
      }, 1500);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'Unexpected error';
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload CV for Candidate</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a PDF CV and assign it to a candidate. Extracted data will overwrite their current profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload CV</CardTitle>
          <CardDescription>
            Select a candidate and upload their PDF CV. The system will extract contact and skill information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleUpload}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="candidate-select">
                Select Candidate
              </label>
              <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                <SelectTrigger id="candidate-select">
                  <SelectValue placeholder={isLoading ? 'Loading candidates...' : 'Select a candidate'} />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.fullName}{c.email ? ` (${c.email})` : ''}{c.title ? ` — ${c.title}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="cv-file">
                Upload PDF (Max 5MB)
              </label>
              <div className="relative cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center transition-colors hover:border-muted-foreground/50">
                <input
                  ref={fileInputRef}
                  id="cv-file"
                  accept=".pdf"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  type="file"
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {file ? file.name : 'Click to select PDF or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground">PDF format only</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {statusMessage && (
              <div className="rounded-lg bg-green-100 p-3 text-sm text-green-900">
                {statusMessage}
              </div>
            )}

            <Button className="w-full" disabled={isUploading} type="submit">
              {isUploading ? 'Uploading...' : 'Upload CV'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
