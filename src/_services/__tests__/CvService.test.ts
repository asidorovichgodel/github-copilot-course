import { CvService } from '../CvService';
import { AppError } from '@/lib/errors';

// Mock file system operations
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

// Mock PdfParserService
jest.mock('../PdfParserService', () => ({
  pdfParserService: {
    extractText: jest.fn(),
  },
}));

// Mock LlmService
jest.mock('../LlmService', () => ({
  llmService: {
    extractCandidateProfile: jest.fn(),
  },
}));

// Mock repositories
jest.mock('@/_repositories', () => ({
  candidateRepository: {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByUserId: jest.fn(),
    createFromProfile: jest.fn(),
    updateFromProfile: jest.fn(),
  },
  userRepository: {
    findById: jest.fn(),
  },
}));

import { pdfParserService } from '../PdfParserService';
import { llmService } from '../LlmService';
import { candidateRepository, userRepository } from '@/_repositories';

const mockPdfParser = pdfParserService as jest.Mocked<typeof pdfParserService>;
const mockLlmService = llmService as jest.Mocked<typeof llmService>;
const mockCandidateRepository = candidateRepository as jest.Mocked<typeof candidateRepository>;
const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;

const mockProfile = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  phone: '+1234567890',
  experiences: [],
};

const mockCandidate = {
  id: 'cand-1',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  experiences: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CvService', () => {
  let cvService: CvService;

  beforeEach(() => {
    jest.clearAllMocks();
    cvService = new CvService();
  });

  describe('validateUpload()', () => {
    it('should not throw for a valid PDF under size limit', () => {
      expect(() =>
        cvService.validateUpload('application/pdf', 1 * 1024 * 1024),
      ).not.toThrow();
    });

    it('should throw VALIDATION_ERROR when file type is not PDF', () => {
      expect(() =>
        cvService.validateUpload('image/jpeg', 1 * 1024 * 1024),
      ).toThrow(AppError);

      expect(() =>
        cvService.validateUpload('image/jpeg', 1 * 1024 * 1024),
      ).toThrow('Only PDF files are allowed');
    });

    it('should throw VALIDATION_ERROR when file size exceeds 5MB', () => {
      const sixMb = 6 * 1024 * 1024;

      expect(() =>
        cvService.validateUpload('application/pdf', sixMb),
      ).toThrow(AppError);

      expect(() =>
        cvService.validateUpload('application/pdf', sixMb),
      ).toThrow('File exceeds the 5MB limit');
    });

    it('should accept a file exactly at the 5MB limit', () => {
      const fiveMb = 5 * 1024 * 1024;

      expect(() =>
        cvService.validateUpload('application/pdf', fiveMb),
      ).not.toThrow();
    });
  });

  describe('processUpload()', () => {
    const fileBuffer = Buffer.from('fake-pdf-content');

    it('should create a new candidate when no existing candidate is found', async () => {
      // Arrange
      mockPdfParser.extractText.mockResolvedValue('CV text content');
      mockLlmService.extractCandidateProfile.mockResolvedValue(mockProfile);
      mockCandidateRepository.findById.mockResolvedValue(null);
      mockCandidateRepository.findByEmail.mockResolvedValue(null);
      mockCandidateRepository.findByUserId.mockResolvedValue(null);
      mockCandidateRepository.createFromProfile.mockResolvedValue(mockCandidate);

      // Act
      const result = await cvService.processUpload(fileBuffer, 'jane_cv.pdf', 'user-1');

      // Assert
      expect(result.isNewCandidate).toBe(true);
      expect(result.candidateId).toBe('cand-1');
      expect(mockCandidateRepository.createFromProfile).toHaveBeenCalled();
      expect(mockCandidateRepository.updateFromProfile).not.toHaveBeenCalled();
    });

    it('should update an existing candidate when found by email', async () => {
      // Arrange
      mockPdfParser.extractText.mockResolvedValue('CV text content');
      mockLlmService.extractCandidateProfile.mockResolvedValue(mockProfile);
      mockCandidateRepository.findById.mockResolvedValue(null);
      mockCandidateRepository.findByEmail.mockResolvedValue(mockCandidate);
      mockCandidateRepository.updateFromProfile.mockResolvedValue(mockCandidate);

      // Act
      const result = await cvService.processUpload(fileBuffer, 'jane_cv.pdf', 'user-1');

      // Assert
      expect(result.isNewCandidate).toBe(false);
      expect(mockCandidateRepository.updateFromProfile).toHaveBeenCalled();
      expect(mockCandidateRepository.createFromProfile).not.toHaveBeenCalled();
    });

    it('should throw VALIDATION_ERROR when PDF yields no text', async () => {
      // Arrange
      mockPdfParser.extractText.mockResolvedValue('   ');

      // Act & Assert
      await expect(
        cvService.processUpload(fileBuffer, 'blank.pdf', 'user-1'),
      ).rejects.toMatchObject({
        code: 'VALIDATION_ERROR',
        message: expect.stringContaining('Could not extract text'),
      });
    });

    it('should throw NOT_FOUND when targetUserId does not exist in the database', async () => {
      // Arrange
      mockPdfParser.extractText.mockResolvedValue('CV text content');
      mockLlmService.extractCandidateProfile.mockResolvedValue(mockProfile);
      mockCandidateRepository.findById.mockResolvedValue(null);
      mockCandidateRepository.findByEmail.mockResolvedValue(null);
      mockCandidateRepository.findByUserId.mockResolvedValue(null);
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        cvService.processUpload(fileBuffer, 'cv.pdf', 'uploader-1', 'nonexistent-user'),
      ).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Target user not found',
      });
    });

    it('should look up existing candidate by candidateId when provided', async () => {
      // Arrange
      mockPdfParser.extractText.mockResolvedValue('CV text content');
      mockLlmService.extractCandidateProfile.mockResolvedValue(mockProfile);
      mockCandidateRepository.findById.mockResolvedValue(mockCandidate);
      mockCandidateRepository.updateFromProfile.mockResolvedValue(mockCandidate);

      // Act
      const result = await cvService.processUpload(
        fileBuffer,
        'cv.pdf',
        'user-1',
        undefined,
        'cand-1',
      );

      // Assert
      expect(result.isNewCandidate).toBe(false);
      expect(mockCandidateRepository.findById).toHaveBeenCalledWith('cand-1');
    });
  });
});
