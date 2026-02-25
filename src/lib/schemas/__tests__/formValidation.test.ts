import { z } from 'zod';
import { validateFormData, validateFormDataAsync } from '../formValidation';

const testSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
});

describe('formValidation', () => {
  describe('validateFormData()', () => {
    it('should return success with parsed data when input is valid', () => {
      // Arrange
      const input = { name: 'John', email: 'john@example.com' };

      // Act
      const result = validateFormData(testSchema, input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(input);
      expect(result.errors).toBeUndefined();
    });

    it('should return errors when input is invalid', () => {
      // Arrange
      const input = { name: 'J', email: 'not-an-email' };

      // Act
      const result = validateFormData(testSchema, input);

      // Assert
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toBeDefined();
      expect(result.errors!['name']).toBe('Name is too short');
      expect(result.errors!['email']).toBe('Invalid email');
    });

    it('should return a generic error for non-Zod errors', () => {
      // Arrange — schema that throws a non-Zod error
      const badSchema = {
        parse: () => {
          throw new Error('Unexpected failure');
        },
      } as unknown as z.ZodType<unknown>;

      // Act
      const result = validateFormData(badSchema, {});

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toEqual({ form: 'An unexpected error occurred' });
    });

    it('should return first error message per field', () => {
      const schema = z.object({
        age: z.number().min(18, 'Too young').max(99, 'Too old'),
      });

      const result = validateFormData(schema, { age: 5 });

      expect(result.success).toBe(false);
      // Should have only the first error message for the field
      expect(typeof result.errors!['age']).toBe('string');
    });
  });

  describe('validateFormDataAsync()', () => {
    it('should return success when async validation passes', async () => {
      // Arrange
      const asyncSchema = z.object({ name: z.string().min(2) }).superRefine(async (data, ctx) => {
        // Simulated async check
        if (data.name === 'forbidden') {
          ctx.addIssue({ code: 'custom', message: 'Name is forbidden', path: ['name'] });
        }
      });

      const input = { name: 'John' };

      // Act
      const result = await validateFormDataAsync(asyncSchema, input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(input);
    });

    it('should return errors when async validation fails', async () => {
      // Arrange
      const asyncSchema = z.object({ name: z.string().min(2, 'Name too short') });
      const input = { name: 'J' };

      // Act
      const result = await validateFormDataAsync(asyncSchema, input);

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors!['name']).toBe('Name too short');
    });

    it('should return a generic error for non-Zod async errors', async () => {
      const badSchema = {
        parseAsync: async () => {
          throw new Error('Unexpected async failure');
        },
      } as unknown as z.ZodType<unknown>;

      const result = await validateFormDataAsync(badSchema, {});

      expect(result.success).toBe(false);
      expect(result.errors).toEqual({ form: 'An unexpected error occurred' });
    });
  });
});
