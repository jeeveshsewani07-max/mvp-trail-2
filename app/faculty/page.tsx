'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock data for faculty
const mockFaculty = [
  {
    id: '1',
    employeeId: 'FAC001',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@university.edu',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Artificial Intelligence',
    joiningDate: '2015-08-15',
    experience: '18 years',
    qualification: 'PhD Computer Science',
    mentees: 12,
    achievements: 45,
    eventsCreated: 8,
    status: 'active',
    lastActive: '2024-01-22',
    profileImage: null,
  },
  {
    id: '2',
    employeeId: 'FAC002',
    name: 'Dr. Anjali Singh',
    email: 'anjali.singh@university.edu',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Machine Learning',
    joiningDate: '2018-07-20',
    experience: '12 years',
    qualification: 'PhD Computer Science',
    mentees: 15,
    achievements: 38,
    eventsCreated: 6,
    status: 'active',
    lastActive: '2024-01-21',
    profileImage: null,
  },
  {
    id: '3',
    employeeId: 'FAC003',
    name: 'Prof. Suresh Mehta',
    email: 'suresh.mehta@university.edu',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Data Structures',
    joiningDate: '2020-01-10',
    experience: '8 years',
    qualification: 'M.Tech Computer Science',
    mentees: 8,
    achievements: 22,
    eventsCreated: 4,
    status: 'active',
    lastActive: '2024-01-20',
    profileImage: null,
  },
  {
    id: '4',
    employeeId: 'FAC004',
    name: 'Dr. Kiran Rao',
    email: 'kiran.rao@university.edu',
    department: 'Electronics',
    designation: 'Professor',
    specialization: 'VLSI Design',
    joiningDate: '2012-03-25',
    experience: '22 years',
    qualification: 'PhD Electronics',
    mentees: 18,
    achievements: 52,
    eventsCreated: 12,
    status: 'active',
    lastActive: '2024-01-19',
    profileImage: null,
  },
  {
    id: '5',
    employeeId: 'FAC005',
    name: 'Dr. Priyanka Joshi',
    email: 'priyanka.joshi@university.edu',
    department: 'Mechanical',
    designation: 'Associate Professor',
    specialization: 'Robotics',
    joiningDate: '2019-09-12',
    experience: '10 years',
    qualification: 'PhD Mechanical Engineering',
    mentees: 10,
    achievements: 28,
    eventsCreated: 5,
    status: 'on_leave',
    lastActive: '2024-01-10',
    profileImage: null,
  },
];

const departments = ['All Departments', 'Computer Science', 'Electronics', 'Mechanical', 'Civil'];
const designations = ['All Designations', 'Professor', 'Associate Professor', 'Assistant Professor'];
const statuses = ['All Status', 'active', 'on_leave', 'inactive'];

export default function FacultyPage() {
  const [faculty, setFaculty] = useState(mockFaculty);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedDesignation, setSelectedDesignation] = useState('All Designations');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  
  // Add Faculty Dialog state
  const [addFacultyDialogOpen, setAddFacultyDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for new faculty
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    designation: '',
    qualification: '',
    specialization: '',
    experience: '',
    bio: '',
  });
  
  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewFaculty(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle form submission
  const handleAddFaculty = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!newFaculty.name || !newFaculty.email || !newFaculty.employeeId || !newFaculty.department || !newFaculty.designation) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Create new faculty member
      const facultyMember = {
        id: String(faculty.length + 1),
        ...newFaculty,
        status: 'active',
        joiningDate: new Date().toISOString(),
        mentees: 0,
        achievements: 0,
        eventsCreated: 0,
      };
      
      // Add to faculty list
      setFaculty(prev => [...prev, facultyMember]);
      
      // Reset form
      setNewFaculty({
        name: '',
        email: '',
        employeeId: '',
        department: '',
        designation: '',
        qualification: '',
        specialization: '',
        experience: '',
        bio: '',
      });
      
      // Close dialog
      setAddFacultyDialogOpen(false);
      
      toast.success(`Faculty member ${newFaculty.name} added successfully!`);
      
    } catch (error: any) {
      console.error('Error adding faculty:', error);
      toast.error('Failed to add faculty member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || member.department === selectedDepartment;
    const matchesDesignation = selectedDesignation === 'All Designations' || member.designation === selectedDesignation;
    const matchesStatus = selectedStatus === 'All Status' || member.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesDesignation && matchesStatus;
  });

  const stats = {
    total: faculty.length,
    active: faculty.filter(f => f.status === 'active').length,
    onLeave: faculty.filter(f => f.status === 'on_leave').length,
    totalMentees: faculty.reduce((sum, f) => sum + f.mentees, 0),
    totalEvents: faculty.reduce((sum, f) => sum + f.eventsCreated, 0),
    totalAchievements: faculty.reduce((sum, f) => sum + f.achievements, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Faculty Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor all faculty members in your institution
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Icons.download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => setAddFacultyDialogOpen(true)}>
              <Icons.userPlus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.onLeave}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Mentees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalMentees}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Events Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalEvents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalAchievements}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search faculty members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search by name, ID, email, or specialization..."
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
              <Select value={selectedDesignation} onValueChange={setSelectedDesignation}>
                <SelectTrigger>
                  <SelectValue placeholder="Designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((designation) => (
                    <SelectItem key={designation} value={designation}>{designation}</SelectItem>
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

        {/* Faculty List */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Members ({filteredFaculty.length})</CardTitle>
            <CardDescription>All faculty members in your institution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFaculty.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icons.userCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(member.status)}`}>
                            {member.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <span>ID: {member.employeeId}</span>
                          <span>{member.designation}</span>
                          <span>{member.department}</span>
                          <span>{member.specialization}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mt-1">
                          <span>{member.mentees} mentees</span>
                          <span>{member.achievements} achievements</span>
                          <span>{member.eventsCreated} events</span>
                          <span>Joined: {formatDate(member.joiningDate)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span>{member.qualification} • {member.experience}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/faculty/${member.id}`}>
                          <Icons.eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/faculty/${member.id}/mentees`}>
                          <Icons.users className="h-4 w-4 mr-1" />
                          Mentees
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Faculty Dialog */}
      <Dialog open={addFacultyDialogOpen} onOpenChange={setAddFacultyDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Faculty Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new faculty member to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newFaculty.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Dr. John Smith"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newFaculty.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.smith@university.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  value={newFaculty.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  placeholder="FAC001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={newFaculty.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  placeholder="Ph.D. in Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={newFaculty.department} 
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="designation">Designation *</Label>
                <Select 
                  value={newFaculty.designation} 
                  onValueChange={(value) => handleInputChange('designation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newFaculty.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="Machine Learning, AI"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={newFaculty.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="10 years"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio/Description</Label>
              <Textarea
                id="bio"
                value={newFaculty.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Brief description about the faculty member..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFacultyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFaculty} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Icons.userPlus className="mr-2 h-4 w-4" />
                  Add Faculty
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
