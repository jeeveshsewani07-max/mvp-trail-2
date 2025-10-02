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

interface FacultyProfile {
  profile: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  role_data: {
    faculty_id: string;
    institution_id?: string;
    department_id?: string;
    designation?: string;
    specialization?: string;
    qualifications?: string[];
    experience?: number;
    research_areas?: string[];
  };
}

export default function FacultyDashboard() {
  const { user, dbUser } = useAuth();
  const [profile, setProfile] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingAchievements, setPendingAchievements] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [mentees, setMentees] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const profileResponse = await fetch('/api/faculty/profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile({
            profile: {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email || 'User',
              email: user.email || '',
              role: user.user_metadata?.role || 'faculty',
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
              role: user.user_metadata?.role || 'faculty',
              created_at: user.created_at,
              updated_at: user.created_at || '',
            },
            role_data: {
              faculty_id: user.id,
            },
          });
        }

        // Fetch pending achievements
        const achievementsResponse = await fetch('/api/faculty/achievements');
        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          setPendingAchievements(achievementsData);
        }

        // Fetch upcoming events
        const eventsResponse = await fetch('/api/faculty/events');
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setUpcomingEvents(eventsData);
        }

        // Fetch mentees
        const menteesResponse = await fetch('/api/faculty/mentees');
        if (menteesResponse.ok) {
          const menteesData = await menteesResponse.json();
          setMentees(menteesData);
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
            Welcome to your Faculty Dashboard
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
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, Professor {userProfile.full_name}!
          </h1>
          <p className="text-purple-100">
            Guide students, approve achievements, and create impactful events.
          </p>
        </div>

        {/* Faculty Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="h-5 w-5" />
              Faculty Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {role_data?.designation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Designation:
                    </span>
                    <p className="font-medium">{role_data.designation}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Experience:
                    </span>
                    <p className="font-medium">{role_data.experience} years</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Specialization:
                    </span>
                    <p className="font-medium">{role_data.specialization}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Research Areas:
                    </span>
                    <p className="font-medium">
                      {role_data.research_areas?.join(', ')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    Complete your faculty information
                  </p>
                  <Button
                    onClick={() => {
                      // Navigate to profile completion page
                      window.location.href = '/profile';
                    }}
                  >
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
                <Icons.checkCircle className="h-5 w-5 text-green-500" />
                Approve Achievements
              </CardTitle>
              <CardDescription>
                Review and approve student achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/achievements/approve';
                }}
              >
                Review Achievements
                {pendingAchievements.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingAchievements.length}
                  </Badge>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.calendar className="h-5 w-5 text-blue-500" />
                Manage Events
              </CardTitle>
              <CardDescription>View and manage your events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/events/my-events';
                }}
              >
                Manage Events
                {upcomingEvents.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {upcomingEvents.length} Active
                  </Badge>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.users className="h-5 w-5 text-purple-500" />
                Mentor Students
              </CardTitle>
              <CardDescription>Guide and mentor students</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = '/mentees';
                }}
              >
                View Mentees
                {mentees.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {mentees.length} Students
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
            <CardDescription>Your latest faculty activities</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAchievements.length === 0 && upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icons.activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">
                  Start by completing your profile or creating an event
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAchievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                        <Icons.trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.student.full_name} • Pending Approval
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Review
                    </Button>
                  </div>
                ))}
                {upcomingEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <Icons.calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.start_date).toLocaleDateString()} •{' '}
                          {event.participants?.length || 0} Registered
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
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
