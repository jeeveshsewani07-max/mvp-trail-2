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

interface RecruiterProfile {
  profile: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  role_data: {
    recruiter_id: string;
    company_name?: string;
    designation?: string;
    company_website?: string;
    industry?: string;
    company_size?: string;
  };
}

export default function RecruiterDashboard() {
  const { user, dbUser } = useAuth();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/bootstrap');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('Failed to fetch profile, using basic profile');
          const basicProfile = {
            profile: {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email || 'User',
              email: user.email || '',
              role: user.user_metadata?.role || 'recruiter',
              created_at: user.created_at,
              updated_at: new Date().toISOString(),
            },
            role_data: {
              recruiter_id: user.id,
            },
          };
          setProfile(basicProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        const basicProfile = {
          profile: {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email || 'User',
            email: user.email || '',
            role: user.user_metadata?.role || 'recruiter',
            created_at: user.created_at,
            updated_at: new Date().toISOString(),
          },
          role_data: {
            recruiter_id: user.id,
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
            Welcome to your Recruiter Dashboard
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
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {userProfile.full_name}!
          </h1>
          <p className="text-green-100">
            Find top talent with verified skills and achievements.
          </p>
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {role_data?.company_name ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Company:
                    </span>
                    <p className="font-medium">{role_data.company_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Designation:
                    </span>
                    <p className="font-medium">{role_data.designation}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Industry:
                    </span>
                    <p className="font-medium">{role_data.industry}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Company Size:
                    </span>
                    <p className="font-medium">{role_data.company_size}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    Complete your company information
                  </p>
                  <Button>
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Complete Profile
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.users className="h-5 w-5 text-blue-500" />
                Find Talent
              </CardTitle>
              <CardDescription>
                Browse verified student profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Browse Students
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.briefcase className="h-5 w-5 text-green-500" />
                Post Jobs
              </CardTitle>
              <CardDescription>Create and manage job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Post a Job
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.barChart className="h-5 w-5 text-purple-500" />
                Analytics
              </CardTitle>
              <CardDescription>View recruitment analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest recruitment activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Icons.activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">
                Start by posting a job or browsing student profiles
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
