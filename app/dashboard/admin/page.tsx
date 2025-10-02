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

interface AdminProfile {
  profile: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  role_data: {
    institution_id: string;
    institution_name: string;
    institution_code: string;
    institution_type: string;
    institution_website?: string;
  };
}

export default function AdminDashboard() {
  const { user, dbUser } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
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
              role: user.user_metadata?.role || 'institution_admin',
              created_at: user.created_at,
              updated_at: new Date().toISOString(),
            },
            role_data: {
              institution_id: user.id,
              institution_name: `${user.user_metadata?.full_name || 'User'}'s Institution`,
              institution_code: `INST_${user.id.substring(0, 8)}`,
              institution_type: 'University',
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
            role: user.user_metadata?.role || 'institution_admin',
            created_at: user.created_at,
            updated_at: new Date().toISOString(),
          },
          role_data: {
            institution_id: user.id,
            institution_name: `${user.user_metadata?.full_name || 'User'}'s Institution`,
            institution_code: `INST_${user.id.substring(0, 8)}`,
            institution_type: 'University',
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
            Welcome to your Admin Dashboard
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
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {userProfile.full_name}!
          </h1>
          <p className="text-orange-100">
            Manage your institution's presence and get comprehensive analytics.
          </p>
        </div>

        {/* Institution Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.building className="h-5 w-5" />
              Institution Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Institution:
                  </span>
                  <p className="font-medium">{role_data.institution_name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Code:</span>
                  <p className="font-medium">{role_data.institution_code}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <p className="font-medium">{role_data.institution_type}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Website:
                  </span>
                  <p className="font-medium">
                    {role_data.institution_website || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.users className="h-5 w-5 text-blue-500" />
                Manage Students
              </CardTitle>
              <CardDescription>
                View and manage student profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Students
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5 text-green-500" />
                Manage Faculty
              </CardTitle>
              <CardDescription>Manage faculty members</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Faculty
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.barChart className="h-5 w-5 text-purple-500" />
                Analytics
              </CardTitle>
              <CardDescription>View institution analytics</CardDescription>
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
              Your latest administrative activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Icons.activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">
                Start by managing your institution's data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
