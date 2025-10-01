'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import {
  SessionProvider,
  useSession,
  signOut as nextAuthSignOut,
} from 'next-auth/react';
import { User } from '@supabase/supabase-js';
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
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      setLoading(true);

      if (!session?.user) {
        setUser(null);
        setDbUser(null);
        setLoading(false);
        return;
      }

      const baseUser = session.user as any;
      const id = baseUser.id as string | undefined;

      if (!id) {
        setLoading(false);
        return;
      }

      setUser({
        id,
        email: baseUser.email,
        app_metadata: {},
        user_metadata: baseUser,
        aud: 'authenticated',
        created_at: baseUser.created_at || new Date().toISOString(),
        identities: [],
        phone: baseUser.phone || null,
        last_sign_in_at: baseUser.last_sign_in_at || new Date().toISOString(),
        role: baseUser.role,
      } as unknown as User);

      const appUser = (session as any)?.appUser as DbUser | null;

      if (appUser) {
        setDbUser({
          ...appUser,
          email: appUser.email || baseUser.email,
          fullName: appUser.fullName || baseUser.name || baseUser.email,
          role: appUser.role || baseUser.role || 'student',
        } as DbUser);
        setLoading(false);
        return;
      }

      setDbUser({
        id,
        email: baseUser.email,
        fullName: baseUser.name || baseUser.email,
        role: baseUser.role || 'student',
        createdAt: new Date(baseUser.created_at || Date.now()),
        updatedAt: new Date(),
      } as any);
      setLoading(false);
    };

    hydrateUser();
  }, [session]);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    }
  }, [status]);

  const signOut = async () => {
    try {
      setLoading(true);
      await nextAuthSignOut({ callbackUrl: '/login' });
      setUser(null);
      setDbUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setLoading(false);
    }
  };

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
    <SessionProvider>
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
    </SessionProvider>
  );
}
