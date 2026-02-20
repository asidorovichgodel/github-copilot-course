import { z } from 'zod';

/**
 * Zod schemas for form validation.
 * Co-located with form components for better organization.
 *
 * Best practices:
 * - Define schemas close to where they're used
 * - Reuse common schemas across forms
 * - Use refinements for complex validation logic
 * - Extract common patterns into helper functions
 */

// Common validation patterns
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters');

// User registration form schema
export const userRegistrationSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;

// User profile update schema
export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
