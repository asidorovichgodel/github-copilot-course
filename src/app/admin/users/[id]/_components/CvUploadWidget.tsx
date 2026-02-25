'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function CvUploadWidget({ userId }: { userId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Select a PDF file before uploading.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetUserId', userId);

      const response = await fetch('/api/cv', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Upload failed. Please try again.');
      }

      setSuccess('CV uploaded and profile updated successfully.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-8 text-center transition-colors hover:border-muted-foreground/50">
        <input
          ref={fileInputRef}
          id={`cv-upload-${userId}`}
          accept=".pdf"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <p className="text-sm font-medium">
          {file ? file.name : 'Click to select PDF or drag and drop'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">PDF format only, max 5 MB</p>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-100 p-3 text-sm text-green-900">{success}</p>
      )}

      <Button type="submit" disabled={isUploading || !file} className="w-full">
        {isUploading ? 'Uploading...' : 'Upload CV'}
      </Button>
    </form>
  );
}
