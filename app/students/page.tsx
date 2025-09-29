'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

// Mock data for students
const mockStudents = [
  {
    id: '1',
    rollNumber: 'CS2021001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@university.edu',
    department: 'Computer Science',
    year: '4th Year',
    semester: '8th',
    cgpa: 8.5,
    achievements: 12,
    totalCredits: 85,
    profileComplete: 95,
    status: 'active',
    lastActive: '2024-01-22',
    mentor: 'Dr. Rajesh Kumar',
    profileImage: null,
  },
  {
    id: '2',
    rollNumber: 'CS2021002',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    department: 'Computer Science',
    year: '3rd Year',
    semester: '6th',
    cgpa: 9.1,
    achievements: 18,
    totalCredits: 120,
    profileComplete: 88,
    status: 'active',
    lastActive: '2024-01-21',
    mentor: 'Dr. Anjali Singh',
    profileImage: null,
  },
  {
    id: '3',
    rollNumber: 'CS2022015',
    name: 'Rahul Gupta',
    email: 'rahul.gupta@university.edu',
    department: 'Computer Science',
    year: '2nd Year',
    semester: '4th',
    cgpa: 7.8,
    achievements: 6,
    totalCredits: 35,
    profileComplete: 65,
    status: 'needs_attention',
    lastActive: '2024-01-15',
    mentor: 'Dr. Suresh Mehta',
    profileImage: null,
  },
  {
    id: '4',
    rollNumber: 'EC2021008',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@university.edu',
    department: 'Electronics',
    year: '4th Year',
    semester: '7th',
    cgpa: 8.9,
    achievements: 14,
    totalCredits: 92,
    profileComplete: 92,
    status: 'active',
    lastActive: '2024-01-20',
    mentor: 'Dr. Kiran Rao',
    profileImage: null,
  },
];

const departments = ['All Departments', 'Computer Science', 'Electronics', 'Mechanical', 'Civil'];
const years = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const statuses = ['All Status', 'active', 'needs_attention', 'inactive'];

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedTab, setSelectedTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || student.department === selectedDepartment;
    const matchesYear = selectedYear === 'All Years' || student.year === selectedYear;
    const matchesStatus = selectedStatus === 'All Status' || student.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesYear && matchesStatus;
  });

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    needsAttention: students.filter(s => s.status === 'needs_attention').length,
    averageCgpa: (students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(1),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor all students in your institution
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Icons.download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Icons.userPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Icons.graduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Icons.userCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
              <Icons.alertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.needsAttention}</div>
              <p className="text-xs text-muted-foreground">Require follow-up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
              <Icons.trendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.averageCgpa}</div>
              <p className="text-xs text-muted-foreground">Institution average</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search by name, roll number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <CardDescription>All registered students in your institution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icons.user className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{student.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(student.status)}`}>
                            {student.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <span>Roll: {student.rollNumber}</span>
                          <span>{student.department}</span>
                          <span>{student.year}</span>
                          <span>CGPA: {student.cgpa}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mt-1">
                          <span>{student.achievements} achievements</span>
                          <span>{student.totalCredits} credits</span>
                          <span>Profile: {student.profileComplete}%</span>
                          <span>Mentor: {student.mentor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/students/${student.id}`}>
                          <Icons.eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.messageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
