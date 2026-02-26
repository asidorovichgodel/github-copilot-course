import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock next-auth to avoid ESM / provider setup issues in Jest
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { QueryProvider } from '../QueryProvider';

describe('QueryProvider', () => {
  it('should render its children', () => {
    // Arrange & Act
    render(
      <QueryProvider>
        <span data-testid="child">Hello</span>
      </QueryProvider>,
    );

    // Assert
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    // Arrange & Act
    render(
      <QueryProvider>
        <span data-testid="child-1">First</span>
        <span data-testid="child-2">Second</span>
      </QueryProvider>,
    );

    // Assert
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
