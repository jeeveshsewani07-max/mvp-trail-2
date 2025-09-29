'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';
import Link from 'next/link';

// Mock departments data
const departments = [
  {
    slug: 'computer-science',
    name: 'Computer Science',
    shortName: 'CSE',
    head: 'Dr. Rajesh Kumar',
    students: 312,
    faculty: 24,
    achievements: 1245,
    established: '1995',
    courses: 5,
    labs: 4,
    description: 'Leading department in software engineering, AI/ML, and computer systems.',
    performance: {
      placement: 96,
      research: 89,
      satisfaction: 92
    }
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    shortName: 'ECE',
    head: 'Dr. Kiran Rao',
    students: 278,
    faculty: 18,
    achievements: 892,
    established: '1992',
    courses: 4,
    labs: 4,
    description: 'Excellence in VLSI design, signal processing, and embedded systems.',
    performance: {
      placement: 94,
      research: 85,
      satisfaction: 88
    }
  },
  {
    slug: 'mechanical',
    name: 'Mechanical',
    shortName: 'ME',
    head: 'Dr. Priyanka Joshi',
    students: 298,
    faculty: 22,
    achievements: 756,
    established: '1990',
    courses: 4,
    labs: 5,
    description: 'Innovative programs in robotics, manufacturing, and thermal engineering.',
    performance: {
      placement: 91,
      research: 78,
      satisfaction: 85
    }
  },
  {
    slug: 'civil',
    name: 'Civil',
    shortName: 'CE',
    head: 'Dr. Suresh Mehta',
    students: 201,
    faculty: 15,
    achievements: 423,
    established: '1988',
    courses: 3,
    labs: 4,
    description: 'Strong foundation in structural, environmental, and transportation engineering.',
    performance: {
      placement: 87,
      research: 72,
      satisfaction: 83
    }
  },
  {
    slug: 'information-technology',
    name: 'Information Technology',
    shortName: 'IT',
    head: 'Dr. Anjali Singh',
    students: 158,
    faculty: 10,
    achievements: 340,
    established: '2001',
    courses: 3,
    labs: 3,
    description: 'Modern curriculum focused on web development, mobile apps, and cybersecurity.',
    performance: {
      placement: 93,
      research: 76,
      satisfaction: 90
    }
  }
];

const stats = {
  totalDepartments: departments.length,
  totalStudents: departments.reduce((sum, dept) => sum + dept.students, 0),
  totalFaculty: departments.reduce((sum, dept) => sum + dept.faculty, 0),
  totalAchievements: departments.reduce((sum, dept) => sum + dept.achievements, 0),
  averagePlacement: Math.round(departments.reduce((sum, dept) => sum + dept.performance.placement, 0) / departments.length),
};

export default function DepartmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground mt-2">
              Manage and overview all academic departments
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Icons.download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Icons.plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.totalDepartments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalFaculty}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalAchievements}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg Placement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.averagePlacement}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Departments Grid */}
        <div className="grid gap-6">
          {departments.map((dept) => (
            <Card key={dept.slug} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {dept.shortName}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{dept.name}</h3>
                        <Badge variant="outline">Est. {dept.established}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{dept.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{dept.students}</div>
                          <div className="text-sm text-muted-foreground">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{dept.faculty}</div>
                          <div className="text-sm text-muted-foreground">Faculty</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{dept.achievements}</div>
                          <div className="text-sm text-muted-foreground">Achievements</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{dept.labs}</div>
                          <div className="text-sm text-muted-foreground">Labs</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Placement Rate</span>
                          <span className="font-medium">{dept.performance.placement}%</span>
                        </div>
                        <Progress value={dept.performance.placement} className="h-2" />
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span>Research: <span className="font-medium">{dept.performance.research}%</span></span>
                          <span>Satisfaction: <span className="font-medium">{dept.performance.satisfaction}%</span></span>
                          <span>Head: <span className="font-medium">{dept.head}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button asChild>
                      <Link href={`/departments/${dept.slug}`}>
                        <Icons.eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icons.users className="h-4 w-4 mr-2" />
                      Students
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icons.userCheck className="h-4 w-4 mr-2" />
                      Faculty
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icons.barChart className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common department management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start">
                <Icons.users className="h-4 w-4 mr-2" />
                Manage Faculty Allocation
              </Button>
              <Button variant="outline" className="justify-start">
                <Icons.calendar className="h-4 w-4 mr-2" />
                Schedule Department Meetings
              </Button>
              <Button variant="outline" className="justify-start">
                <Icons.fileText className="h-4 w-4 mr-2" />
                Generate Performance Reports
              </Button>
              <Button variant="outline" className="justify-start">
                <Icons.settings className="h-4 w-4 mr-2" />
                Update Department Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
