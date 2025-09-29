'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

// Mock data for institution dashboard
const mockInstitutionData = {
  stats: {
    totalStudents: 1247,
    totalFaculty: 89,
    totalDepartments: 12,
    totalAchievements: 3456,
    activeEvents: 18,
    totalApplications: 245,
    placementRate: 94.2,
    averageCGPA: 8.1,
  },
  departments: [
    { name: 'Computer Science', students: 312, faculty: 24, achievements: 1245 },
    { name: 'Electronics', students: 278, faculty: 18, achievements: 892 },
    { name: 'Mechanical', students: 298, faculty: 22, achievements: 756 },
    { name: 'Civil', students: 201, faculty: 15, achievements: 423 },
    { name: 'Information Technology', students: 158, faculty: 10, achievements: 340 },
  ],
  recentActivities: [
    { 
      type: 'achievement', 
      message: '25 new achievements approved this week', 
      time: 'Today',
      icon: 'award',
      color: 'text-green-600'
    },
    { 
      type: 'student', 
      message: '15 new student registrations', 
      time: '2 days ago',
      icon: 'userPlus',
      color: 'text-blue-600'
    },
    { 
      type: 'event', 
      message: 'TechFest 2024 event created', 
      time: '3 days ago',
      icon: 'calendar',
      color: 'text-purple-600'
    },
    { 
      type: 'faculty', 
      message: '2 new faculty members joined', 
      time: '1 week ago',
      icon: 'users',
      color: 'text-indigo-600'
    },
    { 
      type: 'report', 
      message: 'Monthly performance report generated', 
      time: '1 week ago',
      icon: 'fileText',
      color: 'text-orange-600'
    },
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Annual Tech Symposium 2024',
      date: '2024-02-15',
      venue: 'Main Auditorium',
      participants: 450,
      maxParticipants: 500,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Career Fair - IT Companies',
      date: '2024-02-20',
      venue: 'Exhibition Hall',
      participants: 280,
      maxParticipants: 300,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Research Paper Presentation',
      date: '2024-02-25',
      venue: 'Conference Room A',
      participants: 85,
      maxParticipants: 100,
      status: 'upcoming'
    },
  ],
  quickStats: {
    thisWeek: {
      newStudents: 25,
      approvedAchievements: 67,
      createdEvents: 3,
      facultyJoined: 2,
    },
    performance: {
      studentEngagement: 87.5,
      facultyParticipation: 92.1,
      eventAttendance: 78.3,
      achievementRate: 94.2,
    }
  }
};

export function InstitutionDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const data = mockInstitutionData;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Institution Dashboard 🏛️
            </h2>
            <p className="text-indigo-100">
              Manage your institution and track student progress
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.quickStats.thisWeek.newStudents}</div>
              <div className="text-indigo-100">New Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.quickStats.thisWeek.approvedAchievements}</div>
              <div className="text-indigo-100">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.stats.totalFaculty}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.stats.totalDepartments}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.stats.totalAchievements}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{data.stats.activeEvents}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{data.stats.totalApplications}</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Placement %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{data.stats.placementRate}%</div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{data.stats.averageCGPA}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Students</CardTitle>
                <CardDescription>View and manage student profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/students">
                    <Icons.graduationCap className="h-4 w-4 mr-2" />
                    View Students
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Faculty Management</CardTitle>
                <CardDescription>Oversee teaching staff and mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/faculty">
                    <Icons.users className="h-4 w-4 mr-2" />
                    Manage Faculty
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>View institutional performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/reports">
                      <Icons.barChart className="h-4 w-4 mr-2" />
                      View Reports
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/analytics">
                      <Icons.trendingUp className="h-4 w-4 mr-2" />
                      Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your institution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivities.map((activity, index) => {
                  const IconComponent = Icons[activity.icon as keyof typeof Icons] as any;
                  return (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className={`${activity.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="flex-1">{activity.message}</span>
                      <span className="text-muted-foreground">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>Student, faculty, and achievement distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.departments.map((dept, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{dept.name}</h4>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/departments/${dept.name.toLowerCase().replace(' ', '-')}`}>
                          <Icons.eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{dept.students}</div>
                        <div className="text-muted-foreground">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{dept.faculty}</div>
                        <div className="text-muted-foreground">Faculty</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{dept.achievements}</div>
                        <div className="text-muted-foreground">Achievements</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <p className="text-muted-foreground">Events scheduled for the coming weeks</p>
            </div>
            <Button asChild>
              <Link href="/events/create">
                <Icons.plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {data.upcomingEvents.map((event) => (
              <Card key={event.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        <Icons.calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(event.date)}</span>
                          <span>📍 {event.venue}</span>
                        </div>
                        <div className="mt-2">
                          <Progress 
                            value={(event.participants / event.maxParticipants) * 100} 
                            className="w-32 h-2" 
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.participants}/{event.maxParticipants} participants
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Icons.edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.users className="h-4 w-4 mr-1" />
                        Participants
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>This Week Statistics</CardTitle>
                <CardDescription>Activity summary for the current week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>New Student Registrations</span>
                  <span className="font-semibold text-blue-600">{data.quickStats.thisWeek.newStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Achievements Approved</span>
                  <span className="font-semibold text-green-600">{data.quickStats.thisWeek.approvedAchievements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Events Created</span>
                  <span className="font-semibold text-purple-600">{data.quickStats.thisWeek.createdEvents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Faculty Joined</span>
                  <span className="font-semibold text-indigo-600">{data.quickStats.thisWeek.facultyJoined}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Student Engagement</span>
                    <span>{data.quickStats.performance.studentEngagement}%</span>
                  </div>
                  <Progress value={data.quickStats.performance.studentEngagement} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Faculty Participation</span>
                    <span>{data.quickStats.performance.facultyParticipation}%</span>
                  </div>
                  <Progress value={data.quickStats.performance.facultyParticipation} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Event Attendance</span>
                    <span>{data.quickStats.performance.eventAttendance}%</span>
                  </div>
                  <Progress value={data.quickStats.performance.eventAttendance} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Achievement Rate</span>
                    <span>{data.quickStats.performance.achievementRate}%</span>
                  </div>
                  <Progress value={data.quickStats.performance.achievementRate} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

