'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

// Mock profile data - would come from database
const mockProfileData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1999-05-15',
    bio: 'Computer Science student passionate about AI and web development. Always eager to learn new technologies and work on innovative projects.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
  },
  academic: {
    institution: 'University of Technology',
    department: 'Computer Science',
    year: '3rd Year',
    gpa: '3.85',
    expectedGraduation: '2025-05-15',
    studentId: 'CS2022001',
  },
  professional: {
    currentPosition: 'Software Engineering Intern',
    company: 'TechCorp Inc.',
    experience: [
      {
        title: 'Frontend Developer Intern',
        company: 'StartupXYZ',
        duration: 'Jun 2023 - Aug 2023',
        description: 'Developed responsive web applications using React and TypeScript.',
      },
      {
        title: 'Teaching Assistant',
        company: 'University of Technology',
        duration: 'Jan 2023 - May 2023',
        description: 'Assisted in Data Structures and Algorithms course for 50+ students.',
      },
    ],
  },
  skills: {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB'],
    soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management'],
    languages: ['English (Native)', 'Spanish (Intermediate)', 'French (Beginner)'],
  },
  preferences: {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowRecruiterContact: true,
    emailNotifications: true,
    achievementNotifications: true,
  },
};

export default function ProfilePage() {
  const { dbUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(mockProfileData);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const addSkill = (category: 'technical' | 'soft' | 'languages', skill: string) => {
    if (skill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()],
        },
      }));
    }
  };

  const removeSkill = (category: 'technical' | 'soft' | 'languages', index: number) => {
    setProfileData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }));
  };

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
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icons.check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Icons.edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.personalInfo.location}
                    onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, State/Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.personalInfo.website}
                    onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.personalInfo.bio}
                  onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                        <Icons.linkedin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="linkedin"
                        value={profileData.personalInfo.linkedin}
                        onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                        disabled={!isEditing}
                        placeholder="https://linkedin.com/in/username"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                        <Icons.github className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="github"
                        value={profileData.personalInfo.github}
                        onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)}
                        disabled={!isEditing}
                        placeholder="https://github.com/username"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>
                Your educational background and current academic status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={profileData.academic.institution}
                    onChange={(e) => handleInputChange('academic', 'institution', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department/Major</Label>
                  <Input
                    id="department"
                    value={profileData.academic.department}
                    onChange={(e) => handleInputChange('academic', 'department', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  <Input
                    id="year"
                    value={profileData.academic.year}
                    onChange={(e) => handleInputChange('academic', 'year', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    value={profileData.academic.gpa}
                    onChange={(e) => handleInputChange('academic', 'gpa', e.target.value)}
                    disabled={!isEditing}
                    placeholder="3.85"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={profileData.academic.studentId}
                    onChange={(e) => handleInputChange('academic', 'studentId', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                  <Input
                    id="expectedGraduation"
                    type="date"
                    value={profileData.academic.expectedGraduation}
                    onChange={(e) => handleInputChange('academic', 'expectedGraduation', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Experience</CardTitle>
              <CardDescription>
                Your work experience and current professional status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPosition">Current Position</Label>
                  <Input
                    id="currentPosition"
                    value={profileData.professional.currentPosition}
                    onChange={(e) => handleInputChange('professional', 'currentPosition', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.professional.company}
                    onChange={(e) => handleInputChange('professional', 'company', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Icons.plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {profileData.professional.experience.map((exp, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{exp.title}</h4>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                            <p className="text-sm text-muted-foreground">{exp.duration}</p>
                            <p className="text-sm">{exp.description}</p>
                          </div>
                          {isEditing && (
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Icons.edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Icons.trash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid gap-6">
            {/* Technical Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.code className="h-5 w-5" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills.technical.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('technical', index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <Icons.x className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input placeholder="Add a technical skill..." id="new-technical-skill" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('new-technical-skill') as HTMLInputElement;
                        if (input.value) {
                          addSkill('technical', input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Soft Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.users className="h-5 w-5" />
                  Soft Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills.soft.map((skill, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('soft', index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <Icons.x className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input placeholder="Add a soft skill..." id="new-soft-skill" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('new-soft-skill') as HTMLInputElement;
                        if (input.value) {
                          addSkill('soft', input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.globe className="h-5 w-5" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills.languages.map((language, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {language}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('languages', index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <Icons.x className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input placeholder="Add a language..." id="new-language" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('new-language') as HTMLInputElement;
                        if (input.value) {
                          addSkill('languages', input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Preferences</CardTitle>
              <CardDescription>
                Control your privacy settings and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Visibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <select 
                      className="px-3 py-2 border rounded-md"
                      value={profileData.preferences.profileVisibility}
                      onChange={(e) => handleInputChange('preferences', 'profileVisibility', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="public">Public</option>
                      <option value="university">University Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Email</p>
                      <p className="text-sm text-muted-foreground">Display email on public profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.preferences.showEmail}
                      onChange={(e) => handleInputChange('preferences', 'showEmail', e.target.checked.toString())}
                      disabled={!isEditing}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Phone</p>
                      <p className="text-sm text-muted-foreground">Display phone number on profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.preferences.showPhone}
                      onChange={(e) => handleInputChange('preferences', 'showPhone', e.target.checked.toString())}
                      disabled={!isEditing}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow Recruiter Contact</p>
                      <p className="text-sm text-muted-foreground">Let recruiters contact you directly</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.preferences.allowRecruiterContact}
                      onChange={(e) => handleInputChange('preferences', 'allowRecruiterContact', e.target.checked.toString())}
                      disabled={!isEditing}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.preferences.emailNotifications}
                      onChange={(e) => handleInputChange('preferences', 'emailNotifications', e.target.checked.toString())}
                      disabled={!isEditing}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Achievement Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about badge and achievement updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.preferences.achievementNotifications}
                      onChange={(e) => handleInputChange('preferences', 'achievementNotifications', e.target.checked.toString())}
                      disabled={!isEditing}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Actions</h3>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Icons.download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline">
                    <Icons.refresh className="h-4 w-4 mr-2" />
                    Reset Profile
                  </Button>
                  <Button variant="destructive">
                    <Icons.trash className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}
