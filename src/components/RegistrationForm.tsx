'use client';

import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { toast } from 'sonner';
import { userRegistrationSchema, type UserRegistrationFormData } from '@/lib/schemas';
import { validateFormData } from '@/lib/schemas/formValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Example registration form using Zod for validation.
 * Demonstrates multi-field validation including password confirmation.
 * Uses Zod's refine method to validate password match across fields.
 */

interface FormErrors {
  [key: string]: string;
}

export const RegistrationForm = () => {
  const [formData, setFormData] = useState<Partial<UserRegistrationFormData>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<UserRegistrationFormData>) => ({ ...prev, [name]: value }));

    // Clear field error when user corrects it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate with Zod schema (includes password match check)
    const validation = validateFormData<UserRegistrationFormData>(
      userRegistrationSchema,
      formData,
    );

    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Replace with your actual registration API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      if (response.ok) {
        toast.success('Registration successful! Redirecting to login...');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'John',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Doe',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'you@example.com',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: '••••••••',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
      {formFields.map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label htmlFor={name} className='block text-sm font-medium mb-1'>
            {label}
          </label>
          <Input
            id={name}
            name={name}
            type={type}
            value={formData[name as keyof typeof formData] || ''}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder={placeholder}
            className={errors[name] ? 'border-red-500' : ''}
          />
          {errors[name] && <p className='text-red-500 text-sm mt-1'>{errors[name]}</p>}
        </div>
      ))}

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};
