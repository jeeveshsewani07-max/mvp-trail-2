'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const institutionOnboardingSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  institutionCode: z.string().min(1, 'Institution code is required'),
  type: z.string().min(1, 'Institution type is required'),
  website: z.string().url().optional().or(z.literal('')),
  naacGrade: z.string().optional(),
  nirfRanking: z.number().optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().default('India'),
    pincode: z.string().min(6, 'Valid pincode is required'),
  }),
});

type InstitutionOnboardingForm = z.infer<typeof institutionOnboardingSchema>;

interface InstitutionOnboardingProps {
  user: User;
  onComplete: () => void;
}

export function InstitutionOnboarding({ user, onComplete }: InstitutionOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InstitutionOnboardingForm>({
    resolver: zodResolver(institutionOnboardingSchema),
    defaultValues: {
      address: {
        country: 'India',
      },
    },
  });

  const onSubmit = async (data: InstitutionOnboardingForm) => {
    setIsLoading(true);
    
    try {
      // Create institution
      const { data: institution, error: institutionError } = await supabase
        .from('institutions')
        .insert({
          name: data.institutionName,
          code: data.institutionCode,
          type: data.type,
          website: data.website || null,
          naac_grade: data.naacGrade || null,
          nirf_ranking: data.nirfRanking || null,
          address: data.address,
          is_verified: false, // Will be verified by admin
          settings: {
            creditSystem: { enabled: true, pointsPerHour: 1 },
            badgeSystem: { enabled: true, customBadges: [] },
            branding: { primaryColor: '#3b82f6', secondaryColor: '#64748b' },
          },
        })
        .select()
        .single();

      if (institutionError) throw institutionError;

      // Create institution admin profile (this would be a special profile type)
      // For now, we'll create as regular user but mark them as institution admin
      const { error: userError } = await supabase
        .from('users')
        .update({
          role: 'institution_admin',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (userError) throw userError;

      onComplete();
    } catch (error: any) {
      toast.error('Failed to create institution: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const institutionTypes = [
    'University',
    'College',
    'Institute',
    'Technical College',
    'Community College',
    'Research Institute',
    'Other',
  ];

  const naacGrades = [
    'A++', 'A+', 'A', 'B++', 'B+', 'B', 'C',
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Puducherry', 'Other',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Institution Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Institution Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">Institution Name *</Label>
            <Input
              {...register('institutionName')}
              placeholder="Enter institution name"
            />
            {errors.institutionName && (
              <p className="text-sm text-red-500">{errors.institutionName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="institutionCode">Institution Code *</Label>
            <Input
              {...register('institutionCode')}
              placeholder="e.g., INST001"
              style={{ textTransform: 'uppercase' }}
            />
            {errors.institutionCode && (
              <p className="text-sm text-red-500">{errors.institutionCode.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Institution Type *</Label>
            <Select onValueChange={(value) => setValue('type', value)}>
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
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              {...register('website')}
              type="url"
              placeholder="https://institution.edu"
            />
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="naacGrade">NAAC Grade</Label>
            <Select onValueChange={(value) => setValue('naacGrade', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select NAAC grade" />
              </SelectTrigger>
              <SelectContent>
                {naacGrades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nirfRanking">NIRF Ranking</Label>
            <Input
              {...register('nirfRanking', { valueAsNumber: true })}
              type="number"
              min="1"
              placeholder="Enter NIRF ranking"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address</h3>
        
        <div className="space-y-2">
          <Label htmlFor="address.street">Street Address *</Label>
          <Textarea
            {...register('address.street')}
            placeholder="Enter complete address"
            rows={2}
          />
          {errors.address?.street && (
            <p className="text-sm text-red-500">{errors.address.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address.city">City *</Label>
            <Input
              {...register('address.city')}
              placeholder="Enter city"
            />
            {errors.address?.city && (
              <p className="text-sm text-red-500">{errors.address.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.state">State *</Label>
            <Select onValueChange={(value) => setValue('address.state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.address?.state && (
              <p className="text-sm text-red-500">{errors.address.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.pincode">Pincode *</Label>
            <Input
              {...register('address.pincode')}
              placeholder="Enter pincode"
              maxLength={6}
            />
            {errors.address?.pincode && (
              <p className="text-sm text-red-500">{errors.address.pincode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icons.alertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900 dark:text-amber-100">Institution Verification</h4>
            <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
              Your institution will be reviewed and verified by our team. This process may take 3-5 business days.
              We'll verify the authenticity of your institution and contact you for any additional documents if needed.
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
        Submit for Verification
      </Button>
    </form>
  );
}


