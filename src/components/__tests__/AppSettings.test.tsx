import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppSettings } from '../AppSettings';
import { useAppStore } from '@/lib/stores';

// Reset the Zustand store to initial state before each test
beforeEach(() => {
  useAppStore.setState({ isSidebarOpen: true, theme: 'light' });
});

describe('AppSettings', () => {
  describe('Sidebar toggle', () => {
    it('should show "Close" button when sidebar is open', () => {
      // Arrange
      useAppStore.setState({ isSidebarOpen: true });

      // Act
      render(<AppSettings />);

      // Assert
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should show "Open" button when sidebar is closed', () => {
      // Arrange
      useAppStore.setState({ isSidebarOpen: false });

      // Act
      render(<AppSettings />);

      // Assert
      expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument();
    });

    it('should toggle the sidebar when the button is clicked', async () => {
      // Arrange
      useAppStore.setState({ isSidebarOpen: true });
      const user = userEvent.setup();
      render(<AppSettings />);

      // Act
      await user.click(screen.getByRole('button', { name: /close/i }));

      // Assert — sidebar is now closed, so button label should flip
      expect(useAppStore.getState().isSidebarOpen).toBe(false);
      expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument();
    });

    it('should re-open the sidebar on a second click', async () => {
      // Arrange
      useAppStore.setState({ isSidebarOpen: false });
      const user = userEvent.setup();
      render(<AppSettings />);

      // Act
      await user.click(screen.getByRole('button', { name: /open/i }));

      // Assert
      expect(useAppStore.getState().isSidebarOpen).toBe(true);
    });
  });

  describe('Theme selection', () => {
    it('should render both Light and Dark theme buttons', () => {
      // Act
      render(<AppSettings />);

      // Assert
      expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
    });

    it('should set theme to "dark" when the Dark button is clicked', async () => {
      // Arrange
      useAppStore.setState({ theme: 'light' });
      const user = userEvent.setup();
      render(<AppSettings />);

      // Act
      await user.click(screen.getByRole('button', { name: /dark/i }));

      // Assert
      expect(useAppStore.getState().theme).toBe('dark');
    });

    it('should set theme to "light" when the Light button is clicked', async () => {
      // Arrange
      useAppStore.setState({ theme: 'dark' });
      const user = userEvent.setup();
      render(<AppSettings />);

      // Act
      await user.click(screen.getByRole('button', { name: /light/i }));

      // Assert
      expect(useAppStore.getState().theme).toBe('light');
    });
  });

  describe('Static content', () => {
    it('should display the persistence hint text', () => {
      // Act
      render(<AppSettings />);

      // Assert
      expect(screen.getByText(/persisted to localStorage/i)).toBeInTheDocument();
    });
  });
});
