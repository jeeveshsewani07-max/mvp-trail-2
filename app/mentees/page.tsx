'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// Mock mentees data
const mockMenteesData = [
  {
    id: '1',
    name: 'Priya Sharma',
    studentId: 'CS2022001',
    email: 'priya.sharma@university.edu',
    department: 'Computer Science',
    year: '3rd Year',
    cgpa: 3.8,
    enrollmentDate: '2022-08-15',
    lastActive: '2024-01-22',
    totalAchievements: 12,
    totalCredits: 185,
    recentAchievements: [
      { title: 'React.js Certification', date: '2024-01-20', credits: 15 },
      { title: 'Hackathon Winner', date: '2024-01-15', credits: 20 },
    ],
    performance: 'excellent',
    goals: [
      { title: 'Complete Full Stack Development', progress: 75, dueDate: '2024-03-01' },
      { title: 'Secure Internship', progress: 60, dueDate: '2024-02-15' },
    ],
    skills: ['React', 'Node.js', 'Python', 'JavaScript', 'SQL'],
    status: 'active',
    profileCompletion: 95,
    nextMeeting: '2024-01-25',
    notes: 'Highly motivated student with strong technical skills. Working on personal project.',
  },
  {
    id: '2',
    name: 'Rahul Kumar',
    studentId: 'CS2022045',
    email: 'rahul.k@university.edu',
    department: 'Computer Science',
    year: '4th Year',
    cgpa: 3.9,
    enrollmentDate: '2021-08-15',
    lastActive: '2024-01-21',
    totalAchievements: 18,
    totalCredits: 245,
    recentAchievements: [
      { title: 'Google Cloud Certification', date: '2024-01-18', credits: 25 },
      { title: 'Research Paper Publication', date: '2024-01-10', credits: 30 },
    ],
    performance: 'outstanding',
    goals: [
      { title: 'Complete Final Year Project', progress: 85, dueDate: '2024-04-01' },
      { title: 'Job Placement', progress: 90, dueDate: '2024-03-01' },
    ],
    skills: ['Cloud Computing', 'Machine Learning', 'Python', 'Java', 'DevOps'],
    status: 'active',
    profileCompletion: 100,
    nextMeeting: '2024-01-26',
    notes: 'Exceptional student ready for industry placement. Strong research aptitude.',
  },
  {
    id: '3',
    name: 'Anita Patel',
    studentId: 'EE2022078',
    email: 'anita.patel@university.edu',
    department: 'Electrical Engineering',
    year: '3rd Year',
    cgpa: 3.7,
    enrollmentDate: '2022-08-15',
    lastActive: '2024-01-20',
    totalAchievements: 8,
    totalCredits: 125,
    recentAchievements: [
      { title: 'IoT Project Completion', date: '2024-01-15', credits: 18 },
      { title: 'Circuit Design Competition', date: '2024-01-08', credits: 12 },
    ],
    performance: 'good',
    goals: [
      { title: 'Improve Programming Skills', progress: 45, dueDate: '2024-02-28' },
      { title: 'Complete Embedded Systems Course', progress: 30, dueDate: '2024-03-15' },
    ],
    skills: ['Embedded Systems', 'Circuit Design', 'C++', 'Arduino', 'PCB Design'],
    status: 'needs_attention',
    profileCompletion: 75,
    nextMeeting: '2024-01-24',
    notes: 'Good potential but needs guidance on programming fundamentals.',
  },
  {
    id: '4',
    name: 'Vikash Singh',
    studentId: 'CS2022091',
    email: 'vikash.singh@university.edu',
    department: 'Computer Science',
    year: '4th Year',
    cgpa: 3.95,
    enrollmentDate: '2021-08-15',
    lastActive: '2024-01-23',
    totalAchievements: 22,
    totalCredits: 320,
    recentAchievements: [
      { title: 'IEEE Paper Publication', date: '2024-01-16', credits: 35 },
      { title: 'Industry Internship Completion', date: '2024-01-12', credits: 25 },
    ],
    performance: 'outstanding',
    goals: [
      { title: 'PhD Application Preparation', progress: 70, dueDate: '2024-02-01' },
      { title: 'Research Grant Application', progress: 50, dueDate: '2024-03-01' },
    ],
    skills: ['Machine Learning', 'Research', 'Python', 'TensorFlow', 'Academic Writing'],
    status: 'active',
    profileCompletion: 100,
    nextMeeting: '2024-01-27',
    notes: 'Exceptional research potential. Considering graduate studies.',
  },
  {
    id: '5',
    name: 'Sneha Gupta',
    studentId: 'IT2022034',
    email: 'sneha.gupta@university.edu',
    department: 'Information Technology',
    year: '3rd Year',
    cgpa: 3.85,
    enrollmentDate: '2022-08-15',
    lastActive: '2024-01-19',
    totalAchievements: 10,
    totalCredits: 165,
    recentAchievements: [
      { title: 'National Hackathon Winner', date: '2024-01-14', credits: 22 },
      { title: 'Web Development Project', date: '2024-01-09', credits: 15 },
    ],
    performance: 'excellent',
    goals: [
      { title: 'Build Mobile App Portfolio', progress: 55, dueDate: '2024-02-20' },
      { title: 'Secure Summer Internship', progress: 80, dueDate: '2024-02-10' },
    ],
    skills: ['React', 'Node.js', 'Mobile Development', 'UI/UX', 'Team Leadership'],
    status: 'active',
    profileCompletion: 90,
    nextMeeting: '2024-01-28',
    notes: 'Strong leadership qualities and innovative thinking. Great team player.',
  },
];

export default function MenteesPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedPerformance, setSelectedPerformance] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const sendMessage = async (studentId: string) => {
    toast.success('Message sent to student');
  };

  const scheduleMeeting = async (studentId: string) => {
    toast.success('Meeting scheduled successfully');
  };

  const updateNotes = async (studentId: string, notes: string) => {
    toast.success('Notes updated successfully');
  };

  const filteredMentees = mockMenteesData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === 'All' || student.year === selectedYear;
    const matchesPerformance = selectedPerformance === 'All' || student.performance === selectedPerformance;
    
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'active' && student.status === 'active') ||
                      (selectedTab === 'needs_attention' && student.status === 'needs_attention');
    
    return matchesSearch && matchesYear && matchesPerformance && matchesTab;
  });

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'outstanding': return 'text-purple-600 bg-purple-100';
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Icons.checkCircle className="h-4 w-4 text-green-600" />;
      case 'needs_attention': return <Icons.alertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Icons.user className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Mentees</h1>
            <p className="text-muted-foreground">
              Guide and track the progress of your assigned students
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Icons.calendar className="h-4 w-4 mr-2" />
              Schedule Group Meeting
            </Button>
            <Button>
              <Icons.plus className="h-4 w-4 mr-2" />
              Add New Mentee
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mentees</CardTitle>
              <Icons.users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{mockMenteesData.length}</div>
              <p className="text-xs text-muted-foreground">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Icons.star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {mockMenteesData.filter(s => s.performance === 'outstanding').length}
              </div>
              <p className="text-xs text-muted-foreground">Top performers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <Icons.alertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {mockMenteesData.filter(s => s.status === 'needs_attention').length}
              </div>
              <p className="text-xs text-muted-foreground">Require guidance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg CGPA</CardTitle>
              <Icons.trendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(mockMenteesData.reduce((sum, s) => sum + s.cgpa, 0) / mockMenteesData.length).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Mentees</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="needs_attention">Needs Attention</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Search mentees by name, ID, or department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Years</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
                    <SelectTrigger>
                      <SelectValue placeholder="Performance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Performance</SelectItem>
                      <SelectItem value="outstanding">Outstanding</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Mentees List */}
            <div className="grid gap-6">
              {filteredMentees.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{student.name}</h3>
                            {getStatusIcon(student.status)}
                            <Badge className={`text-xs ${getPerformanceColor(student.performance)}`}>
                              {student.performance}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                            <div>ID: {student.studentId}</div>
                            <div>CGPA: {student.cgpa}</div>
                            <div>{student.department}</div>
                            <div>{student.year}</div>
                            <div>Email: {student.email}</div>
                            <div>Last Active: {formatDate(student.lastActive)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{student.totalAchievements}</div>
                            <div className="text-xs text-muted-foreground">achievements</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{student.totalCredits}</div>
                            <div className="text-xs text-muted-foreground">credits</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendMessage(student.id)}
                          >
                            <Icons.messageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => scheduleMeeting(student.id)}
                          >
                            <Icons.calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Goals Progress */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-3">Current Goals</h4>
                      <div className="space-y-3">
                        {student.goals.map((goal, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{goal.title}</span>
                              <span className="text-muted-foreground">
                                Due: {formatDate(goal.dueDate)}
                              </span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-3">Recent Achievements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {student.recentAchievements.map((achievement, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm">
                            <span>{achievement.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {achievement.credits} credits
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Icons.fileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Notes:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{student.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMentees.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icons.users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No mentees found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
