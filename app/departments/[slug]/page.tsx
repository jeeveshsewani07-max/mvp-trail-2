'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface DepartmentPageProps {
  params: {
    slug: string;
  };
}

// Mock data based on department
const getDepartmentData = (slug: string) => {
  const departmentMap: Record<string, any> = {
    'computer-science': {
      name: 'Computer Science',
      shortName: 'CSE',
      head: 'Dr. Rajesh Kumar',
      established: '1995',
      students: 312,
      faculty: 24,
      achievements: 1245,
      courses: ['BTech CSE', 'MTech CSE', 'PhD Computer Science'],
      specializations: ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Software Engineering', 'Cybersecurity'],
      labs: ['AI Lab', 'Software Engineering Lab', 'Networks Lab', 'Database Lab'],
      activeProjects: 45,
      publishedPapers: 128,
      industryConnections: 85,
    },
    'electronics': {
      name: 'Electronics',
      shortName: 'ECE',
      head: 'Dr. Kiran Rao',
      established: '1992',
      students: 278,
      faculty: 18,
      achievements: 892,
      courses: ['BTech ECE', 'MTech ECE', 'PhD Electronics'],
      specializations: ['VLSI Design', 'Signal Processing', 'Communications', 'Embedded Systems'],
      labs: ['VLSI Lab', 'Communications Lab', 'Microprocessor Lab', 'Digital Electronics Lab'],
      activeProjects: 32,
      publishedPapers: 89,
      industryConnections: 67,
    },
    'mechanical': {
      name: 'Mechanical',
      shortName: 'ME',
      head: 'Dr. Priyanka Joshi',
      established: '1990',
      students: 298,
      faculty: 22,
      achievements: 756,
      courses: ['BTech ME', 'MTech ME', 'PhD Mechanical Engineering'],
      specializations: ['Robotics', 'Thermodynamics', 'Manufacturing', 'Design Engineering'],
      labs: ['CAD/CAM Lab', 'Thermal Lab', 'Manufacturing Lab', 'Robotics Lab'],
      activeProjects: 38,
      publishedPapers: 76,
      industryConnections: 52,
    },
    'civil': {
      name: 'Civil',
      shortName: 'CE',
      head: 'Dr. Suresh Mehta',
      established: '1988',
      students: 201,
      faculty: 15,
      achievements: 423,
      courses: ['BTech CE', 'MTech CE', 'PhD Civil Engineering'],
      specializations: ['Structural Engineering', 'Transportation', 'Environmental', 'Geotechnical'],
      labs: ['Structural Lab', 'Materials Lab', 'Survey Lab', 'Environmental Lab'],
      activeProjects: 28,
      publishedPapers: 54,
      industryConnections: 34,
    },
    'information-technology': {
      name: 'Information Technology',
      shortName: 'IT',
      head: 'Dr. Anjali Singh',
      established: '2001',
      students: 158,
      faculty: 10,
      achievements: 340,
      courses: ['BTech IT', 'MTech IT'],
      specializations: ['Web Development', 'Mobile Apps', 'Cloud Computing', 'Network Security'],
      labs: ['Web Dev Lab', 'Mobile Lab', 'Cloud Lab', 'Security Lab'],
      activeProjects: 25,
      publishedPapers: 42,
      industryConnections: 48,
    },
  };

  return departmentMap[slug] || {
    name: slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    shortName: slug.toUpperCase().slice(0, 3),
    head: 'Dr. John Doe',
    established: '2000',
    students: 100,
    faculty: 8,
    achievements: 150,
    courses: ['BTech', 'MTech'],
    specializations: ['General'],
    labs: ['Main Lab'],
    activeProjects: 10,
    publishedPapers: 20,
    industryConnections: 15,
  };
};

// Mock students and faculty data
const getMockStudents = (count: number) => {
  const students = [];
  const names = ['Aarav Sharma', 'Priya Patel', 'Rahul Gupta', 'Sneha Reddy', 'Vikash Singh', 'Anita Kumar'];
  
  for (let i = 0; i < Math.min(count, 20); i++) {
    students.push({
      id: `${i + 1}`,
      name: names[i % names.length],
      rollNumber: `${Date.now().toString().slice(-6)}${i.toString().padStart(3, '0')}`,
      year: ['1st Year', '2nd Year', '3rd Year', '4th Year'][i % 4],
      cgpa: (7.5 + Math.random() * 2.5).toFixed(1),
      achievements: Math.floor(Math.random() * 20),
      status: ['active', 'active', 'active', 'needs_attention'][i % 4],
    });
  }
  return students;
};

const getMockFaculty = (count: number) => {
  const faculty = [];
  const names = ['Dr. Rajesh Kumar', 'Dr. Priya Singh', 'Prof. Suresh Mehta', 'Dr. Kiran Rao'];
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor'];
  
  for (let i = 0; i < Math.min(count, 10); i++) {
    faculty.push({
      id: `${i + 1}`,
      name: names[i % names.length],
      designation: designations[i % 3],
      specialization: ['AI/ML', 'Software Engineering', 'Data Science', 'Networks'][i % 4],
      experience: `${8 + Math.floor(Math.random() * 15)} years`,
      mentees: Math.floor(Math.random() * 20),
      publications: Math.floor(Math.random() * 30),
    });
  }
  return faculty;
};

export default function DepartmentPage({ params }: DepartmentPageProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  
  const dept = getDepartmentData(params.slug);
  const students = getMockStudents(dept.students);
  const faculty = getMockFaculty(dept.faculty);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.includes(searchQuery) ||
    (selectedYear === 'All Years' || student.year === selectedYear)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800';
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
              <Link href="/dashboard">
                <Icons.arrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{dept.name} Department</h1>
              <p className="text-muted-foreground">
                {dept.shortName} • Established {dept.established} • Head: {dept.head}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icons.download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Icons.settings className="h-4 w-4 mr-2" />
              Manage Department
            </Button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dept.students}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dept.faculty}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{dept.achievements}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dept.activeProjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Publications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{dept.publishedPapers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Industry Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{dept.industryConnections}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Programs Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dept.courses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-medium">{course}</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dept.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Student Satisfaction</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Placement Rate</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Research Output</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Department Students</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Years">All Years</SelectItem>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredStudents.slice(0, 10).map((student) => (
                <Card key={student.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icons.user className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{student.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Roll: {student.rollNumber}</span>
                            <span>{student.year}</span>
                            <span>CGPA: {student.cgpa}</span>
                            <span>{student.achievements} achievements</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/students/${student.id}`}>
                            <Icons.eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredStudents.length > 10 && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-muted-foreground mb-2">
                      Showing 10 of {filteredStudents.length} students
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/students">
                        View All Students
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="faculty" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Department Faculty</h3>
              <Button asChild>
                <Link href="/faculty">
                  <Icons.users className="h-4 w-4 mr-2" />
                  View All Faculty
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {faculty.map((member) => (
                <Card key={member.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Icons.userCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{member.designation}</span>
                            <span>{member.specialization}</span>
                            <span>{member.experience}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{member.mentees} mentees</span>
                            <span>{member.publications} publications</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Icons.messageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icons.eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Laboratories</CardTitle>
                  <CardDescription>Specialized labs available in the department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dept.labs.map((lab, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icons.cpu className="h-5 w-5 text-primary" />
                          <span className="font-medium">{lab}</span>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>Available resources and equipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Computers/Workstations</span>
                    <span className="font-semibold">120+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Software Licenses</span>
                    <span className="font-semibold">50+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Research Equipment</span>
                    <span className="font-semibold">25+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Library Books</span>
                    <span className="font-semibold">2,500+</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Industry Partnerships</CardTitle>
                <CardDescription>Companies and organizations we collaborate with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Google', 'Microsoft', 'Amazon', 'IBM', 'Intel', 'Samsung', 'TCS', 'Infosys'].map((company) => (
                    <div key={company} className="text-center p-3 border rounded-lg">
                      <div className="font-medium">{company}</div>
                      <div className="text-xs text-muted-foreground">Partner</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
