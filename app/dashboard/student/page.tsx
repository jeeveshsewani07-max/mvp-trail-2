'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

interface StudentProfile {
  profile: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  role_data: {
    student_id: string;
    institution_id?: string;
    roll_number?: string;
    batch?: string;
    course?: string;
    current_year?: number;
    current_semester?: number;
    skills?: string[];
    interests?: string[];
    languages?: string[];
    is_profile_complete?: boolean;
  };
}

export default function StudentDashboard() {
  const { user, dbUser } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // Try to get profile from API
        const response = await fetch('/api/bootstrap');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('Failed to fetch profile, using basic profile');
          // Create a basic profile from user data
          const basicProfile = {
            profile: {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email || 'User',
              email: user.email || '',
              role: user.user_metadata?.role || 'student',
              created_at: user.created_at,
              updated_at: new Date().toISOString(),
            },
            role_data: {
              student_id: user.id,
              is_profile_complete: false,
            },
          };
          setProfile(basicProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Create a basic profile from user data
        const basicProfile = {
          profile: {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email || 'User',
            email: user.email || '',
            role: user.user_metadata?.role || 'student',
            created_at: user.created_at,
            updated_at: new Date().toISOString(),
          },
          role_data: {
            student_id: user.id,
            is_profile_complete: false,
          },
        };
        setProfile(basicProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to your Student Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete your profile to get started
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const { profile: userProfile, role_data } = profile;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile.full_name}!
          </h1>
          <p className="text-blue-100">
            Track your achievements, discover opportunities, and build your
            digital portfolio.
          </p>
        </div>

        {/* Profile Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="h-5 w-5" />
              Profile Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profile Completion</span>
                <Badge
                  variant={
                    role_data.is_profile_complete ? 'default' : 'secondary'
                  }
                >
                  {role_data.is_profile_complete ? 'Complete' : 'Incomplete'}
                </Badge>
              </div>

              {role_data.roll_number && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Roll Number:</span>
                    <p className="font-medium">{role_data.roll_number}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Batch:</span>
                    <p className="font-medium">{role_data.batch}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Course:</span>
                    <p className="font-medium">{role_data.course}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Year:</span>
                    <p className="font-medium">Year {role_data.current_year}</p>
                  </div>
                </div>
              )}

              {!role_data.is_profile_complete && (
                <Button className="w-full">
                  <Icons.edit className="mr-2 h-4 w-4" />
                  Complete Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.trophy className="h-5 w-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>
                View and manage your achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Achievements
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.briefcase className="h-5 w-5 text-green-500" />
                Opportunities
              </CardTitle>
              <CardDescription>Discover jobs and internships</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Browse Jobs
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.fileText className="h-5 w-5 text-blue-500" />
                Portfolio
              </CardTitle>
              <CardDescription>Build your digital portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Portfolio
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest achievements and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Icons.activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">
                Start by completing your profile or adding achievements
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
