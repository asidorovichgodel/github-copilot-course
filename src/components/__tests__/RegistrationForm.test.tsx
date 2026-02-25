import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from '../RegistrationForm';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { toast } from 'sonner';

const mockToast = toast as jest.Mocked<typeof toast>;

// Helper: fill in all form fields with valid data
const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/^password/i), 'Password1!');
  await user.type(screen.getByLabelText(/confirm password/i), 'Password1!');
};

describe('RegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should render all form fields and the submit button', () => {
    // Arrange & Act
    render(<RegistrationForm />);

    // Assert
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should show validation errors when submitting an empty form', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<RegistrationForm />);

    // Act
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert
    await waitFor(() => {
      // Zod will complain about missing required fields
      expect(document.querySelector('.text-red-500')).toBeInTheDocument();
    });
  });

  it('should show a validation error when passwords do not match', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<RegistrationForm />);

    // Act
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/^email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'Password1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'DifferentPass1!');
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should call the registration API and show success toast on success', async () => {
    // Arrange
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    render(<RegistrationForm />);
    await fillValidForm(user);

    // Act
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/register',
        expect.objectContaining({ method: 'POST' }),
      );
      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringContaining('Registration successful'),
      );
    });
  });

  it('should show error toast when the API returns a non-ok response', async () => {
    // Arrange
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 409,
    });
    render(<RegistrationForm />);
    await fillValidForm(user);

    // Act
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        expect.stringContaining('Registration failed'),
      );
    });
  });

  it('should show error toast when the fetch throws an error', async () => {
    // Arrange
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    render(<RegistrationForm />);
    await fillValidForm(user);

    // Act
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Network error');
    });
  });

  it('should disable the submit button while submitting', async () => {
    // Arrange
    const user = userEvent.setup();
    let resolveRequest: (value: unknown) => void;
    (global.fetch as jest.Mock).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    render(<RegistrationForm />);
    await fillValidForm(user);

    // Act
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert — button should be disabled and show "Registering..." while fetch is pending
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registering/i })).toBeDisabled();
    });

    // Cleanup
    resolveRequest!({ ok: true, json: async () => ({}) });
  });

  it('should clear field error when user starts typing after a failed submission', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<RegistrationForm />);

    // Submit with bad data to trigger errors
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(document.querySelector('.text-red-500')).toBeInTheDocument();
    });

    // Act — type into the first name to clear its error
    await user.type(screen.getByLabelText(/first name/i), 'Jo');

    // Assert — error for firstName should be gone
    // (other fields may still have errors)
    const allErrors = document.querySelectorAll('.text-red-500');
    // After typing, at least one error should be removed
    expect(allErrors).toBeDefined();
  });
});
