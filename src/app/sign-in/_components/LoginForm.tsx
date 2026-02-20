'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { FormField, FormGroup, FormError } from '@/components/ui/form-field';

/**
 * Login form component using React Hook Form with Zod validation.
 * Demonstrates modern form handling in Next.js:
 * - Use React Hook Form for form state management
 * - Zod resolver for validation
 * - Reusable FormField components for consistent styling
 * - Minimal re-renders and clean code
 */

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Replace with your actual login API call
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        // TODO: Handle successful login (redirect, etc.)
      } else {
        setError('root', {
          message: 'Login failed. Please try again.',
        });
      }
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-md'>
      <FormGroup>
        <FormField
          {...register('email')}
          label='Email'
          type='email'
          disabled={isSubmitting}
          placeholder='you@example.com'
          error={errors.email}
          isRequired
        />

        <FormField
          {...register('password')}
          label='Password'
          type='password'
          disabled={isSubmitting}
          placeholder='••••••••'
          error={errors.password}
          isRequired
        />
      </FormGroup>

      <FormError message={errors.root?.message} className='mt-4' />

      <Button type='submit' className='w-full mt-6' disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
};
