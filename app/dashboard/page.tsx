'use client';

import { useAuth } from '@/components/providers';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { FacultyDashboard } from '@/components/dashboard/faculty-dashboard';
import { RecruiterDashboard } from '@/components/dashboard/recruiter-dashboard';
import { InstitutionDashboard } from '@/components/dashboard/institution-dashboard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Icons } from '@/components/icons';

export default function DashboardPage() {
  const { dbUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Icons.alertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to sign in to access your dashboard.
          </p>
          <div className="space-y-3">
            <a 
              href="/login" 
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Icons.user className="mr-2 h-4 w-4" />
              Sign In
            </a>
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center w-full px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  const getDashboardComponent = () => {
    switch (dbUser?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'recruiter':
        return <RecruiterDashboard />;
      case 'institution_admin':
        return <InstitutionDashboard />;
      default:
        return (
          <div className="text-center">
            <Icons.alertCircle className="h-8 w-8 mx-auto mb-4 text-amber-500" />
            <p className="text-muted-foreground">Invalid user role</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {getDashboardComponent()}
    </DashboardLayout>
  );
}


