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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Application {
  id: string;
  status: string;
  created_at: string;
  job: {
    title: string;
    type: string;
    location: string;
    company: {
      name: string;
      logo_url: string;
      industry: string;
    };
  };
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      try {
        const queryParams = new URLSearchParams(
          filter !== 'all' ? { status: filter } : {}
        );
        const response = await fetch(
          '/api/applications?' + queryParams.toString()
        );
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications);
        } else {
          toast.error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'interviewing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground">
              Track your job applications and their status
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = '/jobs';
            }}
          >
            <Icons.search className="mr-2 h-4 w-4" />
            Browse Jobs
          </Button>
        </div>

        {/* Status Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Applications</CardTitle>
            <CardDescription>View applications by status</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Icons.fileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">No applications found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {filter === 'all'
                    ? "You haven't applied to any jobs yet"
                    : 'No applications with status "' + filter + '"'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/jobs';
                  }}
                >
                  <Icons.search className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => (
              <Card
                key={application.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {application.job.company.logo_url ? (
                        <img
                          src={application.job.company.logo_url}
                          alt={application.job.company.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icons.building className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">
                          {application.job.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {application.job.company.name} •{' '}
                          {application.job.location}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">
                            {application.job.type}
                          </Badge>
                          <Badge
                            className={getStatusColor(application.status)}
                            variant="outline"
                          >
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-2">
                        Applied{' '}
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
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
