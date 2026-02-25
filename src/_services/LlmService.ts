/**
 * LLM Service
 * Sends extracted CV text to OpenAI and returns structured candidate data.
 * Requires OPENAI_API_KEY in environment variables.
 */

import OpenAI from 'openai';
import { AppError } from '@/lib';

export interface LlmCandidateProfile {
  fullName: string;
  email: string | null;
  title: string | null;
  location: string | null;
  summary: string | null;
  technologies: string[];
  certifications: string[];
  skills: string[];
  experiences: LlmExperience[];
}

export interface LlmExperience {
  company: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

const SYSTEM_PROMPT = `You are a CV data extraction assistant.
Given raw text from a CV / resume, extract and return ONLY valid JSON matching this schema:
{
  "fullName": string,
  "email": string | null,
  "title": string | null,
  "location": string | null,
  "summary": string | null,
  "technologies": string[],
  "certifications": string[],
  "skills": string[],
  "experiences": [
    {
      "company": string,
      "title": string,
      "startDate": string | null,
      "endDate": string | null,
      "description": string | null
    }
  ]
}
Return ONLY the JSON object, no markdown, no explanation.`;

export class LlmService {
  private _client: OpenAI | null = null;

  /** Lazily initialise the OpenAI client so missing env vars only fail at call-time */
  private get client(): OpenAI {
    if (!this._client) {
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        throw AppError.internal('OPENAI_API_KEY environment variable is not set');
      }

      this._client = new OpenAI({ apiKey });
    }

    return this._client;
  }

  async extractCandidateProfile(cvText: string): Promise<LlmCandidateProfile> {
    // Limit input to avoid exceeding context window
    const truncatedText = cvText.slice(0, 12_000);

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: truncatedText },
      ],
      temperature: 0,
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content;

    if (!raw) {
      throw AppError.externalApi('LLM returned an empty response');
    }

    try {
      const parsed = JSON.parse(raw) as LlmCandidateProfile;
      return this.normaliseProfile(parsed);
    } catch {
      throw AppError.externalApi('LLM returned invalid JSON');
    }
  }

  /** Ensure arrays are always arrays and strings are trimmed */
  private normaliseProfile(raw: LlmCandidateProfile): LlmCandidateProfile {
    return {
      fullName: (raw.fullName ?? 'Unknown').trim(),
      email: raw.email?.trim() || null,
      title: raw.title?.trim() || null,
      location: raw.location?.trim() || null,
      summary: raw.summary?.trim() || null,
      technologies: Array.isArray(raw.technologies) ? raw.technologies : [],
      certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
      skills: Array.isArray(raw.skills) ? raw.skills : [],
      experiences: Array.isArray(raw.experiences)
        ? raw.experiences.map((e) => ({
            company: e.company?.trim() ?? '',
            title: e.title?.trim() ?? '',
            startDate: e.startDate?.trim() || null,
            endDate: e.endDate?.trim() || null,
            description: e.description?.trim() || null,
          }))
        : [],
    };
  }
}

export const llmService = new LlmService();
