'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { formatDate, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

// Mock jobs data
const mockJobsData = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechStart India',
    location: 'Bangalore, Karnataka',
    type: 'Internship',
    mode: 'Hybrid',
    salary: { min: 25000, max: 35000, currency: 'INR', period: 'month' },
    experience: 'Entry Level',
    postedDate: '2024-01-20',
    applicationDeadline: '2024-02-20',
    description: 'Join our dynamic team as a Frontend Developer Intern and work on cutting-edge web applications using React, TypeScript, and modern development tools.',
    requirements: ['React.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git'],
    benefits: ['Flexible working hours', 'Learning stipend', 'Mentorship program', 'Certificate of completion'],
    applicants: 45,
    views: 234,
    status: 'open',
    matchScore: 95,
    companyLogo: '/logos/techstart.png',
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'InnovateTech Solutions',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    mode: 'Remote',
    salary: { min: 600000, max: 800000, currency: 'INR', period: 'year' },
    experience: '2-4 years',
    postedDate: '2024-01-18',
    applicationDeadline: '2024-02-25',
    description: 'We are looking for a passionate Full Stack Developer to join our team. You will be working on both front-end and back-end development of our web applications.',
    requirements: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'AWS', 'Docker'],
    benefits: ['Health insurance', 'Work from home', '5-day work week', 'Stock options', 'Learning budget'],
    applicants: 78,
    views: 456,
    status: 'open',
    matchScore: 88,
    companyLogo: '/logos/innovatetech.png',
  },
  {
    id: '3',
    title: 'Data Science Intern',
    company: 'AI Analytics Corp',
    location: 'Hyderabad, Telangana',
    type: 'Internship',
    mode: 'On-site',
    salary: { min: 20000, max: 30000, currency: 'INR', period: 'month' },
    experience: 'Entry Level',
    postedDate: '2024-01-22',
    applicationDeadline: '2024-02-15',
    description: 'Exciting opportunity for aspiring data scientists to work with real-world datasets and machine learning models in healthcare and fintech domains.',
    requirements: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'SQL', 'Jupyter Notebooks'],
    benefits: ['Industry exposure', 'Project ownership', 'Recommendation letters', 'Flexible hours'],
    applicants: 67,
    views: 189,
    status: 'open',
    matchScore: 92,
    companyLogo: '/logos/ai-analytics.png',
  },
  {
    id: '4',
    title: 'Mobile App Developer',
    company: 'StartupHub',
    location: 'Pune, Maharashtra',
    type: 'Contract',
    mode: 'Hybrid',
    salary: { min: 450000, max: 650000, currency: 'INR', period: 'year' },
    experience: '1-3 years',
    postedDate: '2024-01-19',
    applicationDeadline: '2024-02-10',
    description: 'Join our mobile development team and help build the next generation of mobile applications for our startup ecosystem.',
    requirements: ['React Native', 'Flutter', 'iOS/Android', 'Firebase', 'REST APIs'],
    benefits: ['Flexible schedule', 'Startup equity', 'Modern tech stack', 'Young team'],
    applicants: 34,
    views: 167,
    status: 'closing_soon',
    matchScore: 85,
    companyLogo: '/logos/startuphub.png',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech Systems',
    location: 'Delhi, NCR',
    type: 'Full-time',
    mode: 'On-site',
    salary: { min: 800000, max: 1200000, currency: 'INR', period: 'year' },
    experience: '3-5 years',
    postedDate: '2024-01-15',
    applicationDeadline: '2024-02-28',
    description: 'Looking for an experienced DevOps Engineer to manage our cloud infrastructure and automate deployment processes.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux'],
    benefits: ['Premium health insurance', 'Annual bonus', 'Tech conferences', 'Career growth'],
    applicants: 23,
    views: 145,
    status: 'open',
    matchScore: 78,
    companyLogo: '/logos/cloudtech.png',
  },
  {
    id: '6',
    title: 'UI/UX Design Intern',
    company: 'DesignStudio Pro',
    location: 'Chennai, Tamil Nadu',
    type: 'Internship',
    mode: 'Remote',
    salary: { min: 15000, max: 25000, currency: 'INR', period: 'month' },
    experience: 'Entry Level',
    postedDate: '2024-01-21',
    applicationDeadline: '2024-02-18',
    description: 'Creative UI/UX Design internship focusing on user experience design for web and mobile applications.',
    requirements: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
    benefits: ['Portfolio development', 'Design tools access', 'Mentorship', 'Remote work'],
    applicants: 89,
    views: 278,
    status: 'open',
    matchScore: 90,
    companyLogo: '/logos/designstudio.png',
  },
];

const jobCategories = ['All', 'Full-time', 'Internship', 'Contract', 'Part-time'];
const workModes = ['All', 'Remote', 'On-site', 'Hybrid'];
const experiences = ['All', 'Entry Level', '1-3 years', '2-4 years', '3-5 years', '5+ years'];

export default function JobsPage() {
  const [selectedTab, setSelectedTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const handleApply = async (jobId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppliedJobs(prev => [...prev, jobId]);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const filteredJobs = mockJobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.type === selectedCategory;
    const matchesMode = selectedMode === 'All' || job.mode === selectedMode;
    const matchesExperience = selectedExperience === 'All' || job.experience === selectedExperience;
    
    return matchesSearch && matchesCategory && matchesMode && matchesExperience;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="secondary" className="text-green-600">Open</Badge>;
      case 'closing_soon': return <Badge variant="destructive">Closing Soon</Badge>;
      case 'closed': return <Badge variant="outline">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const isApplied = (jobId: string) => appliedJobs.includes(jobId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Opportunities</h1>
            <p className="text-muted-foreground">
              Discover and apply for internships and full-time positions
            </p>
          </div>
          <Button variant="outline">
            <Icons.fileText className="h-4 w-4 mr-2" />
            View My Applications
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <Input
                      placeholder="Search jobs, companies, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedMode} onValueChange={setSelectedMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Work Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {workModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experiences.map((exp) => (
                        <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Jobs List */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {job.company.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            {getStatusBadge(job.status)}
                            <Badge className={`text-xs ${getMatchScoreColor(job.matchScore)}`}>
                              {job.matchScore}% match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="font-medium">{job.company}</span>
                            <span className="flex items-center gap-1">
                              <Icons.mapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icons.briefcase className="h-3 w-3" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icons.monitor className="h-3 w-3" />
                              {job.mode}
                            </span>
                          </div>
                          <p className="text-sm mb-3 leading-relaxed">{job.description}</p>
                          
                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.requirements.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <span>Posted: {formatDate(job.postedDate)}</span>
                            <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                            <span>{job.applicants} applicants</span>
                            <span>{job.views} views</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className="text-lg font-bold text-primary mb-2">
                          ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mb-3">
                          per {job.salary.period}
                        </div>
                        <div className="flex flex-col gap-2">
                          {isApplied(job.id) ? (
                            <Button disabled className="w-full">
                              <Icons.check className="h-4 w-4 mr-2" />
                              Applied
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleApply(job.id)}
                              className="w-full"
                            >
                              <Icons.send className="h-4 w-4 mr-2" />
                              Apply Now
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Icons.bookmark className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Icons.gift className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Benefits:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Icons.briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters to find more opportunities.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <Card>
              <CardContent className="py-12 text-center">
                <Icons.target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Personalized Recommendations</h3>
                <p className="text-muted-foreground">
                  Complete your profile to get personalized job recommendations based on your skills and interests.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/profile">
                    Complete Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardContent className="py-12 text-center">
                <Icons.bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No saved jobs</h3>
                <p className="text-muted-foreground">
                  Save interesting job opportunities to review them later.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
