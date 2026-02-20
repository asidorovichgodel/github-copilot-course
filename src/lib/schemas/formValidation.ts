/**
 * Form validation utilities for working with Zod schemas.
 * Provides helper functions to prevent repetitive error handling.
 */

import { ZodType, ZodError } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Validates data against a Zod schema.
 * Returns structured result with data or formatted errors.
 */
export const validateFormData = <T>(
  schema: ZodType<any>,
  data: unknown,
): ValidationResult<T> => {
  try {
    const result = schema.parse(data);
    return {
      success: true,
      data: result as T,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.flatten().fieldErrors;
      const formattedErrors: Record<string, string> = {};

      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          formattedErrors[field] = messages[0]; // Use first error message
        }
      });

      return {
        success: false,
        errors: formattedErrors,
      };
    }

    return {
      success: false,
      errors: { form: 'An unexpected error occurred' },
    };
  }
};

/**
 * Validates data asynchronously against a Zod schema.
 * Useful for schemas with async refinements.
 */
export const validateFormDataAsync = async <T>(
  schema: ZodType<any>,
  data: unknown,
): Promise<ValidationResult<T>> => {
  try {
    const result = await schema.parseAsync(data);
    return {
      success: true,
      data: result as T,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.flatten().fieldErrors;
      const formattedErrors: Record<string, string> = {};

      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          formattedErrors[field] = messages[0];
        }
      });

      return {
        success: false,
        errors: formattedErrors,
      };
    }

    return {
      success: false,
      errors: { form: 'An unexpected error occurred' },
    };
  }
};
