'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export default function BootstrapPage() {
  const { user, dbUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Timeout effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Bootstrap timeout reached');
      setTimeoutReached(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const bootstrapUser = async () => {
      console.log('Bootstrap page - Auth loading:', authLoading);
      console.log('Bootstrap page - User:', user);
      console.log('Bootstrap page - DBUser:', dbUser);

      // Wait for auth to finish loading
      if (authLoading && !timeoutReached) {
        console.log('Auth still loading, waiting...');
        return;
      }

      if (!user) {
        console.log('No user found, redirecting to login');
        // If no user, redirect to login
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Give some time for session to establish
        return;
      }

      // Add a small delay to ensure session is fully established
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        setLoading(true);
        console.log('Calling bootstrap API...');

        // Call bootstrap API
        const response = await fetch('/api/bootstrap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        console.log('Bootstrap API response status:', response.status);
        const data = await response.json();
        console.log('Bootstrap API response data:', data);

        if (response.ok && data.success) {
          console.log(
            'Bootstrap successful, redirecting to:',
            data.redirect_url
          );
          // Redirect to role-specific dashboard
          if (data.redirect_url) {
            router.push(data.redirect_url);
            return;
          }
        } else {
          console.error('Bootstrap API failed:', data);
        }

        // If bootstrap fails, try to get user profile to determine redirect
        console.log('Trying to get user profile...');
        const profileResponse = await fetch('/api/bootstrap', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('Profile data:', profileData);
          if (profileData.profile?.role) {
            const role = profileData.profile.role;
            const redirectUrl = getRoleRedirectUrl(role);
            console.log('Redirecting based on profile role:', redirectUrl);
            router.push(redirectUrl);
            return;
          }
        }

        // Fallback to general dashboard
        console.log('Falling back to general dashboard');
        router.push('/dashboard');
      } catch (err) {
        console.error('Bootstrap error:', err);
        setError('Failed to initialize your account. Please try again.');
        toast.error('Failed to initialize your account. Please try again.');

        // Still redirect to dashboard as fallback
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    bootstrapUser();
  }, [user, dbUser, authLoading, timeoutReached, router]);

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
        return '/dashboard';
    }
  };

  if (loading || (authLoading && !timeoutReached)) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Setting up your account...
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we prepare your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mb-6">
            <Icons.x className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Setup Error
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
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
          Redirecting...
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Taking you to your dashboard.
        </p>
      </div>
    </div>
  );
}
