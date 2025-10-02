'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { User, type AuthError } from '@supabase/supabase-js';
import type { User as DbUser } from '@/types';

// Auth Context
interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getInitialSession = async () => {
      try {
        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);

          // Create a basic user profile from auth data
          const basicProfile = {
            id: session.user.id,
            email: session.user.email || '',
            fullName:
              session.user.user_metadata?.full_name || session.user.email || '',
            role: session.user.user_metadata?.role || 'student',
            createdAt: new Date(session.user.created_at),
            updatedAt: new Date(session.user.created_at),
          };

          setDbUser(basicProfile as any);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (session?.user) {
        setUser(session.user);

        // Create a basic user profile from auth data
        const basicProfile = {
          id: session.user.id,
          email: session.user.email || '',
          fullName:
            session.user.user_metadata?.full_name || session.user.email || '',
          role: session.user.user_metadata?.role || 'student',
          createdAt: new Date(session.user.created_at),
          updatedAt: new Date(session.user.created_at),
        };

        setDbUser(basicProfile as any);
      } else {
        setUser(null);
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setDbUser(null);
      setLoading(false);

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{ user: null, dbUser: null, loading: true, signOut }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (
          error?.status >= 400 &&
          error?.status < 500 &&
          ![408, 429].includes(error.status)
        ) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
