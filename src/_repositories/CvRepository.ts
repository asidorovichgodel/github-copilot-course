/**
 * CV Repository
 * Stores CV extraction records for confirmation workflows
 */

import type { CvConflict, CvExtractedProfile } from '@/lib';

export interface CvExtractionRecord {
  id: string;
  fileName: string;
  filePath: string;
  extracted: CvExtractedProfile;
  conflicts: CvConflict[];
  existingUserId?: string;
  targetUserId?: string;
  createdAt: Date;
}

export class CvRepository {
  private records: Map<string, CvExtractionRecord> = new Map();

  async create(record: Omit<CvExtractionRecord, 'createdAt'>): Promise<CvExtractionRecord> {
    const createdRecord: CvExtractionRecord = {
      ...record,
      createdAt: new Date(),
    };

    this.records.set(createdRecord.id, createdRecord);
    return createdRecord;
  }

  async findById(id: string): Promise<CvExtractionRecord | null> {
    return this.records.get(id) || null;
  }

  async delete(id: string): Promise<void> {
    this.records.delete(id);
  }
}

export const cvRepository = new CvRepository();
