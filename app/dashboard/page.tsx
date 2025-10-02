'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase/client';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      console.log('Dashboard page - Checking session...');

      try {
        // Get current session directly from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log('Session check result:', { session, error });

        if (error) {
          console.error('Session error:', error);
          router.push('/login');
          return;
        }

        if (!session?.user) {
          console.log('No session found, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('User found:', session.user.email);
        console.log('User metadata:', session.user.user_metadata);

        // Get role from user metadata
        const userRole = session.user.user_metadata?.role || 'student';
        console.log('User role:', userRole);

        setRedirecting(true);

        // Determine redirect URL based on role
        const redirectUrl = getRoleRedirectUrl(userRole);
        console.log('Redirecting to:', redirectUrl);

        // Small delay to show loading state
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      } catch (error) {
        console.error('Dashboard redirect error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [router]);

  const getRoleRedirectUrl = (role: string): string => {
    switch (role) {
      case 'student':
        return '/dashboard/student';
      case 'recruiter':
        return '/dashboard/recruiter';
      case 'faculty':
        return '/dashboard/faculty';
      case 'institution_admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/student'; // Default to student dashboard
    }
  };

  if (loading || redirecting) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {redirecting ? 'Redirecting to your dashboard...' : 'Loading...'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we set up your experience.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
            <Icons.x className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Not Authenticated
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please sign in to access your dashboard.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
          <Icons.spinner className="h-8 w-8 animate-spin text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Setting up your dashboard...
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          This should only take a moment.
        </p>
      </div>
    </div>
  );
}
