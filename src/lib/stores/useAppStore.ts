import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Global application state for managing app-wide data.
 * Uses Zustand with devtools and persist middleware for:
 * - devtools: Redux DevTools integration for debugging
 * - persist: Automatic localStorage persistence
 */

export interface AppState {
  // UI state
  isLoading: boolean;
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';

  // Actions
  setIsLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  resetAppState: () => void;
}

const initialState = {
  isLoading: false,
  isSidebarOpen: true,
  theme: 'light' as const,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setIsLoading: (loading: boolean) => set({ isLoading: loading }, false, 'setIsLoading'),

        toggleSidebar: () =>
          set((state) => ({ isSidebarOpen: !state.isSidebarOpen }), false, 'toggleSidebar'),

        setTheme: (theme: 'light' | 'dark') => set({ theme }, false, 'setTheme'),

        resetAppState: () => set(initialState, false, 'resetAppState'),
      }),
      {
        name: 'app-store', // localStorage key
        version: 1, // Schema version for migrations
      },
    ),
  ),
);
