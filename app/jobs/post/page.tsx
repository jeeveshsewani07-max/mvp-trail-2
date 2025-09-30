'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useAuth } from '@/components/providers';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const jobSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  description: z.string().min(10, 'Job description is required'),
  type: z
    .enum(['full-time', 'part-time', 'internship', 'contract'])
    .default('full-time'),
  location: z.string().optional().or(z.literal('')),
  isRemote: z.boolean().optional().default(false),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  experience: z.string().optional().or(z.literal('')),
  skills: z.string().optional().or(z.literal('')),
  applicationDeadline: z.string().optional().or(z.literal('')),
});

type JobForm = z.infer<typeof jobSchema>;

export default function PostJobPage() {
  const { user, dbUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobForm>({ resolver: zodResolver(jobSchema) });

  const onSubmit = async (data: JobForm) => {
    if (!user) {
      toast.error('Please sign in to post a job.');
      return;
    }

    setSubmitting(true);

    try {
      // Try to fetch recruiter profile id using profile_id
      const { data: profile, error: profileError } = await supabase
        .from('recruiter_profiles')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (profileError || !profile?.id) {
        // Fallback: save as auth metadata draft and inform user
        await supabase.auth.updateUser({
          data: {
            job_posting_draft: {
              ...data,
              skills: (data.skills || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            },
          },
        });
        toast.success('Saved as draft. Complete DB setup to enable posting.');
        return;
      }

      const skillsArray = (data.skills || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const { error } = await supabase.from('job_postings').insert({
        recruiter_id: profile.id,
        title: data.title,
        description: data.description,
        type: data.type,
        location: data.location || null,
        is_remote: !!data.isRemote,
        salary_min: data.salaryMin ?? null,
        salary_max: data.salaryMax ?? null,
        currency: 'INR',
        experience: data.experience || null,
        skills_required: skillsArray,
        application_deadline: data.applicationDeadline || null,
        is_active: true,
      });

      if (error) {
        // If tables missing, save as draft in auth metadata
        if (String(error.message).includes('Could not find the table')) {
          await supabase.auth.updateUser({
            data: {
              job_posting_draft: {
                ...data,
                skills: skillsArray,
              },
            },
          });
          toast.success('Saved as draft. Complete DB setup to enable posting.');
        } else {
          throw error;
        }
      } else {
        toast.success('Job posted successfully');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const type = watch('type');

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/jobs">
              <Icons.arrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Post a Job</h1>
            <p className="text-muted-foreground">
              Create a new job opening for candidates
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job details</CardTitle>
            <CardDescription>
              Provide all the necessary details for this role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  placeholder="e.g., Frontend Engineer"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  rows={6}
                  placeholder="Describe responsibilities, requirements, etc."
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    onValueChange={(v) =>
                      setValue('type', v as JobForm['type'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    placeholder="e.g., Bengaluru / Remote"
                    {...register('location')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Salary Min (INR)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 600000"
                    {...register('salaryMin')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Salary Max (INR)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1200000"
                    {...register('salaryMax')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    placeholder="e.g., 1-3 years / Fresher"
                    {...register('experience')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">
                    Application deadline
                  </Label>
                  <Input type="date" {...register('applicationDeadline')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  placeholder="React, TypeScript, REST"
                  {...register('skills')}
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.briefcase className="mr-2 h-4 w-4" />
                )}
                {submitting ? 'Posting…' : 'Post Job'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
