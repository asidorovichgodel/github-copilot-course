/**
 * Candidate Repository
 * Data access layer for candidates extracted from CVs.
 * Candidates are not system users - they are entities holding CV profile data.
 */

import { prisma } from '@/lib/server/prisma';
import type { LlmCandidateProfile, LlmExperience } from '@/_services/LlmService';

export interface CandidateCvFile {
  id: string;
  /** Original file name shown to users (real name from browser upload) */
  originalFileName: string;
  /** Technical file name stored on disk */
  storedFileName: string;
  filePath: string;
  isLatest: boolean;
  uploadedAt: Date;
  uploadedBy: string | null;
}

export interface CandidateWithExperiences {
  id: string;
  fullName: string;
  email: string | null;
  title: string | null;
  location: string | null;
  summary: string | null;
  technologies: string[];
  certifications: string[];
  skills: string[];
  userId: string | null;
  /** Full history of uploaded CV files; sorted by uploadedAt descending */
  cvFiles: CandidateCvFile[];
  createdAt: Date;
  updatedAt: Date;
  experiences: ExperienceRecord[];
}

export interface ExperienceRecord {
  id: string;
  company: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

const CANDIDATE_INCLUDE = {
  experiences: true,
  cvFiles: { orderBy: { uploadedAt: 'desc' as const } },
} as const;

export class CandidateRepository {
  async findByEmail(email: string): Promise<CandidateWithExperiences | null> {
    const candidate = await prisma.candidate.findUnique({
      where: { email },
      include: CANDIDATE_INCLUDE,
    });

    return candidate as CandidateWithExperiences | null;
  }

  async findByUserId(userId: string): Promise<CandidateWithExperiences | null> {
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      include: CANDIDATE_INCLUDE,
    });

    return candidate as CandidateWithExperiences | null;
  }

  async findById(id: string): Promise<CandidateWithExperiences | null> {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: CANDIDATE_INCLUDE,
    });

    return candidate as CandidateWithExperiences | null;
  }

  /** Create a new candidate with experiences and store the first CV file record */
  async createFromProfile(
    profile: LlmCandidateProfile,
    originalFileName: string,
    storedFileName: string,
    filePath: string,
    uploadedBy: string | null,
    userId?: string,
  ): Promise<CandidateWithExperiences> {
    const candidate = await prisma.candidate.create({
      data: {
        fullName: profile.fullName,
        email: profile.email || undefined,
        title: profile.title || undefined,
        location: profile.location || undefined,
        summary: profile.summary || undefined,
        technologies: profile.technologies,
        certifications: profile.certifications,
        skills: profile.skills,
        userId: userId || undefined,
        cvFiles: {
          create: {
            originalFileName,
            storedFileName,
            filePath,
            isLatest: true,
            uploadedBy: uploadedBy || undefined,
          },
        },
        experiences: {
          create: profile.experiences.map((e: LlmExperience) => ({
            company: e.company,
            title: e.title,
            startDate: e.startDate || undefined,
            endDate: e.endDate || undefined,
            description: e.description || undefined,
          })),
        },
      },
      include: CANDIDATE_INCLUDE,
    });

    return candidate as CandidateWithExperiences;
  }

  /**
   * Update an existing candidate's profile and append a new CV file to history.
   * The previous latest CV is marked as no longer latest.
   */
  async updateFromProfile(
    candidateId: string,
    profile: LlmCandidateProfile,
    originalFileName: string,
    storedFileName: string,
    filePath: string,
    uploadedBy: string | null,
  ): Promise<CandidateWithExperiences> {
    const candidate = await prisma.$transaction(async (tx) => {
      // Mark all existing CVs as no longer the latest
      await tx.candidateCv.updateMany({
        where: { candidateId, isLatest: true },
        data: { isLatest: false },
      });

      // Delete old experiences and recreate from fresh LLM extraction
      await tx.experience.deleteMany({ where: { candidateId } });

      return tx.candidate.update({
        where: { id: candidateId },
        data: {
          fullName: profile.fullName,
          email: profile.email || undefined,
          title: profile.title || undefined,
          location: profile.location || undefined,
          summary: profile.summary || undefined,
          technologies: profile.technologies,
          certifications: profile.certifications,
          skills: profile.skills,
          cvFiles: {
            create: {
              originalFileName,
              storedFileName,
              filePath,
              isLatest: true,
              uploadedBy: uploadedBy || undefined,
            },
          },
          experiences: {
            create: profile.experiences.map((e: LlmExperience) => ({
              company: e.company,
              title: e.title,
              startDate: e.startDate || undefined,
              endDate: e.endDate || undefined,
              description: e.description || undefined,
            })),
          },
        },
        include: CANDIDATE_INCLUDE,
      });
    });

    return candidate as CandidateWithExperiences;
  }

  /** Link a candidate to a system user account */
  async linkToUser(candidateId: string, userId: string): Promise<void> {
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { userId },
    });
  }
}

export const candidateRepository = new CandidateRepository();
