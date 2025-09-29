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
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Institution, Department } from '@/types';

const facultyOnboardingSchema = z.object({
  institutionId: z.string().min(1, 'Please select your institution'),
  departmentId: z.string().optional(),
  designation: z.string().min(1, 'Designation is required'),
  employeeId: z.string().optional(),
  specialization: z.string().optional(),
  qualifications: z.array(z.string()).min(1, 'Please add at least one qualification'),
  experience: z.number().min(0).max(50),
  researchAreas: z.array(z.string()).optional(),
  canMentor: z.boolean(),
  maxMentees: z.number().min(1).max(100),
});

type FacultyOnboardingForm = z.infer<typeof facultyOnboardingSchema>;

interface FacultyOnboardingProps {
  user: User;
  onComplete: () => void;
}

export function FacultyOnboarding({ user, onComplete }: FacultyOnboardingProps) {
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
  } = useForm<FacultyOnboardingForm>({
    resolver: zodResolver(facultyOnboardingSchema),
    defaultValues: {
      qualifications: [],
      experience: 0,
      researchAreas: [],
      canMentor: true,
      maxMentees: 20,
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

  const onSubmit = async (data: FacultyOnboardingForm) => {
    setIsLoading(true);
    
    try {
      // Create faculty profile
      const { error } = await supabase
        .from('faculty_profiles')
        .insert({
          user_id: user.id,
          institution_id: data.institutionId,
          department_id: data.departmentId || null,
          designation: data.designation,
          employee_id: data.employeeId || null,
          specialization: data.specialization || null,
          qualifications: data.qualifications,
          experience: data.experience,
          research_areas: data.researchAreas || [],
          can_mentor: data.canMentor,
          max_mentees: data.maxMentees,
          current_mentees: 0,
          approval_power: {
            can_approve_achievements: true,
            can_create_events: true,
            max_credit_value: 10,
          },
        });

      if (error) throw error;

      onComplete();
    } catch (error: any) {
      toast.error('Failed to create profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const qualificationOptions = [
    'PhD', 'M.Tech', 'M.Sc', 'ME', 'MBA', 'B.Tech', 'B.Sc', 'BE',
    'Post Doc', 'Certificate', 'Diploma', 'Other',
  ];

  const researchAreaOptions = [
    'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Computer Networks',
    'Cybersecurity', 'Software Engineering', 'Database Systems', 'Cloud Computing',
    'IoT', 'Blockchain', 'Computer Vision', 'Natural Language Processing',
    'Robotics', 'Human-Computer Interaction', 'Algorithms', 'Theory of Computation',
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

      {/* Professional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            {...register('designation')}
            placeholder="e.g., Assistant Professor, Associate Professor"
          />
          {errors.designation && (
            <p className="text-sm text-red-500">{errors.designation.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            {...register('employeeId')}
            placeholder="Enter your employee ID"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input
            {...register('specialization')}
            placeholder="e.g., Computer Science, AI/ML"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience *</Label>
          <Select onValueChange={(value) => setValue('experience', parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 51 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i} {i === 1 ? 'year' : 'years'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Qualifications and Research Areas */}
      <div className="space-y-2">
        <Label htmlFor="qualifications">Qualifications * (Select at least one)</Label>
        <MultiSelect
          options={qualificationOptions.map(qual => ({ label: qual, value: qual }))}
          value={watch('qualifications') || []}
          onChange={(values) => setValue('qualifications', values)}
          placeholder="Select your qualifications"
        />
        {errors.qualifications && (
          <p className="text-sm text-red-500">{errors.qualifications.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="researchAreas">Research Areas</Label>
        <MultiSelect
          options={researchAreaOptions.map(area => ({ label: area, value: area }))}
          value={watch('researchAreas') || []}
          onChange={(values) => setValue('researchAreas', values)}
          placeholder="Select your research areas"
        />
      </div>

      {/* Mentorship Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mentorship Settings</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="canMentor"
            checked={watch('canMentor')}
            onCheckedChange={(checked) => setValue('canMentor', !!checked)}
          />
          <Label htmlFor="canMentor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I want to mentor students
          </Label>
        </div>

        {watch('canMentor') && (
          <div className="space-y-2">
            <Label htmlFor="maxMentees">Maximum number of mentees</Label>
            <Select onValueChange={(value) => setValue('maxMentees', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select max mentees" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20, 25, 30, 40, 50].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} students
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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


