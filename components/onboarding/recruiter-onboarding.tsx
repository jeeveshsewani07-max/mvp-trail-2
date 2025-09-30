'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const recruiterOnboardingSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  designation: z.string().min(1, 'Designation is required'),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  companySize: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  companyDescription: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
});

type RecruiterOnboardingForm = z.infer<typeof recruiterOnboardingSchema>;

interface RecruiterOnboardingProps {
  user: User;
  onComplete: () => void;
}

export function RecruiterOnboarding({
  user,
  onComplete,
}: RecruiterOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RecruiterOnboardingForm>({
    resolver: zodResolver(recruiterOnboardingSchema),
  });

  const onSubmit = async (data: RecruiterOnboardingForm) => {
    setIsLoading(true);

    try {
      // First, ensure a row exists in profiles table with id = auth.user.id
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileCheckError && profileCheckError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: profileCreateError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            user_id: user.id,
            roll_number: 'RECRUITER',
            batch: 'N/A',
            course: 'N/A',
            current_year: 0,
            current_semester: 0,
            skills: [],
            interests: [],
            languages: ['English'],
            is_profile_complete: false,
          });

        if (profileCreateError) {
          throw new Error(
            'Failed to create profile: ' + profileCreateError.message
          );
        }
      } else if (profileCheckError) {
        throw profileCheckError;
      }

      // Create recruiter profile using profile_id
      const { error } = await supabase.from('recruiter_profiles').insert({
        profile_id: user.id,
        company_name: data.companyName,
        designation: data.designation,
        company_website: data.companyWebsite || null,
        company_size: data.companySize || null,
        industry: data.industry,
        company_description: data.companyDescription || null,
        linkedin_url: data.linkedinUrl || null,
        is_verified: false, // Will be verified by admin
        can_post_jobs: true,
        credits_balance: 100, // Starting credits
      });

      if (error) throw error;

      onComplete();
    } catch (error: any) {
      toast.error('Failed to create profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-1000 employees',
    '1001-5000 employees',
    '5000+ employees',
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Media & Entertainment',
    'Real Estate',
    'Transportation',
    'Energy',
    'Government',
    'Non-profit',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Company Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              {...register('companyName')}
              placeholder="Enter your company name"
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input
              {...register('companyWebsite')}
              type="url"
              placeholder="https://company.com"
            />
            {errors.companyWebsite && (
              <p className="text-sm text-red-500">
                {errors.companyWebsite.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select onValueChange={(value) => setValue('industry', value)}>
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
            {errors.industry && (
              <p className="text-sm text-red-500">{errors.industry.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Select onValueChange={(value) => setValue('companySize', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyDescription">Company Description</Label>
          <Textarea
            {...register('companyDescription')}
            placeholder="Brief description of your company"
            rows={3}
          />
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="designation">Your Designation *</Label>
            <Input
              {...register('designation')}
              placeholder="e.g., HR Manager, Talent Acquisition"
            />
            {errors.designation && (
              <p className="text-sm text-red-500">
                {errors.designation.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
            <Input
              {...register('linkedinUrl')}
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedinUrl && (
              <p className="text-sm text-red-500">
                {errors.linkedinUrl.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icons.info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Account Verification
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
              Your recruiter account will be reviewed and verified by our team
              within 24-48 hours. You'll receive an email confirmation once
              approved.
            </p>
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
