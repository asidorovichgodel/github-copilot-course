import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  helperText?: string;
  isRequired?: boolean;
}

/**
 * Reusable form field component that wraps Input with label and error message.
 * Used with React Hook Form's register function for clean, DRY form components.
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, isRequired, className, id, ...props }, ref) => {
    const fieldId = id || props.name;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={fieldId}
          {...props}
          className={`
            w-full px-3 py-2 border rounded-md text-sm
            placeholder-gray-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
            ${className || ''}
          `}
        />
        {error && <p className="text-sm text-red-500">{error.message}</p>}
        {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  },
);

FormField.displayName = 'FormField';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for grouping multiple form fields.
 * Provides consistent spacing between form fields.
 */
export const FormGroup: React.FC<FormGroupProps> = ({ children, className }) => (
  <div className={`space-y-4 ${className || ''}`}>{children}</div>
);

interface FormErrorProps {
  message?: string;
  className?: string;
}

/**
 * Root-level form error display component.
 * Used for general form submission errors or non-field-specific errors.
 */
export const FormError: React.FC<FormErrorProps> = ({ message, className }) => {
  if (!message) return null;
  return (
    <div
      className={`p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 ${className || ''}`}
      role="alert"
    >
      {message}
    </div>
  );
};
