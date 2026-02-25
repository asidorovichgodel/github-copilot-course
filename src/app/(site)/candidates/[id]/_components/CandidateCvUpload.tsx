'use client';

import { useRef, useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CandidateCvUploadProps {
  candidateId: string;
  candidateName: string;
}

export function CandidateCvUpload({ candidateId, candidateName }: CandidateCvUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      toast.error('Select a PDF file before uploading.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('candidateId', candidateId);

      const response = await fetch('/api/cv', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Upload failed. Please try again.');
      }

      toast.success(`CV for "${candidateName}" updated successfully.`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : 'Unexpected error occurred.';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="h-5 w-5" />
          Upload CV
        </CardTitle>
        <CardDescription>
          Replace the candidate&apos;s CV. AI will re-extract and update the profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleUpload}>
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            disabled={isUploading}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="sm" disabled={!file || isUploading}>
              {isUploading ? 'Processing…' : 'Upload & Update'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isUploading}
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}