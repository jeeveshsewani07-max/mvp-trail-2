'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { StudentOnboarding } from '@/components/onboarding/student-onboarding';
import { FacultyOnboarding } from '@/components/onboarding/faculty-onboarding';
import { RecruiterOnboarding } from '@/components/onboarding/recruiter-onboarding';
import { InstitutionOnboarding } from '@/components/onboarding/institution-onboarding';
import { RoleSelection } from '@/components/onboarding/role-selection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const { user, dbUser, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Check if this is a Google user that needs onboarding
    // For now, we'll assume users coming to onboarding need database setup
    // This can be refined later based on actual session structure

    // Prefer role from URL if present, otherwise use dbUser role, or default to student for Google users
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setSelectedRole(roleParam);
      return;
    }

    if (dbUser?.role) {
      setSelectedRole(dbUser.role);
    } else if (isGoogleUser) {
      setSelectedRole('student'); // Default for Google users
    }
  }, [user, dbUser, loading, router, searchParams]);

  const handleRoleSelect = async (role: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Persist role in auth metadata (does not require app DB tables)
      const { error } = await supabase.auth.updateUser({
        data: {
          role,
        },
      });

      if (error) {
        console.error('Auth metadata update failed:', error.message);
        // Continue anyway so the user can proceed to onboarding
      }

      setSelectedRole(role);
      toast.success('Role selected! Please complete your profile.');
    } catch (error: any) {
      toast.error('Failed to save role: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // For Google users, we need to create the user record in Supabase
      // The Google profile data is in the session, not user object
      if (selectedRole) {
        // Create user in Supabase
        const { error } = await supabase.from('users').insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.name || user.email!.split('@')[0],
          role: selectedRole,
          is_email_verified: true,
        });

        if (error) {
          console.error('Failed to create user:', error);
          // Continue anyway - user can still use the app
        }
      }

      toast.success('Welcome to Smart Student Hub!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast.success('Welcome to Smart Student Hub!');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen gradient-bg p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 pt-12">
            <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Icons.graduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Smart Student Hub!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Let's set up your account
            </p>
          </div>

          <RoleSelection
            onRoleSelect={handleRoleSelect}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <Icons.graduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Help us personalize your experience
          </p>
          {/* Allow changing role if the wrong form is shown */}
          <div className="mt-3">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setSelectedRole('')}
            >
              Not your role? Change role
            </button>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedRole === 'student' && (
                <Icons.graduationCap className="h-5 w-5" />
              )}
              {selectedRole === 'faculty' && <Icons.user className="h-5 w-5" />}
              {selectedRole === 'recruiter' && (
                <Icons.briefcase className="h-5 w-5" />
              )}
              {selectedRole === 'institution_admin' && (
                <Icons.building className="h-5 w-5" />
              )}
              {selectedRole === 'student' && 'Student Profile'}
              {selectedRole === 'faculty' && 'Faculty Profile'}
              {selectedRole === 'recruiter' && 'Recruiter Profile'}
              {selectedRole === 'institution_admin' && 'Institution Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRole === 'student' && (
              <StudentOnboarding
                user={user}
                onComplete={handleOnboardingComplete}
              />
            )}
            {selectedRole === 'faculty' && (
              <FacultyOnboarding
                user={user}
                onComplete={handleOnboardingComplete}
              />
            )}
            {selectedRole === 'recruiter' && (
              <RecruiterOnboarding
                user={user}
                onComplete={handleOnboardingComplete}
              />
            )}
            {selectedRole === 'institution_admin' && (
              <InstitutionOnboarding
                user={user}
                onComplete={handleOnboardingComplete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
