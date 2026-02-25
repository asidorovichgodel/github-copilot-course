'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { userRegistrationSchema, type UserRegistrationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerUser } from '../_actions';

/**
 * Registration form component using React Hook Form with Zod validation.
 * Demonstrates modern form handling with multi-field validation:
 * - React Hook Form for form state management
 * - Zod resolver for schema validation (includes password match check)
 * - Reusable FormField components for consistent styling and behavior
 * - Automatic form submission handling
 */

const formFields = [
  {
    name: 'firstName' as const,
    label: 'First Name',
    type: 'text' as const,
    placeholder: 'John',
  },
  {
    name: 'lastName' as const,
    label: 'Last Name',
    type: 'text' as const,
    placeholder: 'Doe',
  },
  {
    name: 'email' as const,
    label: 'Email',
    type: 'email' as const,
    placeholder: 'you@example.com',
  },
  {
    name: 'password' as const,
    label: 'Password',
    type: 'password' as const,
    placeholder: '••••••••',
  },
  {
    name: 'confirmPassword' as const,
    label: 'Confirm Password',
    type: 'password' as const,
    placeholder: '••••••••',
  },
];

export const RegistrationForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: UserRegistrationFormData) => {
    try {
      const result = await registerUser(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Account created successfully!');
      reset();
      router.replace('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
      {formFields.map(({ name, label, type, placeholder }) => (
        <div key={name} className='grid gap-2'>
          <label htmlFor={name} className='text-sm font-medium'>
            {label}
          </label>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            autoComplete={name === 'password' ? 'new-password' : name}
            disabled={isSubmitting}
            {...register(name)}
          />
          {errors[name]?.message ? (
            <p className='text-xs text-destructive'>{errors[name]?.message}</p>
          ) : null}
        </div>
      ))}

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>

      <p className='text-balance text-center text-xs text-muted-foreground'>
        By creating an account, you agree to our{' '}
        <span className='underline underline-offset-4'>Terms of Service</span> and{' '}
        <span className='underline underline-offset-4'>Privacy Policy</span>.
      </p>
    </form>
  );
};
