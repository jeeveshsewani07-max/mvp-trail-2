'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CreateEventForm } from '@/components/events/create-event-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CreateEventPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/events">
              <Icons.arrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">
              Create an event for students to participate and earn credits
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Main Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.calendar className="h-5 w-5" />
                  Event Details
                </CardTitle>
                <CardDescription>
                  Fill out the form below to create your event. Make sure to provide clear information about participation roles and credit allocation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateEventForm />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Event Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icons.list className="h-5 w-5" />
                  Event Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Icons.trophy className="h-4 w-4" />
                    Competition
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Hackathons, contests, tournaments with winners and prizes
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Icons.book className="h-4 w-4" />
                    Workshop
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Hands-on learning sessions with practical outcomes
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Icons.user className="h-4 w-4" />
                    Seminar
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Educational talks, lectures, and knowledge sharing
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Icons.star className="h-4 w-4" />
                    Cultural
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Arts, festivals, cultural celebrations and performances
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Credit Guidelines */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
                  <Icons.star className="h-5 w-5" />
                  Credit Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Organizer:</strong> 15-30 credits for planning and managing the event
                  </p>
                  
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Volunteer:</strong> 5-20 credits for supporting event execution
                  </p>
                  
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Participant:</strong> 3-15 credits for attending and engaging
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icons.lightbulb className="h-5 w-5" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Clear Description:</strong> Provide detailed information about what participants will learn or achieve.
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    <strong>Set Prerequisites:</strong> List any skills or requirements needed to participate effectively.
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    <strong>Define Outcomes:</strong> Clearly state what certificates, skills, or benefits participants will receive.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
