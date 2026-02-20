'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegistrationSchema, type UserRegistrationFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { FormField, FormGroup, FormError } from '@/components/ui/form-field';

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: UserRegistrationFormData) => {
    try {
      // TODO: Replace with your actual registration API call
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        // TODO: Handle successful registration (redirect, show success message, etc.)
      } else {
        setError('root', {
          message: 'Registration failed. Please try again.',
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
        {formFields.map(({ name, label, type, placeholder }) => (
          <FormField
            key={name}
            {...register(name)}
            label={label}
            type={type}
            disabled={isSubmitting}
            placeholder={placeholder}
            error={errors[name]}
            isRequired
          />
        ))}
      </FormGroup>

      <FormError message={errors.root?.message} className='mt-4' />

      <Button type='submit' className='w-full mt-6' disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};
