'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { formatDate, formatCurrency } from '@/lib/utils';

// Mock applications data
const mockApplicationsData = {
  stats: {
    total: 12,
    pending: 4,
    shortlisted: 3,
    accepted: 2,
    rejected: 3,
  },
  applications: [
    {
      id: '1',
      jobTitle: 'Frontend Developer Intern',
      company: 'TechCorp India',
      location: 'Bangalore, India',
      type: 'Internship',
      salary: { min: 15000, max: 25000, currency: 'INR', period: 'month' },
      appliedDate: '2024-01-20',
      status: 'shortlisted',
      statusUpdatedDate: '2024-01-22',
      deadline: '2024-02-28',
      match: 92,
      description: 'Work on cutting-edge web applications using React and TypeScript. Great learning opportunity with mentorship.',
      requirements: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
      applicationNotes: 'Applied through university placement portal. Cover letter emphasized React projects and internship experience.',
      interviewDate: '2024-01-25',
      nextAction: 'Technical interview scheduled',
    },
    {
      id: '2',
      jobTitle: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: { min: 600000, max: 800000, currency: 'INR', period: 'year' },
      appliedDate: '2024-01-18',
      status: 'pending',
      deadline: '2024-03-15',
      match: 87,
      description: 'Join our fast-growing startup to build scalable web applications. Work with modern tech stack and experienced team.',
      requirements: ['Node.js', 'React', 'MongoDB', 'AWS'],
      applicationNotes: 'Found through job portal. Highlighted full-stack projects and hackathon wins.',
    },
    {
      id: '3',
      jobTitle: 'Data Science Intern',
      company: 'AI Solutions Ltd',
      location: 'Mumbai, India',
      type: 'Internship',
      salary: { min: 20000, max: 30000, currency: 'INR', period: 'month' },
      appliedDate: '2024-01-15',
      status: 'rejected',
      statusUpdatedDate: '2024-01-20',
      deadline: '2024-02-15',
      match: 65,
      description: 'Work on machine learning projects and data analysis. Learn from industry experts in AI/ML.',
      requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      applicationNotes: 'Applied despite limited ML experience. Emphasized math background and eagerness to learn.',
      rejectionReason: 'Looking for candidates with more hands-on ML project experience.',
    },
    {
      id: '4',
      jobTitle: 'Full Stack Developer',
      company: 'EduTech Innovation',
      location: 'Hyderabad, India',
      type: 'Full-time',
      salary: { min: 500000, max: 700000, currency: 'INR', period: 'year' },
      appliedDate: '2024-01-12',
      status: 'accepted',
      statusUpdatedDate: '2024-01-24',
      deadline: '2024-02-10',
      match: 95,
      description: 'Build educational technology solutions that impact millions of students. Work with React, Node.js, and cloud technologies.',
      requirements: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      applicationNotes: 'Perfect match for skills and interests. Highlighted education-focused projects.',
      offerDetails: {
        joiningDate: '2024-03-01',
        salary: 650000,
        benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget'],
      },
    },
    {
      id: '5',
      jobTitle: 'Mobile App Developer',
      company: 'MobileFirst Solutions',
      location: 'Chennai, India',
      type: 'Internship',
      salary: { min: 18000, max: 25000, currency: 'INR', period: 'month' },
      appliedDate: '2024-01-10',
      status: 'pending',
      deadline: '2024-02-20',
      match: 78,
      description: 'Develop cross-platform mobile applications using React Native. Work on consumer-facing apps.',
      requirements: ['React Native', 'JavaScript', 'Mobile Development'],
      applicationNotes: 'Applied to expand mobile development skills. Mentioned web development background.',
    },
  ],
};

const statusColors = {
  pending: 'bg-yellow-500',
  shortlisted: 'bg-blue-500', 
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
};

const statusIcons = {
  pending: Icons.clock,
  shortlisted: Icons.star,
  accepted: Icons.checkCircle,
  rejected: Icons.x,
};

export default function ApplicationsPage() {
  const { dbUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const filteredApplications = mockApplicationsData.applications.filter(app => {
    if (selectedTab === 'all') return true;
    return app.status === selectedTab;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'shortlisted':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground">
              Track and manage your job and internship applications
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Icons.plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icons.fileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockApplicationsData.stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Icons.clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{mockApplicationsData.stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Icons.star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{mockApplicationsData.stats.shortlisted}</div>
                  <div className="text-sm text-muted-foreground">Shortlisted</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Icons.checkCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{mockApplicationsData.stats.accepted}</div>
                  <div className="text-sm text-muted-foreground">Accepted</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                  <Icons.x className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{mockApplicationsData.stats.rejected}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({mockApplicationsData.stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({mockApplicationsData.stats.pending})</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted ({mockApplicationsData.stats.shortlisted})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({mockApplicationsData.stats.accepted})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({mockApplicationsData.stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Icons.briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedTab === 'all' 
                      ? "You haven't applied to any positions yet."
                      : `No applications with status "${selectedTab}".`}
                  </p>
                  <Button>
                    <Icons.plus className="h-4 w-4 mr-2" />
                    Add Your First Application
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredApplications.map((application) => {
                  const StatusIcon = statusIcons[application.status];
                  
                  return (
                    <Card key={application.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Icons.briefcase className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                                  <p className="text-muted-foreground">{application.company}</p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <Icons.mapPin className="h-3 w-3" />
                                      {application.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Icons.briefcase className="h-3 w-3" />
                                      {application.type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Icons.calendar className="h-3 w-3" />
                                      Applied {formatDate(application.appliedDate)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={getStatusBadgeVariant(application.status)} className="flex items-center gap-1">
                                    <StatusIcon className="h-3 w-3" />
                                    {application.status}
                                  </Badge>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {application.match}% match
                                  </Badge>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                {application.description}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="font-medium">
                                    {formatCurrency(application.salary.min, application.salary.currency)} - {formatCurrency(application.salary.max, application.salary.currency)}
                                    <span className="text-muted-foreground">/{application.salary.period}</span>
                                  </span>
                                  <span className="text-muted-foreground">
                                    Deadline: {formatDate(application.deadline)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Application Details */}
                        {application.status === 'shortlisted' && application.interviewDate && (
                          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                              <Icons.calendar className="h-4 w-4" />
                              <span className="font-medium">Interview scheduled for {formatDate(application.interviewDate)}</span>
                            </div>
                            {application.nextAction && (
                              <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">{application.nextAction}</p>
                            )}
                          </div>
                        )}

                        {application.status === 'accepted' && application.offerDetails && (
                          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm mb-2">
                              <Icons.checkCircle className="h-4 w-4" />
                              <span className="font-medium">Offer Received!</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Joining Date:</span>
                                <span className="ml-2 font-medium">{formatDate(application.offerDetails.joiningDate)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Salary:</span>
                                <span className="ml-2 font-medium">{formatCurrency(application.offerDetails.salary, 'INR')}/year</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-muted-foreground text-sm">Benefits:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {application.offerDetails.benefits.map((benefit) => (
                                  <Badge key={benefit} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {application.status === 'rejected' && application.rejectionReason && (
                          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-sm mb-2">
                              <Icons.x className="h-4 w-4" />
                              <span className="font-medium">Application Status</span>
                            </div>
                            <p className="text-red-600 dark:text-red-400 text-sm">{application.rejectionReason}</p>
                          </div>
                        )}

                        {/* Skills/Requirements */}
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {application.requirements.map((req) => (
                              <Badge key={req} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Icons.eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {application.status === 'pending' && (
                              <Button variant="outline" size="sm">
                                <Icons.edit className="h-4 w-4 mr-1" />
                                Update Status
                              </Button>
                            )}
                            {application.status === 'accepted' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Icons.check className="h-4 w-4 mr-1" />
                                Accept Offer
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Icons.edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icons.copy className="h-4 w-4 mr-1" />
                              Duplicate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
