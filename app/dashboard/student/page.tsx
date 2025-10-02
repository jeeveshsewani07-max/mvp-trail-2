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
  const [achievements, setAchievements] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const profileResponse = await fetch('/api/student/profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile({
            profile: {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email || 'User',
              email: user.email || '',
              role: user.user_metadata?.role || 'student',
              created_at: user.created_at,
              updated_at: user.created_at || '',
            },
            role_data: profileData,
          });
        } else {
          console.error('Failed to fetch profile');
          setProfile({
            profile: {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email || 'User',
              email: user.email || '',
              role: user.user_metadata?.role || 'student',
              created_at: user.created_at,
              updated_at: user.created_at || '',
            },
            role_data: {
              student_id: user.id,
              is_profile_complete: false,
            },
          });
        }

        // Fetch achievements
        const achievementsResponse = await fetch('/api/student/achievements');
        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          setAchievements(achievementsData);
        }

        // Fetch portfolio
        const portfolioResponse = await fetch('/api/student/portfolio');
        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json();
          setPortfolio(portfolioData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div
          className="flex items-center justify-center min-h-[400px]"
          suppressHydrationWarning
        >
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
                    role_data?.is_profile_complete ? 'default' : 'secondary'
                  }
                >
                  {role_data?.is_profile_complete ? 'Complete' : 'Incomplete'}
                </Badge>
              </div>

              {role_data?.roll_number && (
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

              {!role_data?.is_profile_complete && (
                <Button
                  className="w-full"
                  onClick={() => {
                    window.location.href = '/profile';
                  }}
                >
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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/achievements';
                }}
              >
                View Achievements
                {achievements.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {achievements.length}
                  </Badge>
                )}
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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/jobs';
                }}
              >
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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/portfolio';
                }}
              >
                View Portfolio
                {portfolio && (
                  <Badge variant="secondary" className="ml-2">
                    {portfolio.achievements?.length || 0} Achievements
                  </Badge>
                )}
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
            {achievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icons.activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">
                  Start by completing your profile or adding achievements
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.slice(0, 5).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          achievement.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900'
                            : achievement.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900'
                              : 'bg-red-100 dark:bg-red-900'
                        }`}
                      >
                        <Icons.trophy
                          className={`h-4 w-4 ${
                            achievement.status === 'approved'
                              ? 'text-green-600 dark:text-green-400'
                              : achievement.status === 'pending'
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            achievement.created_at
                          ).toLocaleDateString()}{' '}
                          •{' '}
                          {achievement.status.charAt(0).toUpperCase() +
                            achievement.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/achievements/${achievement.id}`;
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
