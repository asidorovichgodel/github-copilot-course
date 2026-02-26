'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { uploadCv } from '@/app/_actions/cvActions';

export function CvUploadWidget({ userId }: { userId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Select a PDF file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetUserId', userId);

    startTransition(async () => {
      try {
        await uploadCv(formData);

        toast.success('CV uploaded and profile updated successfully.');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Unexpected error');
      }
    });
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

      <Button type="submit" disabled={isPending || !file} className="w-full">
        {isPending ? 'Uploading...' : 'Upload CV'}
      </Button>
    </form>
  );
}
