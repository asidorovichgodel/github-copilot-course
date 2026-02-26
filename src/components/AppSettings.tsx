'use client';

import { useAppStore } from '@/lib/stores';
import { Button } from '@/components/ui/button';

/**
 * Example component demonstrating Zustand store usage.
 * Shows how to access and update global application state.
 *
 * Best practices demonstrated:
 * - Use hooks to access store state
 * - Selector pattern to avoid unnecessary re-renders
 * - Combine multiple store selectors
 * - Keep component logic simple
 */

export const AppSettings = () => {
  // Get individual state values and actions
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);
  const theme = useAppStore((state) => state.theme);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Sidebar</span>
        <Button variant="outline" size="sm" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Close' : 'Open'}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Theme</span>
        <div className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('light')}
          >
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('dark')}
          >
            Dark
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        These settings are persisted to localStorage using Zustand's persist middleware.
      </p>
    </div>
  );
};
