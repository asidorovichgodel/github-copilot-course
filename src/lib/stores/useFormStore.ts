import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Form state management for handling complex multi-step forms.
 * Uses Zustand with devtools middleware for debugging.
 * 
 * Best practices:
 * - Keep form state separate from global state for better isolation
 * - Use this for multi-step forms or forms affecting multiple components
 * - For simple forms, use React Hook Form + Zod validation
 */

export interface FormFields {
  [key: string]: unknown;
}

export interface FormState {
  // Form data
  fields: FormFields;
  currentStep: number;
  errors: Record<string, string>;
  touched: Record<string, boolean>;

  // Actions
  setFieldValue: (field: string, value: unknown) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  setCurrentStep: (step: number) => void;
  setFormData: (data: FormFields) => void;
  resetForm: () => void;
}

const initialState = {
  fields: {},
  currentStep: 0,
  errors: {},
  touched: {},
};

export const useFormStore = create<FormState>()(
  devtools(
    (set) => ({
      ...initialState,

      setFieldValue: (field: string, value: unknown) =>
        set(
          (state) => ({
            fields: { ...state.fields, [field]: value },
          }),
          false,
          'setFieldValue',
        ),

      setFieldError: (field: string, error: string) =>
        set(
          (state) => ({
            errors: { ...state.errors, [field]: error },
          }),
          false,
          'setFieldError',
        ),

      setFieldTouched: (field: string, touched: boolean) =>
        set(
          (state) => ({
            touched: { ...state.touched, [field]: touched },
          }),
          false,
          'setFieldTouched',
        ),

      setCurrentStep: (step: number) =>
        set({ currentStep: step }, false, 'setCurrentStep'),

      setFormData: (data: FormFields) =>
        set({ fields: data }, false, 'setFormData'),

      resetForm: () =>
        set(initialState, false, 'resetForm'),
    }),
    { name: 'form-store' },
  ),
);
