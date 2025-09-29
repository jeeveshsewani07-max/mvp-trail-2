'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

// Enhanced Mock Data for Recruiter Dashboard
const mockRecruiterData = {
  stats: {
    activeJobs: 5,
    totalApplications: 48,
    shortlisted: 15,
    hired: 7,
    thisWeekApplications: 12,
    avgTimeToHire: 18,
  },
  activeJobs: [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp India',
      location: 'Bangalore',
      type: 'Full-time',
      salary: { min: 600000, max: 900000 },
      postedDate: '2024-01-15',
      deadline: '2024-02-15',
      applications: 18,
      views: 245,
      status: 'active',
      requirements: ['React', 'TypeScript', 'Node.js'],
      experience: '2-4 years',
    },
    {
      id: '2',
      title: 'Data Scientist Intern',
      company: 'AI Solutions Ltd',
      location: 'Remote',
      type: 'Internship',
      salary: { min: 25000, max: 35000 },
      postedDate: '2024-01-20',
      deadline: '2024-02-20',
      applications: 24,
      views: 189,
      status: 'active',
      requirements: ['Python', 'Machine Learning', 'SQL'],
      experience: 'Entry level',
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Hybrid - Mumbai',
      type: 'Full-time',
      salary: { min: 800000, max: 1200000 },
      postedDate: '2024-01-12',
      deadline: '2024-02-28',
      applications: 6,
      views: 156,
      status: 'low_applications',
      requirements: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      experience: '3-5 years',
    },
  ],
  recentApplications: [
    {
      id: '1',
      candidateName: 'Priya Sharma',
      jobTitle: 'Frontend Developer',
      appliedDate: '2024-01-22',
      status: 'shortlisted',
      experience: '3 years',
      skills: ['React', 'TypeScript', 'JavaScript'],
      education: 'B.Tech Computer Science',
      gpa: 3.8,
      achievements: 8,
      matchScore: 94,
      resumeUrl: '/resumes/priya-sharma.pdf',
      linkedinUrl: 'https://linkedin.com/in/priyasharma',
    },
    {
      id: '2',
      candidateName: 'Rahul Kumar',
      jobTitle: 'Data Scientist Intern',
      appliedDate: '2024-01-21',
      status: 'under_review',
      experience: 'Fresher',
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      education: 'M.Tech Data Science',
      gpa: 3.9,
      achievements: 12,
      matchScore: 89,
      resumeUrl: '/resumes/rahul-kumar.pdf',
      linkedinUrl: 'https://linkedin.com/in/rahulkumar',
    },
    {
      id: '3',
      candidateName: 'Anita Patel',
      jobTitle: 'Full Stack Developer',
      appliedDate: '2024-01-20',
      status: 'interview_scheduled',
      experience: '4 years',
      skills: ['React', 'Node.js', 'PostgreSQL'],
      education: 'B.E. Software Engineering',
      gpa: 3.7,
      achievements: 15,
      matchScore: 96,
      resumeUrl: '/resumes/anita-patel.pdf',
      linkedinUrl: 'https://linkedin.com/in/anitapatel',
      interviewDate: '2024-01-25',
      interviewTime: '10:00 AM',
    },
  ],
  hiringPipeline: [
    { stage: 'Applied', count: 48, color: 'bg-blue-500' },
    { stage: 'Screening', count: 32, color: 'bg-yellow-500' },
    { stage: 'Interview', count: 18, color: 'bg-orange-500' },
    { stage: 'Final Round', count: 8, color: 'bg-purple-500' },
    { stage: 'Offer', count: 4, color: 'bg-green-500' },
    { stage: 'Hired', count: 7, color: 'bg-emerald-600' },
  ],
  topCandidates: [
    {
      name: 'Vikash Singh',
      position: 'Frontend Developer',
      matchScore: 97,
      experience: '3 years',
      skills: ['React', 'Vue.js', 'TypeScript'],
      status: 'available',
    },
    {
      name: 'Sneha Gupta',
      position: 'Data Scientist',
      matchScore: 95,
      experience: '2 years',
      skills: ['Python', 'ML', 'Deep Learning'],
      status: 'interview_pending',
    },
    {
      name: 'Arjun Reddy',
      position: 'Full Stack Developer',
      matchScore: 93,
      experience: '4 years',
      skills: ['React', 'Node.js', 'AWS'],
      status: 'offer_sent',
    },
  ],
};

export function RecruiterDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const data = mockRecruiterData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'hired': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'low_applications': return 'text-yellow-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Recruiter Dashboard 💼
            </h2>
            <p className="text-purple-100">
              Find and connect with top talent
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-purple-100">New Applications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Icons.briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Currently hiring</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Icons.fileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">48</div>
            <p className="text-xs text-muted-foreground">Total received</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <Icons.heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">15</div>
            <p className="text-xs text-muted-foreground">Ready to interview</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">7</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/jobs/post">
                <Icons.plus className="h-4 w-4 mr-2" />
                Post New Job
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/candidates">
                <Icons.search className="h-4 w-4 mr-2" />
                Find Candidates
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/applications">
                <Icons.fileText className="h-4 w-4 mr-2" />
                Review Applications
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>5 new applications received</span>
              <span className="text-muted-foreground ml-auto">Today</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Interview scheduled with John Doe</span>
              <span className="text-muted-foreground ml-auto">Yesterday</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Posted "Frontend Developer" job</span>
              <span className="text-muted-foreground ml-auto">2 days ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest candidates who applied to your jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Icons.briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No recent applications to display</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

