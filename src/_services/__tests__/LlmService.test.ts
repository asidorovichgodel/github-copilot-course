jest.mock('openai');

import OpenAI from 'openai';
import { LlmService } from '../LlmService';

const MockOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;
const mockCreate = jest.fn();

describe('LlmService', () => {
  let service: LlmService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-key';

    MockOpenAI.mockImplementation(
      () =>
        ({
          chat: {
            completions: {
              create: mockCreate,
            },
          },
        }) as unknown as OpenAI,
    );

    service = new LlmService();
  });

  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  describe('extractCandidateProfile()', () => {
    it('should throw an AppError when OPENAI_API_KEY is not set', async () => {
      // Arrange
      delete process.env.OPENAI_API_KEY;
      service = new LlmService(); // fresh instance without the key

      // Act & Assert
      await expect(service.extractCandidateProfile('some CV text')).rejects.toMatchObject({
        code: 'INTERNAL_ERROR',
        message: 'OPENAI_API_KEY environment variable is not set',
      });
    });

    it('should call the OpenAI chat completions API with the correct parameters', async () => {
      // Arrange
      const profile = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        title: 'Engineer',
        location: 'London',
        summary: 'A great engineer',
        technologies: ['TypeScript'],
        certifications: [],
        skills: ['Testing'],
        experiences: [],
      };
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(profile) } }],
      });

      // Act
      await service.extractCandidateProfile('CV content');

      // Assert
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o-mini',
          temperature: 0,
          response_format: { type: 'json_object' },
        }),
      );
    });

    it('should truncate input to 12,000 characters before sending to OpenAI', async () => {
      // Arrange
      const longText = 'a'.repeat(15_000);
      const profile = {
        fullName: 'Jane Doe',
        email: null,
        title: null,
        location: null,
        summary: null,
        technologies: [],
        certifications: [],
        skills: [],
        experiences: [],
      };
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(profile) } }],
      });

      // Act
      await service.extractCandidateProfile(longText);

      // Assert
      const userMessage = mockCreate.mock.calls[0][0].messages.find(
        (m: { role: string }) => m.role === 'user',
      );
      expect(userMessage.content).toHaveLength(12_000);
    });

    it('should return a normalised profile on a successful API response', async () => {
      // Arrange
      const raw = {
        fullName: '  Jane Doe  ',
        email: '  jane@example.com  ',
        title: '  Senior Engineer  ',
        location: '  London  ',
        summary: '  Experienced developer  ',
        technologies: ['TypeScript', 'React'],
        certifications: ['AWS'],
        skills: ['Testing'],
        experiences: [
          {
            company: '  Acme  ',
            title: '  Lead Dev  ',
            startDate: '  2020-01  ',
            endDate: null,
            description: '  Did stuff  ',
          },
        ],
      };
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(raw) } }],
      });

      // Act
      const result = await service.extractCandidateProfile('some text');

      // Assert — leading/trailing spaces trimmed
      expect(result.fullName).toBe('Jane Doe');
      expect(result.email).toBe('jane@example.com');
      expect(result.title).toBe('Senior Engineer');
      expect(result.location).toBe('London');
      expect(result.experiences[0].company).toBe('Acme');
      expect(result.experiences[0].startDate).toBe('2020-01');
    });

    it('should throw an AppError when the LLM returns an empty response', async () => {
      // Arrange
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: null } }],
      });

      // Act & Assert
      await expect(service.extractCandidateProfile('some text')).rejects.toMatchObject({
        code: 'EXTERNAL_API_ERROR',
        message: 'LLM returned an empty response',
      });
    });

    it('should throw an AppError when the LLM returns invalid JSON', async () => {
      // Arrange
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'not valid json {{' } }],
      });

      // Act & Assert
      await expect(service.extractCandidateProfile('some text')).rejects.toMatchObject({
        code: 'EXTERNAL_API_ERROR',
        message: 'LLM returned invalid JSON',
      });
    });

    it('should coerce non-array fields to empty arrays in the normalised profile', async () => {
      // Arrange — malformed response where arrays are missing
      const malformed = {
        fullName: 'John Smith',
        email: null,
        title: null,
        location: null,
        summary: null,
        technologies: null,
        certifications: 'AWS, Azure', // wrong type
        skills: undefined,
        experiences: null,
      };
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(malformed) } }],
      });

      // Act
      const result = await service.extractCandidateProfile('some text');

      // Assert — arrays default to []
      expect(result.technologies).toEqual([]);
      expect(result.certifications).toEqual([]);
      expect(result.skills).toEqual([]);
      expect(result.experiences).toEqual([]);
    });

    it('should fall back to "Unknown" when fullName is missing', async () => {
      // Arrange
      const missingName = {
        fullName: null,
        email: null,
        title: null,
        location: null,
        summary: null,
        technologies: [],
        certifications: [],
        skills: [],
        experiences: [],
      };
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(missingName) } }],
      });

      // Act
      const result = await service.extractCandidateProfile('some text');

      // Assert
      expect(result.fullName).toBe('Unknown');
    });

    it('should propagate errors thrown by the OpenAI client', async () => {
      // Arrange
      mockCreate.mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(service.extractCandidateProfile('some text')).rejects.toThrow('Network error');
    });
  });
});
