'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';
import { Icons } from '@/components/icons';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen gradient-bg flex items-center justify-center"
        suppressHydrationWarning
      >
        <div className="text-center">
          <Icons.spinner className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    /*
     * FIXED LAYOUT STRUCTURE:
     * - Use flex instead of fixed positioning to eliminate white gaps
     * - Sidebar takes fixed width (w-64) on large screens, hidden on mobile
     * - Main content flexes to fill remaining space
     * - No manual padding calculations needed - flex handles it automatically
     */
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width on large screens, overlay on mobile */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col">
        <Sidebar
          open={true} // Always open on large screens
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Mobile Sidebar - Only shows when open */}
      <aside className="lg:hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content area - Flexes to fill remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {/*
         * TOP NAVIGATION:
         * - Sticky header that spans the full width of main content
         * - No manual left padding needed - flex layout handles positioning
         */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <TopNav onMenuClick={() => setSidebarOpen(true)} />
        </header>

        {/*
         * PAGE CONTENT:
         * - Flexible main content that expands to fill available space
         * - Proper padding and max-width for content readability
         * - No pt-16 needed since header is now in flow
         */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
