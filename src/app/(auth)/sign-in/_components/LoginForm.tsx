'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/ui/form-field';

/**
 * Login form component using React Hook Form with Zod validation.
 * Demonstrates modern form handling in Next.js:
 * - Use React Hook Form for form state management
 * - Zod resolver for validation
 * - Reusable FormField components for consistent styling
 * - Minimal re-renders and clean code
 */

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
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
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });

      if (result?.error) {
        setError('root', {
          message: 'Login failed. Please try again.',
        });
        return;
      }

      reset();
      router.replace(callbackUrl);
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
      <div className='grid gap-2'>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          placeholder='name@example.com'
          autoComplete='email'
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email?.message ? (
          <p className='text-xs text-destructive'>{errors.email.message}</p>
        ) : null}
      </div>

      <div className='grid gap-2'>
        <div className='flex items-center'>
          <label htmlFor='password' className='text-sm font-medium'>
            Password
          </label>
          <Link href='/forgot-password' className='ml-auto text-sm underline underline-offset-4'>
            Forgot your password?
          </Link>
        </div>
        <Input
          id='password'
          type='password'
          placeholder='••••••••'
          autoComplete='current-password'
          disabled={isSubmitting}
          {...register('password')}
        />
        {errors.password?.message ? (
          <p className='text-xs text-destructive'>{errors.password.message}</p>
        ) : null}
      </div>

      <FormError message={errors.root?.message} />

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};
