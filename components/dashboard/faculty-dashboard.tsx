'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAchievements } from '@/hooks/use-achievements';
import { useDashboardUpdates } from '@/hooks/use-dashboard-updates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const { data: session } = useSession();
  const userId = session?.user?.id || 'faculty-user-123';
  
  // Use both mock data and real-time updates
  const [data, setData] = useState(mockFacultyData);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  
  // Real-time achievements data
  const { 
    achievements: pendingAchievements, 
    loading: loadingAchievements, 
    refetch 
  } = useAchievements('pending');
  
  // Real-time dashboard stats
  const {
    stats: liveStats,
    loading: loadingStats,
    refresh: refreshStats
  } = useDashboardUpdates({
    userId,
    role: 'faculty',
    refreshInterval: 10000 // 10 seconds
  });
  
  // Update data with live stats when available
  useEffect(() => {
    if (!loadingStats && liveStats) {
      setData(prevData => ({
        ...prevData,
        stats: {
          ...prevData.stats,
          pendingApprovals: liveStats.pendingApprovals || prevData.stats.pendingApprovals,
          mentees: liveStats.mentees || prevData.stats.mentees,
          eventsCreated: liveStats.eventsCreated || prevData.stats.eventsCreated,
          achievementsApproved: liveStats.achievementsApproved || prevData.stats.achievementsApproved,
          thisWeekApprovals: liveStats.thisWeekApprovals || prevData.stats.thisWeekApprovals,
        }
      }));
    }
  }, [liveStats, loadingStats]);
  
  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewEvidenceDialogOpen, setViewEvidenceDialogOpen] = useState(false);
  const [viewStudentDialogOpen, setViewStudentDialogOpen] = useState(false);
  
  // Form states
  const [credits, setCredits] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Open approve dialog
  const openApproveDialog = (achievement: any) => {
    setSelectedAchievement(achievement);
    setCredits(achievement.credits || 10); // Default or existing credits
    setApproveDialogOpen(true);
  };
  
  // Open reject dialog
  const openRejectDialog = (achievement: any) => {
    setSelectedAchievement(achievement);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };
  
  // Open view evidence dialog
  const openViewEvidenceDialog = (achievement: any) => {
    setSelectedAchievement(achievement);
    setViewEvidenceDialogOpen(true);
  };
  
  // Open view student dialog
  const openViewStudentDialog = (achievement: any) => {
    setSelectedAchievement(achievement);
    setViewStudentDialogOpen(true);
  };
  
  // Handle approve submission
  const handleApprove = async () => {
    if (!selectedAchievement) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/achievements/${selectedAchievement.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          credits: Number(credits),
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve achievement');
      }
      
      toast.success('Achievement approved successfully!');
      setApproveDialogOpen(false);
      
      // Refresh all data
      refetch();
      refreshStats();
      
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || 'Failed to approve achievement');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject submission
  const handleReject = async () => {
    if (!selectedAchievement) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/achievements/${selectedAchievement.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reject achievement');
      }
      
      toast.success('Achievement rejected');
      setRejectDialogOpen(false);
      
      // Refresh all data
      refetch();
      refreshStats();
      
    } catch (error: any) {
      console.error('Rejection error:', error);
      toast.error(error.message || 'Failed to reject achievement');
    } finally {
      setIsProcessing(false);
    }
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
    <div className="space-y-6">
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
              <div className="text-2xl font-bold">{pendingAchievements.length}</div>
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
            <div className="text-2xl font-bold text-amber-600">{pendingAchievements.length}</div>
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
                {pendingAchievements.length} pending
              </Badge>
              <Button variant="outline" size="sm">
                <Icons.filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {loadingAchievements ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : pendingAchievements.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Icons.checkCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
                  <p className="text-muted-foreground">
                    All achievements have been reviewed. New submissions will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingAchievements.map((achievement) => (
              <Card key={achievement.id} className="card-hover border-l-4 border-l-amber-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                        <Icons.clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{achievement.title}</h4>
                          <Badge variant="secondary">pending</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="font-medium">{achievement.student_profiles.users.full_name}</span>
                          <span>{achievement.achievement_categories.name}</span>
                        </div>
                        {achievement.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                            {achievement.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {achievement.skill_tags.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Achieved: {formatDate(achievement.date_achieved)}</span>
                          <span>Submitted: {formatDate(achievement.created_at)}</span>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openViewStudentDialog(achievement)}
                      >
                        <Icons.user className="h-4 w-4 mr-2" />
                        View Student
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openViewEvidenceDialog(achievement)}
                      >
                        <Icons.fileText className="h-4 w-4 mr-2" />
                        Evidence
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openRejectDialog(achievement)}
                      >
                        <Icons.x className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => openApproveDialog(achievement)}
                      >
                        <Icons.check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.info(`Messaging ${mentee.name}...`)}
                      >
                        <Icons.messageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link href={`/students/${mentee.id}`}>
                          <Icons.eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Link>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link href={`/events/edit/${event.id}`}>
                          <Icons.edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.info(`Viewing ${event.registrations} participants for ${event.title}`)}
                      >
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
      
      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approve Achievement</DialogTitle>
            <DialogDescription>
              Assign credits and approve this achievement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedAchievement && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="title">Achievement</Label>
                  <div className="text-sm font-medium">{selectedAchievement.title}</div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="student">Student</Label>
                  <div className="text-sm">
                    {selectedAchievement.student_profiles?.users?.full_name || 'Student Name'}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credits">Credits to Award</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    min={1}
                    max={50}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Approve'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Achievement</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this achievement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedAchievement && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="title">Achievement</Label>
                  <div className="text-sm font-medium">{selectedAchievement.title}</div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="student">Student</Label>
                  <div className="text-sm">
                    {selectedAchievement.student_profiles?.users?.full_name || 'Student Name'}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Rejection Reason</Label>
                  <Textarea
                    id="reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide specific feedback on why this achievement was rejected"
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Evidence Dialog */}
      <Dialog open={viewEvidenceDialogOpen} onOpenChange={setViewEvidenceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Achievement Evidence</DialogTitle>
            <DialogDescription>
              Review supporting documents and evidence.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {selectedAchievement && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Achievement Details</h3>
                  <p className="text-sm mt-1">{selectedAchievement.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Evidence Files</h3>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {selectedAchievement.evidence_files?.length > 0 ? (
                      selectedAchievement.evidence_files.map((file: string, index: number) => (
                        <div 
                          key={index}
                          className="flex items-center p-2 border rounded-md bg-muted/50"
                        >
                          <Icons.fileText className="h-5 w-5 mr-2 text-blue-500" />
                          <span className="text-sm flex-1 truncate">{file}</span>
                          <Button variant="ghost" size="sm">
                            <Icons.externalLink className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No evidence files attached</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Skills & Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAchievement.skill_tags?.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Date Achieved</h3>
                    <p className="text-sm mt-1">
                      {selectedAchievement.date_achieved ? 
                        formatDate(selectedAchievement.date_achieved) : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Date Submitted</h3>
                    <p className="text-sm mt-1">
                      {selectedAchievement.created_at ? 
                        formatDate(selectedAchievement.created_at) : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEvidenceDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Student Dialog */}
      <Dialog open={viewStudentDialogOpen} onOpenChange={setViewStudentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>
              View student details and performance.
            </DialogDescription>
          </DialogHeader>
          {selectedAchievement && selectedAchievement.student_profiles && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icons.user className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedAchievement.student_profiles.users?.full_name || 'Student Name'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAchievement.student_profiles.users?.email || 'student@example.com'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Total Credits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {selectedAchievement.student_profiles.total_credits || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedAchievement.student_profiles.achievements || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewStudentDialogOpen(false)}>
                  Close
                </Button>
                <Button asChild>
                  <Link href={`/students/${selectedAchievement.student_profiles.id}`}>
                    <Icons.externalLink className="h-4 w-4 mr-2" />
                    Full Profile
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

