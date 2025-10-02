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
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  created_at: string;
  deadline: string;
  company: {
    name: string;
    logo_url: string;
    industry: string;
  };
  applications: {
    id: string;
    status: string;
    created_at: string;
  }[];
}

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    category: '',
    location: '',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        const queryParams = new URLSearchParams({
          type: filters.type,
          ...(filters.category && { category: filters.category }),
          ...(filters.location && { location: filters.location }),
        });

        const response = await fetch('/api/jobs?' + queryParams);
        if (response.ok) {
          const data = await response.json();
          setJobs(data.jobs);
        } else {
          toast.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, filters]);

  const handleApply = async (jobId: string) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
        }),
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        // Refresh jobs to update application status
        const updatedResponse = await fetch(
          '/api/jobs?' + new URLSearchParams(filters)
        );
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setJobs(data.jobs);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Jobs & Internships</h1>
            <p className="text-muted-foreground">
              Discover and apply for opportunities
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = '/applications';
            }}
          >
            <Icons.fileText className="mr-2 h-4 w-4" />
            My Applications
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find the perfect opportunity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Select
                  value={filters.type}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="software">
                      Software Development
                    </SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Icons.search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">No jobs found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or check back later
                </p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {job.company.logo_url ? (
                        <img
                          src={job.company.logo_url}
                          alt={job.company.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icons.building className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-muted-foreground">
                          {job.company.name} • {job.location}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{job.type}</Badge>
                          <Badge variant="outline">
                            {job.company.industry}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-2">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </p>
                      {job.applications?.length > 0 ? (
                        <Badge variant="outline">Already Applied</Badge>
                      ) : (
                        <Button
                          onClick={() => handleApply(job.id)}
                          disabled={job.applications?.length > 0}
                        >
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
