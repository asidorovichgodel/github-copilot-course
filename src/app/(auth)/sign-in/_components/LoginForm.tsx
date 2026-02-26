'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema, type LoginFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Login form component using React Hook Form with Zod validation.
 *
 * WHY THIS DOES NOT USE A SERVER ACTION:
 * Sign-in is handled by `signIn('credentials', ...)` from next-auth/react, which
 * drives the full NextAuth session handshake internally:
 *   1. Fetches a CSRF token from /api/auth/csrf
 *   2. POSTs credentials to /api/auth/callback/credentials
 *   3. NextAuth calls the `authorize()` callback in lib/auth.ts
 *   4. On success, NextAuth sets the httpOnly session cookie from the server
 *
 * A server action cannot set the NextAuth session cookie or drive that CSRF +
 * callback flow — only the [...nextauth] route handler can. Therefore the client
 * must call `signIn()` directly, keeping this as a Client Component.
 *
 * Contrast with registration (sign-up/_actions.ts): registration only creates a
 * DB record with no session involved, so it can be a plain server action.
 */

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
        toast.error('Login failed. Please check your credentials and try again.');
        return;
      }

      reset();
      router.replace(callbackUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email?.message ? (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Link href="/forgot-password" className="ml-auto text-sm underline underline-offset-4">
            Forgot your password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isSubmitting}
          {...register('password')}
        />
        {errors.password?.message ? (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};
