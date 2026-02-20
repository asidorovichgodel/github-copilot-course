/**
 * Quick reference patterns for using Zustand and Zod in this project.
 * Copy and adapt these examples for your form components.
 */

// ============================================================
// PATTERN 1: Simple Form with Zod Validation
// ============================================================

/*
'use client';

import { useState, FormEvent } from 'react';
import { loginSchema, validateFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormErrors {
  [key: string]: string;
}

export const SimpleLoginForm = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = validateFormData(loginSchema, data);

    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (response.ok) {
        // Handle success
      } else {
        setErrors({ form: 'Login failed' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        placeholder="Email"
      />
      {errors.email && <p className="text-red-500">{errors.email}</p>}
      <Button type="submit" disabled={isSubmitting}>Submit</Button>
    </form>
  );
};
*/

// ============================================================
// PATTERN 2: Using Zustand Store for Global State
// ============================================================

/*
'use client';

import { useAppStore } from '@/lib/stores';

export const MyComponent = () => {
  // Use selector to avoid unnecessary re-renders
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
};
*/

// ============================================================
// PATTERN 3: Multi-Field Form Validation
// ============================================================

/*
import { z } from 'zod';

export const createBlogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string(),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag required'),
  published: z.boolean(),
}).refine(
  (data) => /^[a-z0-9-]+$/.test(data.slug),
  { message: 'Slug must only contain lowercase letters, numbers, and hyphens', path: ['slug'] }
);

type BlogPostFormData = z.infer<typeof createBlogPostSchema>;
*/

// ============================================================
// PATTERN 4: Server-Side API Validation
// ============================================================

/*
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userRegistrationSchema, validateFormDataAsync } from '@/lib/schemas';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const validation = await validateFormDataAsync(userRegistrationSchema, body);
  
  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.errors },
      { status: 400 }
    );
  }

  // Process validated data
  return NextResponse.json({ success: true });
}
*/

// ============================================================
// PATTERN 5: Multi-Step Form with Zustand
// ============================================================

/*
'use client';

import { useFormStore } from '@/lib/stores';
import { validateFormData, loginSchema } from '@/lib/schemas';

export const MultiStepForm = () => {
  const { fields, setFieldValue, currentStep, setCurrentStep } = useFormStore();

  const handleStepValidation = () => {
    const result = validateFormData(loginSchema, fields);
    
    if (!result.success) {
      console.log(result.errors);
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  return (
    <button onClick={handleStepValidation}>
      Next Step
    </button>
  );
};
*/

// ============================================================
// PATTERN 6: Async Validation with Zod
// ============================================================

/*
import { z } from 'zod';

export const emailSchema = z.string()
  .email('Invalid email')
  .refine(
    async (email) => {
      const response = await fetch(`/api/check-email?email=${email}`);
      return response.ok;
    },
    'Email already exists'
  );

export const userSchema = z.object({
  email: emailSchema,
  username: z.string(),
});

// Use with parseAsync
const result = await userSchema.parseAsync(data);
*/

// ============================================================
// PATTERN 7: Reusable Field Component with Validation
// ============================================================

/*
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const FormField = ({
  label,
  name,
  value,
  error,
  onChange,
  disabled,
}: FormFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <Input
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={error ? 'border-red-500' : ''}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
*/

// ============================================================
// PATTERN 8: Combining Store + API Calls + Loading State
// ============================================================

/*
'use client';

import { useAppStore } from '@/lib/stores';
import { validateFormData, userProfileSchema } from '@/lib/schemas';

export const ProfileEditor = () => {
  const { isLoading, setIsLoading } = useAppStore();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    setIsLoading(true);

    const result = validateFormData(userProfileSchema, formData);

    if (!result.success) {
      setErrors(result.errors || {});
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        setErrors({ form: 'Failed to save' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleSave} disabled={isLoading}>
      {isLoading ? 'Saving...' : 'Save'}
    </button>
  );
};
*/

export default {};
