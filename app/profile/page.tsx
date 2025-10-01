'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

// Role selection component for onboarding
const RoleSelection = ({
  onRoleSelect,
  selectedRole,
}: {
  onRoleSelect: (role: string) => void;
  selectedRole: string;
}) => {
  const roles = [
    {
      id: 'student',
      title: 'Student',
      description:
        'Build your verified digital portfolio, discover opportunities, and track your achievements.',
      icon: Icons.graduationCap,
    },
    {
      id: 'faculty',
      title: 'Faculty / Mentor',
      description:
        'Guide students, approve achievements, and create impactful events.',
      icon: Icons.user,
    },
    {
      id: 'recruiter',
      title: 'Recruiter',
      description: 'Find top talent with verified skills and achievements.',
      icon: Icons.briefcase,
    },
    {
      id: 'institution_admin',
      title: 'Institution Admin',
      description:
        "Manage your institution's presence and get comprehensive analytics.",
      icon: Icons.building,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {roles.map((role) => {
        const IconComponent = role.icon;
        return (
          <Card
            key={role.id}
            className={`glass-card card-hover cursor-pointer relative overflow-hidden group ${
              selectedRole === role.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onRoleSelect(role.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="relative">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{role.title}</CardTitle>
              <CardDescription className="text-base">
                {role.description}
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

// Student onboarding form
const StudentOnboardingForm = ({
  onComplete,
  user,
}: {
  onComplete: () => void;
  user: any;
}) => {
  const [formData, setFormData] = useState({
    institution: '',
    department: '',
    rollNumber: '',
    batch: '',
    course: '',
    currentYear: 1,
    currentSemester: 1,
    skills: [] as string[],
    interests: [] as string[],
    languages: ['English'] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

  const skillOptions = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'C#',
    'HTML',
    'CSS',
    'SQL',
    'MongoDB',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Git',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create student profile
      const { error } = await supabase.from('profiles').insert({
        user_id: user.id,
        institution_id: formData.institution,
        roll_number: formData.rollNumber,
        batch: formData.batch,
        course: formData.course,
        current_year: formData.currentYear,
        current_semester: formData.currentSemester,
        skills: formData.skills,
        interests: formData.interests,
        languages: formData.languages,
        is_profile_complete: true,
      });

      if (error) throw error;

      toast.success('Profile completed successfully!');
      onComplete();
    } catch (error: any) {
      toast.error('Failed to save profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            placeholder="e.g., IIT Delhi"
            value={formData.institution}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, institution: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="e.g., Computer Science"
            value={formData.department}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, department: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rollNumber">Roll Number</Label>
          <Input
            id="rollNumber"
            placeholder="e.g., CS2022001"
            value={formData.rollNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, rollNumber: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="batch">Batch</Label>
          <Input
            id="batch"
            placeholder="e.g., 2021-2025"
            value={formData.batch}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, batch: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Input
            id="course"
            placeholder="e.g., B.Tech"
            value={formData.course}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, course: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentYear">Current Year</Label>
          <Select
            value={formData.currentYear.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, currentYear: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  Year {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentSemester">Current Semester</Label>
          <Select
            value={formData.currentSemester.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                currentSemester: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.check className="mr-2 h-4 w-4" />
        )}
        Complete Profile
      </Button>
    </form>
  );
};

// Faculty onboarding form
const FacultyOnboardingForm = ({
  onComplete,
  user,
}: {
  onComplete: () => void;
  user: any;
}) => {
  const [formData, setFormData] = useState({
    institution: '',
    department: '',
    designation: '',
    specialization: '',
    qualifications: [] as string[],
    experience: 0,
    researchAreas: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

  const qualificationOptions = [
    'PhD',
    'M.Tech',
    'M.Sc',
    'ME',
    'MBA',
    'B.Tech',
    'B.Sc',
    'BE',
  ];
  const researchAreaOptions = [
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Computer Networks',
    'Cybersecurity',
    'Software Engineering',
    'Database Systems',
    'Cloud Computing',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create faculty profile
      const { error } = await supabase.from('faculty_profiles').insert({
        user_id: user.id,
        institution_id: formData.institution,
        department_id: formData.department,
        designation: formData.designation,
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        experience: formData.experience,
        research_areas: formData.researchAreas,
      });

      if (error) throw error;

      toast.success('Profile completed successfully!');
      onComplete();
    } catch (error: any) {
      toast.error('Failed to save profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            placeholder="e.g., IIT Delhi"
            value={formData.institution}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, institution: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="e.g., Computer Science"
            value={formData.department}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, department: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            placeholder="e.g., Assistant Professor"
            value={formData.designation}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, designation: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Select
            value={formData.experience.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, experience: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i} {i === 1 ? 'year' : 'years'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          placeholder="e.g., Machine Learning, AI"
          value={formData.specialization}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, specialization: e.target.value }))
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.check className="mr-2 h-4 w-4" />
        )}
        Complete Profile
      </Button>
    </form>
  );
};

// Recruiter onboarding form
const RecruiterOnboardingForm = ({
  onComplete,
  user,
}: {
  onComplete: () => void;
  user: any;
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    designation: '',
    companyWebsite: '',
    industry: '',
    companySize: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Media & Entertainment',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create recruiter profile
      const { error } = await supabase.from('recruiter_profiles').insert({
        profile_id: user.id,
        company_name: formData.companyName,
        designation: formData.designation,
        company_website: formData.companyWebsite || null,
        industry: formData.industry,
        company_size: formData.companySize || null,
      });

      if (error) throw error;

      toast.success('Profile completed successfully!');
      onComplete();
    } catch (error: any) {
      toast.error('Failed to save profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input
              id="companyWebsite"
              type="url"
              placeholder="https://company.com"
              value={formData.companyWebsite}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  companyWebsite: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, industry: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Select
              value={formData.companySize}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, companySize: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-1000">201-1000 employees</SelectItem>
                <SelectItem value="1000+">1000+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Your Designation</Label>
          <Input
            id="designation"
            placeholder="e.g., HR Manager, Talent Acquisition"
            value={formData.designation}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, designation: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.check className="mr-2 h-4 w-4" />
        )}
        Complete Profile
      </Button>
    </form>
  );
};

// Institution admin onboarding form
const InstitutionOnboardingForm = ({
  onComplete,
  user,
}: {
  onComplete: () => void;
  user: any;
}) => {
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionCode: '',
    type: '',
    website: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const institutionTypes = [
    'University',
    'College',
    'Institute',
    'Technical College',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create institution
      const { error } = await supabase.from('institutions').insert({
        name: formData.institutionName,
        code: formData.institutionCode,
        type: formData.type,
        website: formData.website || null,
      });

      if (error) throw error;

      toast.success('Institution profile completed successfully!');
      onComplete();
    } catch (error: any) {
      toast.error('Failed to save profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Institution Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">Institution Name</Label>
            <Input
              id="institutionName"
              placeholder="Enter institution name"
              value={formData.institutionName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  institutionName: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institutionCode">Institution Code</Label>
            <Input
              id="institutionCode"
              placeholder="e.g., IIT001"
              value={formData.institutionCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  institutionCode: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Institution Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {institutionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://institution.edu"
              value={formData.website}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, website: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.check className="mr-2 h-4 w-4" />
        )}
        Complete Profile
      </Button>
    </form>
  );
};

export default function ProfilePage() {
  const { user, dbUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding (new user or incomplete profile)
    if (user && dbUser) {
      // For now, assume new users need onboarding
      // In a real app, you'd check if they have completed their profile
      setIsOnboarding(true);
    }
  }, [user, dbUser]);

  const handleRoleSelect = async (role: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Update user role in auth metadata
      const { error } = await supabase.auth.updateUser({
        data: { role },
      });

      if (error) {
        console.error('Failed to update role:', error.message);
      }

      setSelectedRole(role);
      toast.success('Role selected! Please complete your profile.');
    } catch (error: any) {
      toast.error('Failed to save role: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboarding(false);
    toast.success('Profile completed successfully!');
  };

  if (isOnboarding && !selectedRole) {
    return (
      <DashboardLayout>
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center mb-8 pt-12">
            <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Icons.graduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Smart Student Hub!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Let's set up your account
            </p>
          </div>

          <RoleSelection
            onRoleSelect={handleRoleSelect}
            selectedRole={selectedRole}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (isOnboarding && selectedRole) {
    return (
      <DashboardLayout>
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Icons.graduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Help us personalize your experience
            </p>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedRole === 'student' && (
                  <Icons.graduationCap className="h-5 w-5" />
                )}
                {selectedRole === 'faculty' && (
                  <Icons.user className="h-5 w-5" />
                )}
                {selectedRole === 'recruiter' && (
                  <Icons.briefcase className="h-5 w-5" />
                )}
                {selectedRole === 'institution_admin' && (
                  <Icons.building className="h-5 w-5" />
                )}
                {selectedRole === 'student' && 'Student Profile'}
                {selectedRole === 'faculty' && 'Faculty Profile'}
                {selectedRole === 'recruiter' && 'Recruiter Profile'}
                {selectedRole === 'institution_admin' && 'Institution Profile'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRole === 'student' && (
                <StudentOnboardingForm
                  user={user}
                  onComplete={handleOnboardingComplete}
                />
              )}
              {selectedRole === 'faculty' && (
                <FacultyOnboardingForm
                  user={user}
                  onComplete={handleOnboardingComplete}
                />
              )}
              {selectedRole === 'recruiter' && (
                <RecruiterOnboardingForm
                  user={user}
                  onComplete={handleOnboardingComplete}
                />
              )}
              {selectedRole === 'institution_admin' && (
                <InstitutionOnboardingForm
                  user={user}
                  onComplete={handleOnboardingComplete}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Regular profile management for existing users
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsOnboarding(true)}>
            <Icons.edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your profile is complete. You can edit it anytime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {dbUser?.fullName || 'Not set'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">
                    {dbUser?.email || 'Not set'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <p className="text-sm text-muted-foreground capitalize">
                    {dbUser?.role?.replace('_', ' ') || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
