/**
 * CV Service
 * Orchestrates the full PDF upload flow:
 *   1. Save file locally
 *   2. Parse text with pdfjs-dist
 *   3. Extract structured data with LLM (OpenAI)
 *   4. Upsert Candidate (and Experiences) in the DB
 */

import path from 'path';
import fs from 'fs/promises';

import { AppError, FILE_UPLOAD } from '@/lib';
import { candidateRepository, userRepository } from '@/_repositories';
import { pdfParserService } from './PdfParserService';
import { llmService } from './LlmService';
import type { CandidateWithExperiences } from '@/_repositories/CandidateRepository';

export interface CvProcessingResult {
  candidateId: string;
  fileName: string;
  isNewCandidate: boolean;
  candidate: CandidateWithExperiences;
}

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export class CvService {
  /**
   * Full upload flow:
   * save → parse PDF → call LLM → upsert candidate in DB
   *
   * @param fileBuffer       Raw PDF bytes
   * @param originalFileName Original file name from the browser
   * @param uploadedBy       ID of the logged-in user who triggered the upload (optional)
   * @param targetUserId     When the CV should be linked to an existing system user
   */
  async processUpload(
    fileBuffer: Buffer,
    originalFileName: string,
    uploadedBy?: string | null,
    targetUserId?: string,
    candidateId?: string,
  ): Promise<CvProcessingResult> {
    await this.ensureUploadDir();

    // 1. Persist the file locally
    const fileId = this.generateCvId();
    const safeFileName = this.sanitizeFileName(originalFileName || 'cv.pdf');
    const storedFileName = `${fileId}_${safeFileName}`;
    const filePath = path.join(UPLOAD_DIR, storedFileName);

    await fs.writeFile(filePath, fileBuffer);

    // 2. Extract raw text from the PDF
    const rawText = await pdfParserService.extractText(fileBuffer);

    if (!rawText.trim()) {
      throw AppError.validation(
        'Could not extract text from the PDF. The file may be scanned or image-based.',
      );
    }

    // 3. Send text to LLM and receive structured profile
    const profile = await llmService.extractCandidateProfile(rawText);

    // 4. Resolve candidate: look up by candidateId, email, or by linked user
    let existingCandidate = candidateId
      ? await candidateRepository.findById(candidateId)
      : null;

    if (!existingCandidate && profile.email) {
      existingCandidate = await candidateRepository.findByEmail(profile.email);
    }

    if (!existingCandidate && targetUserId) {
      existingCandidate = await candidateRepository.findByUserId(targetUserId);
    }

    // Verify the targetUserId actually exists in the users table
    if (targetUserId) {
      const user = await userRepository.findById(targetUserId);

      if (!user) {
        throw AppError.notFound('Target user not found');
      }
    }

    // 5. Upsert candidate
    let candidate: CandidateWithExperiences;
    let isNewCandidate: boolean;

    if (existingCandidate) {
      candidate = await candidateRepository.updateFromProfile(
        existingCandidate.id,
        profile,
        originalFileName,
        storedFileName,
        filePath,
        uploadedBy ?? null,
      );
      isNewCandidate = false;
    } else {
      candidate = await candidateRepository.createFromProfile(
        profile,
        originalFileName,
        storedFileName,
        filePath,
        uploadedBy ?? null,
        targetUserId,
      );
      isNewCandidate = true;
    }

    return { candidateId: candidate.id, fileName: storedFileName, isNewCandidate, candidate };
  }

  validateUpload(fileType: string, fileSize: number) {
    const allowedTypes = FILE_UPLOAD.ALLOWED_MIME_TYPES as readonly string[];

    if (!allowedTypes.includes(fileType)) {
      throw AppError.validation('Only PDF files are allowed');
    }

    if (fileSize > FILE_UPLOAD.MAX_SIZE_BYTES) {
      throw AppError.validation('File exceeds the 5MB limit');
    }
  }

  private async ensureUploadDir() {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }

  private generateCvId() {
    return `cv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private sanitizeFileName(fileName: string) {
    const baseName = path.basename(fileName);
    const sanitized = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
    return sanitized || 'cv.pdf';
  }
}

export const cvService = new CvService();
