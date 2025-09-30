'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { useAuth } from '@/components/providers';
import { formatDate, formatCurrency } from '@/lib/utils';

// Mock data - would come from API
const mockStudentData = {
  stats: {
    achievements: 12,
    credits: 85,
    events: 8,
    applications: 5,
    profileViews: 24,
    profileScore: 78,
  },
  recentAchievements: [
    {
      id: '1',
      title: 'Web Development Certificate',
      category: 'Technical',
      status: 'approved',
      credits: 10,
      dateAchieved: '2024-01-15',
      approver: 'Prof. Smith',
    },
    {
      id: '2', 
      title: 'Hackathon Winner',
      category: 'Competition',
      status: 'pending',
      credits: 15,
      dateAchieved: '2024-01-10',
    },
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'TechFest 2024',
      type: 'Competition',
      startDate: '2024-02-15',
      venue: 'Main Auditorium',
      registrationDeadline: '2024-02-10',
    },
    {
      id: '2',
      title: 'AI/ML Workshop',
      type: 'Workshop',
      startDate: '2024-02-20',
      venue: 'Lab 101',
      registrationDeadline: '2024-02-18',
    },
  ],
  jobRecommendations: [
    {
      id: '1',
      title: 'Frontend Developer Intern',
      company: 'TechCorp India',
      location: 'Bangalore',
      salary: { min: 15000, max: 25000 },
      type: 'Internship',
      deadline: '2024-02-28',
      match: 92,
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: { min: 600000, max: 800000 },
      type: 'Full-time',
      deadline: '2024-03-15',
      match: 87,
    },
  ],
  badges: [
    { id: '1', name: 'Early Adopter', rarity: 'common', earned: true },
    { id: '2', name: 'Leadership Excellence', rarity: 'rare', earned: true },
    { id: '3', name: 'Innovation Master', rarity: 'legendary', earned: false },
  ],
};

export function StudentDashboard() {
  const { dbUser } = useAuth();
  const [data, setData] = useState(mockStudentData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'uncommon':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {dbUser?.fullName?.split(' ')[0]}! 🎓
            </h2>
            <p className="text-blue-100">
              You're doing great! Keep building your digital portfolio.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.stats.profileScore}%</div>
              <div className="text-sm text-blue-100">Profile Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Icons.award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.achievements}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Icons.star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.credits}</div>
            <p className="text-xs text-muted-foreground">
              +15 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
            <Icons.calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.events}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Icons.eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.user className="h-5 w-5" />
                  Profile Completeness
                </CardTitle>
                <CardDescription>
                  Complete your profile to get better recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{data.stats.profileScore}%</span>
                  </div>
                  <Progress value={data.stats.profileScore} />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    <span>Basic information added</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-green-500" />
                    <span>Skills updated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.x className="h-4 w-4 text-red-500" />
                    <span>Resume not uploaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.x className="h-4 w-4 text-red-500" />
                    <span>Portfolio link missing</span>
                  </div>
                </div>

                <Button className="w-full" size="sm" asChild>
                  <Link href="/profile">
                    <Icons.edit className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks to boost your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/achievements/add">
                    <Icons.plus className="h-4 w-4 mr-2" />
                    Add New Achievement
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/events">
                    <Icons.calendar className="h-4 w-4 mr-2" />
                    Browse Events
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/jobs">
                    <Icons.briefcase className="h-4 w-4 mr-2" />
                    Find Jobs
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/portfolio/export">
                    <Icons.download className="h-4 w-4 mr-2" />
                    Export Resume
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest achievements and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icons.award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.category} • {formatDate(achievement.dateAchieved)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(achievement.status)}>
                        {achievement.status}
                      </Badge>
                      <span className="text-sm font-medium">{achievement.credits} credits</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Achievements</h3>
            <Button asChild>
              <Link href="/achievements/add">
                <Icons.plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {data.recentAchievements.map((achievement) => (
              <Card key={achievement.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icons.award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.category} • {formatDate(achievement.dateAchieved)}
                        </p>
                        {achievement.approver && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Approved by {achievement.approver}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(achievement.status)}>
                        {achievement.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium">{achievement.credits}</div>
                        <div className="text-xs text-muted-foreground">credits</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recommended Jobs</h3>
            <Button variant="outline" asChild>
              <Link href="/jobs">
                View All Jobs
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {data.jobRecommendations.map((job) => (
              <Card key={job.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {job.match}% match
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Icons.mapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Icons.briefcase className="h-3 w-3" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Icons.clock className="h-3 w-3" />
                          Due {formatDate(job.deadline)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)}
                          <span className="text-muted-foreground font-normal">/year</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Icons.heart className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <Button variant="outline" asChild>
              <Link href="/events">
                Browse All Events
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {data.upcomingEvents.map((event) => (
              <Card key={event.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icons.calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.type}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{formatDate(event.startDate)}</span>
                          <span>📍 {event.venue}</span>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">
                          Registration closes {formatDate(event.registrationDeadline)}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">
                      Register
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

