'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface StudentDetailPageProps {
  params: {
    id: string;
  };
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  // Mock student data - would fetch based on params.id
  const student = {
    id: params.id,
    rollNumber: 'CS2021001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@university.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    year: '4th Year',
    semester: '8th',
    batch: '2021-2025',
    cgpa: 8.5,
    achievements: 12,
    totalCredits: 85,
    profileComplete: 95,
    status: 'active',
    lastActive: '2024-01-22',
    mentor: 'Dr. Rajesh Kumar',
    address: 'Mumbai, Maharashtra',
    parentContact: '+91 98765 43211',
    skills: ['React.js', 'Node.js', 'Python', 'Machine Learning', 'SQL'],
    interests: ['Web Development', 'AI/ML', 'Open Source'],
    languages: ['English', 'Hindi', 'Marathi'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aaravsharma',
      github: 'https://github.com/aaravsharma',
      portfolio: 'https://aaravsharma.dev'
    },
    recentAchievements: [
      {
        id: '1',
        title: 'React.js Full Stack Certification',
        category: 'Technical',
        status: 'approved',
        credits: 15,
        dateAchieved: '2024-01-15',
        approver: 'Dr. Rajesh Kumar'
      },
      {
        id: '2',
        title: 'Hackathon Winner - AI Challenge',
        category: 'Competition',
        status: 'approved',
        credits: 20,
        dateAchieved: '2024-01-10',
        approver: 'Dr. Anjali Singh'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/students">
                <Icons.arrowLeft className="h-4 w-4 mr-2" />
                Back to Students
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{student.name}</h1>
              <p className="text-muted-foreground">
                {student.rollNumber} • {student.department} • {student.year}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icons.messageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline">
              <Icons.edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button>
              <Icons.download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>

        {/* Status and Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(student.status)}>
                {student.status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">CGPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{student.cgpa}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{student.achievements}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{student.totalCredits}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">{student.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <p className="text-sm text-muted-foreground">{student.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Parent Contact</label>
                    <p className="text-sm text-muted-foreground">{student.parentContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Batch</label>
                    <p className="text-sm text-muted-foreground">{student.batch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Current Semester</label>
                    <p className="text-sm text-muted-foreground">{student.semester}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Technical Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {student.interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {student.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Latest approved achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge variant="secondary">{achievement.credits} credits</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{achievement.category}</span>
                        <span>Approved by {achievement.approver}</span>
                        <span>{formatDate(achievement.dateAchieved)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Completeness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{student.profileComplete}%</span>
                    </div>
                    <Progress value={student.profileComplete} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icons.check className="h-4 w-4 text-green-500" />
                      <span>Basic information completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.check className="h-4 w-4 text-green-500" />
                      <span>Skills and interests updated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.x className="h-4 w-4 text-red-500" />
                      <span>Portfolio link missing</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mentor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{student.mentor}</p>
                  <p className="text-sm text-muted-foreground">Faculty Mentor</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Icons.messageCircle className="h-4 w-4 mr-2" />
                    Contact Mentor
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={student.socialLinks.linkedin} target="_blank">
                    <Icons.linkedin className="h-4 w-4 mr-2" />
                    LinkedIn Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={student.socialLinks.github} target="_blank">
                    <Icons.github className="h-4 w-4 mr-2" />
                    GitHub Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={student.socialLinks.portfolio} target="_blank">
                    <Icons.externalLink className="h-4 w-4 mr-2" />
                    Portfolio Website
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Icons.award className="h-4 w-4 mr-2" />
                  View All Achievements
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Icons.calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Icons.fileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
