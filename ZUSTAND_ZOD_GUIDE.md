# Zustand & Zod Integration Guide

This guide explains how to use **Zustand** for state management and **Zod** for schema validation in this Next.js project, following best practices.

## Table of Contents

- [Overview](#overview)
- [Zustand Setup](#zustand-setup)
- [Zod Setup](#zod-setup)
- [Common Patterns](#common-patterns)
- [API Best Practices](#api-best-practices)
- [Examples](#examples)

## Overview

### Zustand
A lightweight state management library that makes creating stores simple and predictable.

**When to use:**
- Global application state (UI settings, theme, etc.)
- Complex multi-step forms
- Shared state between distant components
- State that persists across page navigation

**When NOT to use:**
- Simple local component state (use `useState`)
- API data (use React Query instead)
- Props that can be drilled down

### Zod
A TypeScript-first schema validation library for runtime type checking.

**When to use:**
- Form input validation
- API request/response validation
- Runtime type checking for external data
- Complex validation logic

## Zustand Setup

### Architecture

Stores are located in `src/lib/stores/` following the project structure:

```
src/lib/stores/
├── useAppStore.ts       # Global app UI state
├── useFormStore.ts      # Form state management
└── index.ts            # Re-exports
```

### Creating a Store

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  // State
  isLoading: boolean;

  // Actions
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        isLoading: false,

        setIsLoading: (loading) =>
          set({ isLoading: loading }, false, 'setIsLoading'),
      }),
      {
        name: 'app-store', // localStorage key
      },
    ),
  ),
);
```

### Using a Store in Components

```typescript
'use client';

import { useAppStore } from '@/lib/stores';

export const MyComponent = () => {
  // Selector pattern prevents unnecessary re-renders
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  return (
    <button onClick={() => setIsLoading(!isLoading)}>
      {isLoading ? 'Loading...' : 'Click me'}
    </button>
  );
};
```

### Middleware

- **devtools**: Connect to Redux DevTools for debugging
- **persist**: Automatically save/restore state from localStorage

## Zod Setup

### Architecture

Schemas are located in `src/lib/schemas/`:

```
src/lib/schemas/
├── userSchemas.ts       # User-related validation schemas
├── formValidation.ts    # Helper utilities
└── index.ts            # Re-exports
```

### Common Validation Patterns

**Basic schema:**
```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+'),
  name: z.string().min(2, 'Name too short'),
});

// Infer TypeScript type from schema
type User = z.infer<typeof userSchema>;
```

**Complex validation:**
```typescript
const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'One uppercase letter')
  .regex(/[0-9]/, 'One number');

// Cross-field validation
const registrationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
```

**Async validation:**
```typescript
const userSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      async (email) => {
        const exists = await checkEmailExists(email);
        return !exists;
      },
      'Email already registered',
    ),
});

// Parse with parseAsync
const result = await userSchema.parseAsync(data);
```

### Validation Helper

Use the provided validation utility:

```typescript
import { validateFormData } from '@/lib/schemas';

const result = validateFormData(loginSchema, formData);

if (result.success) {
  console.log(result.data); // Fully typed data
} else {
  console.log(result.errors); // Field errors
}
```

## Common Patterns

### Pattern 1: Simple Form with Local State + Zod

**Best for:** Simple forms (login, contact forms)

```typescript
'use client';

import { useState } from 'react';
import { loginSchema, validateFormData } from '@/lib/schemas';

export const LoginForm = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateFormData(loginSchema, data);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    // Process validated data
    console.log(result.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      {errors.email && <span>{errors.email}</span>}
    </form>
  );
};
```

### Pattern 2: Multi-Step Form with Zustand + Zod

**Best for:** Complex multi-step forms

```typescript
'use client';

import { useFormStore } from '@/lib/stores';
import { validateFormData, loginSchema } from '@/lib/schemas';

export const MultiStepForm = () => {
  const { fields, setFieldValue, currentStep, setCurrentStep } = useFormStore();

  const handleNext = () => {
    const result = validateFormData(loginSchema, fields);
    if (!result.success) {
      console.log(result.errors);
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  return (
    <button onClick={handleNext}>
      Next Step
    </button>
  );
};
```

### Pattern 3: API Validation

**Best for:** Validating API requests and responses

```typescript
// src/app/api/users/route.ts
import { userRegistrationSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    // Validate request body
    const data = userRegistrationSchema.parse(body);

    // Process validated data
    return Response.json({ success: true, data });
  } catch (error) {
    // Return validation errors
    return Response.json(
      { errors: formatZodErrors(error) },
      { status: 400 },
    );
  }
}
```

## API Best Practices

### Server-Side Validation

Always validate on the server, even if you validate on the client:

```typescript
// src/app/api/users/route.ts
'use server';

import { userProfileSchema } from '@/lib/schemas';

export async function updateUser(data: unknown) {
  try {
    // Validate on server
    const validated = userProfileSchema.parse(data);
    
    // Save to database
    return await db.users.update(validated);
  } catch (error) {
    // Handle validation errors
    return { error: 'Validation failed' };
  }
}
```

### Combined Store + API Pattern

```typescript
'use client';

export const UserForm = () => {
  const { fields } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(fields),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors(result.errors || {});
        return;
      }

      // Success
      showNotification('Saved successfully');
    } catch (error) {
      setErrors({ form: 'An error occurred' });
    }
  };

  return (
    <button onClick={handleSave}>
      Save
    </button>
  );
};
```

## Examples

### Example 1: Login Form
See [`src/components/LoginForm.tsx`](../src/components/LoginForm.tsx)

- Client-side validation with Zod
- Error handling and display
- Async form submission

### Example 2: Registration Form
See [`src/components/RegistrationForm.tsx`](../src/components/RegistrationForm.tsx)

- Multi-field validation
- Cross-field validation (password confirmation)
- Complex validation rules

### Example 3: App Settings with Store
See [`src/components/AppSettings.tsx`](../src/components/AppSettings.tsx)

- Global state with Zustand
- Persistent state with localStorage
- Multiple selector pattern

### Example 4: Multi-Step Form
See [`src/components/MultiStepFormExample.tsx`](../src/components/MultiStepFormExample.tsx)

- Zustand + Zod combined
- Step navigation
- Global form state across components

## Debugging

### Zustand DevTools

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
2. Open DevTools and go to Redux tab
3. See all state changes and time-travel debug

### Zod Validation Errors

```typescript
import { ZodError } from 'zod';

try {
  userSchema.parse(data);
} catch (error) {
  if (error instanceof ZodError) {
    console.log(error.flatten()); // Structured error format
  }
}
```

## Performance Optimization

### 1. Use Selectors to Prevent Re-renders

```typescript
// ❌ Bad: Re-renders on any store change
const state = useAppStore();

// ✅ Good: Re-renders only when isLoading changes
const isLoading = useAppStore((state) => state.isLoading);
```

### 2. Memoize Selectors

```typescript
// ❌ Bad: New selector each render
useAppStore((state) => ({ loading: state.isLoading, theme: state.theme }));

// ✅ Good: Memoize selectors
const { isLoading, theme } = useAppStore((state) => ({
  isLoading: state.isLoading,
  theme: state.theme,
}));
```

### 3. Lazy Validation

For large forms, validate only changed fields:

```typescript
const handleFieldChange = async (field: string, value: unknown) => {
  const fieldSchema = z.object({ [field]: schema.shape[field] });
  const result = fieldSchema.safeParse({ [field]: value });
  
  if (!result.success) {
    setErrors({ [field]: result.error.errors[0].message });
  }
};
```

## Resources

- [Zustand Documentation](https://zustand-demo.vercel.app/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Best Practices](https://nextjs.org/docs/getting-started/react-essentials)
- [Form Design Patterns](https://www.smashingmagazine.com/)
