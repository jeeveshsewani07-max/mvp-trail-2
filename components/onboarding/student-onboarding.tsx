'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase/client';
import { skillCategories } from '@/lib/utils';
import { toast } from 'sonner';
import type { Institution, Department } from '@/types';

const studentOnboardingSchema = z.object({
  institutionId: z.string().min(1, 'Please select your institution'),
  departmentId: z.string().optional(),
  rollNumber: z.string().min(1, 'Roll number is required'),
  batch: z.string().min(1, 'Batch is required'),
  course: z.string().min(1, 'Course is required'),
  specialization: z.string().optional(),
  currentYear: z.number().min(1).max(6),
  currentSemester: z.number().min(1).max(12),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  interests: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
});

type StudentOnboardingForm = z.infer<typeof studentOnboardingSchema>;

interface StudentOnboardingProps {
  user: User;
  onComplete: () => void;
}

export function StudentOnboarding({ user, onComplete }: StudentOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentOnboardingForm>({
    resolver: zodResolver(studentOnboardingSchema),
    defaultValues: {
      skills: [],
      interests: [],
      languages: ['English'],
      currentYear: 1,
      currentSemester: 1,
    },
  });

  // Mock data for institutions
  const mockInstitutions = [
    { id: '1', name: 'Indian Institute of Technology, Delhi', type: 'Government', location: 'New Delhi' },
    { id: '2', name: 'Indian Institute of Technology, Mumbai', type: 'Government', location: 'Mumbai' },
    { id: '3', name: 'Indian Institute of Science, Bangalore', type: 'Government', location: 'Bangalore' },
    { id: '4', name: 'Delhi Technological University', type: 'Government', location: 'Delhi' },
    { id: '5', name: 'Birla Institute of Technology and Science, Pilani', type: 'Private', location: 'Pilani' },
    { id: '6', name: 'Vellore Institute of Technology', type: 'Private', location: 'Vellore' },
    { id: '7', name: 'SRM Institute of Science and Technology', type: 'Private', location: 'Chennai' },
    { id: '8', name: 'Manipal Institute of Technology', type: 'Private', location: 'Manipal' },
    { id: '9', name: 'University of Delhi', type: 'Government', location: 'Delhi' },
    { id: '10', name: 'Jawaharlal Nehru University', type: 'Government', location: 'New Delhi' },
    { id: '11', name: 'Amity University', type: 'Private', location: 'Noida' },
    { id: '12', name: 'Lovely Professional University', type: 'Private', location: 'Punjab' },
  ];

  // Mock data for departments organized by institution
  const mockDepartments = {
    '1': [ // IIT Delhi
      { id: '1-1', name: 'Computer Science and Engineering', institution_id: '1' },
      { id: '1-2', name: 'Electrical Engineering', institution_id: '1' },
      { id: '1-3', name: 'Mechanical Engineering', institution_id: '1' },
      { id: '1-4', name: 'Civil Engineering', institution_id: '1' },
      { id: '1-5', name: 'Chemical Engineering', institution_id: '1' },
      { id: '1-6', name: 'Mathematics and Computing', institution_id: '1' },
    ],
    '2': [ // IIT Mumbai
      { id: '2-1', name: 'Computer Science and Engineering', institution_id: '2' },
      { id: '2-2', name: 'Information Technology', institution_id: '2' },
      { id: '2-3', name: 'Electronics and Communication', institution_id: '2' },
      { id: '2-4', name: 'Mechanical Engineering', institution_id: '2' },
      { id: '2-5', name: 'Aerospace Engineering', institution_id: '2' },
    ],
    '3': [ // IISc Bangalore
      { id: '3-1', name: 'Computer Science and Automation', institution_id: '3' },
      { id: '3-2', name: 'Electrical Communication Engineering', institution_id: '3' },
      { id: '3-3', name: 'Electronic Systems Engineering', institution_id: '3' },
      { id: '3-4', name: 'Computational and Data Sciences', institution_id: '3' },
    ],
    '4': [ // DTU
      { id: '4-1', name: 'Computer Engineering', institution_id: '4' },
      { id: '4-2', name: 'Information Technology', institution_id: '4' },
      { id: '4-3', name: 'Electronics and Communication Engineering', institution_id: '4' },
      { id: '4-4', name: 'Software Engineering', institution_id: '4' },
      { id: '4-5', name: 'Mechanical Engineering', institution_id: '4' },
    ],
    '5': [ // BITS Pilani
      { id: '5-1', name: 'Computer Science and Information Systems', institution_id: '5' },
      { id: '5-2', name: 'Electronics and Instrumentation', institution_id: '5' },
      { id: '5-3', name: 'Mechanical Engineering', institution_id: '5' },
      { id: '5-4', name: 'Electrical and Electronics', institution_id: '5' },
    ],
    '6': [ // VIT
      { id: '6-1', name: 'Computer Science and Engineering', institution_id: '6' },
      { id: '6-2', name: 'Information Technology', institution_id: '6' },
      { id: '6-3', name: 'Electronics and Communication Engineering', institution_id: '6' },
      { id: '6-4', name: 'Data Science and Analytics', institution_id: '6' },
    ],
    '7': [ // SRM
      { id: '7-1', name: 'Computer Science and Engineering', institution_id: '7' },
      { id: '7-2', name: 'Information Technology', institution_id: '7' },
      { id: '7-3', name: 'Software Engineering', institution_id: '7' },
      { id: '7-4', name: 'Artificial Intelligence and Data Science', institution_id: '7' },
    ],
    '8': [ // Manipal
      { id: '8-1', name: 'Computer and Communication Engineering', institution_id: '8' },
      { id: '8-2', name: 'Information and Communication Technology', institution_id: '8' },
      { id: '8-3', name: 'Electronics and Communication Engineering', institution_id: '8' },
    ],
    '9': [ // University of Delhi
      { id: '9-1', name: 'Computer Science', institution_id: '9' },
      { id: '9-2', name: 'Electronics', institution_id: '9' },
      { id: '9-3', name: 'Mathematics', institution_id: '9' },
      { id: '9-4', name: 'Physics', institution_id: '9' },
    ],
    '10': [ // JNU
      { id: '10-1', name: 'School of Computer and Systems Sciences', institution_id: '10' },
      { id: '10-2', name: 'School of Physical Sciences', institution_id: '10' },
      { id: '10-3', name: 'School of Biotechnology', institution_id: '10' },
    ],
    '11': [ // Amity University
      { id: '11-1', name: 'Computer Science and Engineering', institution_id: '11' },
      { id: '11-2', name: 'Information Technology', institution_id: '11' },
      { id: '11-3', name: 'Data Science', institution_id: '11' },
      { id: '11-4', name: 'Artificial Intelligence', institution_id: '11' },
    ],
    '12': [ // LPU
      { id: '12-1', name: 'Computer Science and Engineering', institution_id: '12' },
      { id: '12-2', name: 'Information Technology', institution_id: '12' },
      { id: '12-3', name: 'Computer Applications', institution_id: '12' },
      { id: '12-4', name: 'Electronics and Communication', institution_id: '12' },
    ],
  };

  // Load mock institutions on component mount
  useEffect(() => {
    setInstitutions(mockInstitutions as Institution[]);
  }, []);

  // Update departments when institution changes
  useEffect(() => {
    if (selectedInstitution && mockDepartments[selectedInstitution as keyof typeof mockDepartments]) {
      setDepartments(mockDepartments[selectedInstitution as keyof typeof mockDepartments] as Department[]);
    } else {
      setDepartments([]);
    }
  }, [selectedInstitution]);

  const onSubmit = async (data: StudentOnboardingForm) => {
    setIsLoading(true);
    
    try {
      // Generate QR code data
      const qrCodeData = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${data.institutionId}/${user.id}`;
      
      // Create student profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          institution_id: data.institutionId,
          department_id: data.departmentId || null,
          roll_number: data.rollNumber,
          batch: data.batch,
          course: data.course,
          specialization: data.specialization || null,
          current_year: data.currentYear,
          current_semester: data.currentSemester,
          skills: data.skills,
          interests: data.interests || [],
          languages: data.languages || ['English'],
          portfolio_url: data.portfolioUrl || null,
          linkedin_url: data.linkedinUrl || null,
          github_url: data.githubUrl || null,
          qr_code: qrCodeData,
          is_profile_complete: true,
        });

      if (error) throw error;

      onComplete();
    } catch (error: any) {
      toast.error('Failed to create profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const allSkills = Object.values(skillCategories).flat();
  const languageOptions = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati',
    'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Spanish', 'French', 'German',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Institution and Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="institutionId">Institution *</Label>
          <Select
            onValueChange={(value) => {
              setValue('institutionId', value);
              setSelectedInstitution(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your institution" />
            </SelectTrigger>
            <SelectContent>
              {institutions.map((institution) => (
                <SelectItem key={institution.id} value={institution.id}>
                  {institution.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.institutionId && (
            <p className="text-sm text-red-500">{errors.institutionId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="departmentId">Department</Label>
          <Select onValueChange={(value) => setValue('departmentId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Academic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rollNumber">Roll Number *</Label>
          <Input
            {...register('rollNumber')}
            placeholder="Enter your roll number"
          />
          {errors.rollNumber && (
            <p className="text-sm text-red-500">{errors.rollNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch">Batch *</Label>
          <Input
            {...register('batch')}
            placeholder="e.g., 2021-2025"
          />
          {errors.batch && (
            <p className="text-sm text-red-500">{errors.batch.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="course">Course *</Label>
          <Input
            {...register('course')}
            placeholder="e.g., BTech, MTech, BCA"
          />
          {errors.course && (
            <p className="text-sm text-red-500">{errors.course.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentYear">Current Year *</Label>
          <Select onValueChange={(value) => setValue('currentYear', parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
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
          <Label htmlFor="currentSemester">Current Semester *</Label>
          <Select onValueChange={(value) => setValue('currentSemester', parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          {...register('specialization')}
          placeholder="e.g., Computer Science, Artificial Intelligence"
        />
      </div>

      {/* Skills and Interests */}
      <div className="space-y-2">
        <Label htmlFor="skills">Skills * (Select at least one)</Label>
        <MultiSelect
          options={allSkills.map(skill => ({ label: skill, value: skill }))}
          value={watch('skills') || []}
          onChange={(values) => setValue('skills', values)}
          placeholder="Select your skills"
        />
        {errors.skills && (
          <p className="text-sm text-red-500">{errors.skills.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interests">Interests</Label>
          <MultiSelect
            options={allSkills.map(skill => ({ label: skill, value: skill }))}
            value={watch('interests') || []}
            onChange={(values) => setValue('interests', values)}
            placeholder="Select your interests"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="languages">Languages</Label>
          <MultiSelect
            options={languageOptions.map(lang => ({ label: lang, value: lang }))}
            value={watch('languages') || ['English']}
            onChange={(values) => setValue('languages', values)}
            placeholder="Select languages"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Links (Optional)</h3>
        
        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
          <Input
            {...register('portfolioUrl')}
            type="url"
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              {...register('linkedinUrl')}
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              {...register('githubUrl')}
              type="url"
              placeholder="https://github.com/yourusername"
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
}


