'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

// Mock data - Enhanced
const mockFacultyData = {
  stats: {
    mentees: 15,
    pendingApprovals: 8,
    eventsCreated: 3,
    achievementsApproved: 45,
    thisWeekApprovals: 12,
    avgApprovalTime: 2.3,
  },
  pendingAchievements: [
    {
      id: '1',
      title: 'React.js Certificate',
      studentName: 'John Doe',
      studentId: 'CS2022001',
      category: 'Technical',
      dateSubmitted: '2024-01-20',
      dateAchieved: '2024-01-15',
      credits: 10,
      description: 'Completed comprehensive React.js course with project portfolio including 3 full-stack applications.',
      evidenceFiles: ['react-certificate.pdf', 'project-screenshots.png'],
      skillTags: ['React', 'JavaScript', 'HTML/CSS'],
      priority: 'high',
    },
    {
      id: '2', 
      title: 'Hackathon Winner - AI Challenge',
      studentName: 'Jane Smith',
      studentId: 'CS2022045',
      category: 'Competition',
      dateSubmitted: '2024-01-19',
      dateAchieved: '2024-01-15',
      credits: 15,
      description: 'First place in university AI hackathon with innovative machine learning solution for student performance prediction.',
      evidenceFiles: ['hackathon-certificate.pdf', 'project-demo.mp4', 'code-repository.txt'],
      skillTags: ['Python', 'Machine Learning', 'TensorFlow'],
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Research Paper Publication',
      studentName: 'Mike Chen',
      studentId: 'CS2022078',
      category: 'Research',
      dateSubmitted: '2024-01-18',
      dateAchieved: '2024-01-10',
      credits: 20,
      description: 'Co-authored research paper "Deep Learning Applications in Educational Technology" published in IEEE conference.',
      evidenceFiles: ['research-paper.pdf', 'conference-acceptance.pdf'],
      skillTags: ['Research', 'Deep Learning', 'Academic Writing'],
      priority: 'high',
    },
  ],
  recentMentees: [
    {
      id: '1',
      name: 'Alice Johnson',
      studentId: 'CS2022012',
      email: 'alice.j@university.edu',
      achievements: 8,
      credits: 45,
      gpa: 3.7,
      lastActive: '2024-01-20',
      recentAchievement: 'Web Development Certificate',
      status: 'active',
      year: '3rd Year',
    },
    {
      id: '2',
      name: 'Bob Wilson', 
      studentId: 'CS2022034',
      email: 'bob.w@university.edu',
      achievements: 12,
      credits: 78,
      gpa: 3.9,
      lastActive: '2024-01-18',
      recentAchievement: 'Database Design Project',
      status: 'active',
      year: '4th Year',
    },
    {
      id: '3',
      name: 'Carol Davis',
      studentId: 'CS2022056',
      email: 'carol.d@university.edu',
      achievements: 6,
      credits: 35,
      gpa: 3.5,
      lastActive: '2024-01-15',
      recentAchievement: 'Python Programming Certificate',
      status: 'needs_attention',
      year: '2nd Year',
    },
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'AI Workshop Series',
      date: '2024-02-15',
      time: '10:00 AM',
      venue: 'Lab 101',
      registrations: 25,
      capacity: 30,
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Career Guidance Session',
      date: '2024-02-20',
      time: '2:00 PM',
      venue: 'Auditorium',
      registrations: 45,
      capacity: 50,
      status: 'upcoming',
    },
  ],
  recentActivity: [
    {
      type: 'approval',
      message: 'Approved 3 achievements from your mentees',
      time: 'Today',
      icon: 'checkCircle',
    },
    {
      type: 'event',
      message: 'Created "AI Workshop" event',
      time: '2 days ago',
      icon: 'calendar',
    },
    {
      type: 'feedback',
      message: 'Added feedback to 5 student profiles',
      time: '3 days ago',
      icon: 'messageCircle',
    },
  ],
};

export function FacultyDashboard() {
  const data = mockFacultyData;
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const handleApprove = async (achievementId: string) => {
    // Simulate API call
    console.log('Approving achievement:', achievementId);
    // Would update the achievement status in real app
  };

  const handleReject = async (achievementId: string) => {
    // Simulate API call  
    console.log('Rejecting achievement:', achievementId);
    // Would update the achievement status in real app
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'needs_attention': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 dashboard-content -mt-6 sm:-mt-8 lg:-mt-10">
      {/* Enhanced Welcome Message */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Faculty Dashboard 👨‍🏫
            </h2>
            <p className="text-green-100">
              Guide your students and approve their achievements
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="bg-white/20 px-2 py-1 rounded">
                {data.stats.thisWeekApprovals} approvals this week
              </span>
              <span className="bg-white/20 px-2 py-1 rounded">
                {data.stats.avgApprovalTime} days avg approval time
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.stats.pendingApprovals}</div>
              <div className="text-sm text-green-100">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Mentees</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.mentees}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{data.stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Created</CardTitle>
            <Icons.calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.eventsCreated}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approvals Given</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.stats.achievementsApproved}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="mentees">My Mentees</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pending Achievement Approvals</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {data.stats.pendingApprovals} pending
              </Badge>
              <Button variant="outline" size="sm">
                <Icons.filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {data.pendingAchievements.map((achievement) => (
              <Card key={achievement.id} className={`card-hover border-l-4 ${getPriorityColor(achievement.priority)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                        <Icons.clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{achievement.title}</h4>
                          <Badge variant={achievement.priority === 'high' ? 'destructive' : achievement.priority === 'medium' ? 'secondary' : 'outline'}>
                            {achievement.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="font-medium">{achievement.studentName}</span>
                          <span>ID: {achievement.studentId}</span>
                          <span>{achievement.category}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {achievement.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {achievement.skillTags.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Achieved: {formatDate(achievement.dateAchieved)}</span>
                          <span>Submitted: {formatDate(achievement.dateSubmitted)}</span>
                          <span>{achievement.evidenceFiles.length} evidence file(s)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{achievement.credits}</div>
                        <div className="text-xs text-muted-foreground">credits</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Icons.eye className="h-4 w-4 mr-2" />
                        View Evidence
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.user className="h-4 w-4 mr-2" />
                        View Student
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(achievement.id)}
                      >
                        <Icons.x className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApprove(achievement.id)}
                      >
                        <Icons.check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentees" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Mentees</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Icons.filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" asChild>
                <Link href="/mentees">View All Mentees</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {data.recentMentees.map((mentee) => (
              <Card key={mentee.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Icons.user className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{mentee.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(mentee.status)}`}>
                            {mentee.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                          <span>{mentee.year}</span>
                          <span>ID: {mentee.studentId}</span>
                          <span>GPA: {mentee.gpa}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            {mentee.achievements} achievements
                          </span>
                          <span className="text-blue-600 font-medium">
                            {mentee.credits} credits
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recent: {mentee.recentAchievement} • Last active {formatDate(mentee.lastActive)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Icons.messageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/events">
                    <Icons.calendar className="h-4 w-4 mr-2" />
                    Browse Events
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/events/create">
                    <Icons.plus className="h-4 w-4 mr-2" />
                    Create New Event
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/approve">
                    <Icons.checkCircle className="h-4 w-4 mr-2" />
                    Review Achievements ({data.stats.pendingApprovals})
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/mentees">
                    <Icons.users className="h-4 w-4 mr-2" />
                    Manage Mentees ({data.stats.mentees})
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/analytics">
                    <Icons.barChart className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentActivity.map((activity, index) => {
                    const IconComponent = Icons[activity.icon as keyof typeof Icons] as any;
                    return (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="flex-1">{activity.message}</span>
                        <span className="text-muted-foreground text-xs">{activity.time}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events you're organizing or participating in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {data.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icons.calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(event.date)} at {event.time}</span>
                          <span>📍 {event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {event.registrations}/{event.capacity} registered
                          </Badge>
                          <Badge variant={event.registrations >= event.capacity * 0.8 ? 'secondary' : 'outline'} className="text-xs">
                            {Math.round((event.registrations / event.capacity) * 100)}% full
                          </Badge>
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

