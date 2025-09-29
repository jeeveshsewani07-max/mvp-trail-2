'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { EventsList } from '@/components/events/events-list';
import { EventFilters } from '@/components/events/event-filters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { useAuth } from '@/components/providers';
import Link from 'next/link';

export default function EventsPage() {
  const { dbUser } = useAuth();
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
    dateRange: 'upcoming',
  });

  const canCreateEvents = dbUser?.role === 'faculty' || dbUser?.role === 'institution_admin';
  
  // Debug logging to help identify role issues
  console.log('Current user role:', dbUser?.role);
  console.log('Can create events:', canCreateEvents);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-muted-foreground">
              {dbUser?.role === 'student' 
                ? 'Discover and participate in campus events'
                : 'Manage and track event participation'
              }
            </p>
          </div>
          <Link href="/events/create">
            <Button>
              <Icons.plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">
              {dbUser?.role === 'student' ? 'Discover Events' : 'All Events'}
            </TabsTrigger>
            <TabsTrigger value="my-events">
              {dbUser?.role === 'student' ? 'My Events' : 'My Created Events'}
            </TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Filters */}
            <EventFilters
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* Events List */}
            <EventsList filters={filters} viewType="discover" />
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <EventsList 
              filters={{ ...filters, status: 'registered' }} 
              viewType={dbUser?.role === 'student' ? 'registered' : 'created'} 
            />
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <EventsList 
              filters={{ ...filters, dateRange: 'past' }} 
              viewType="past" 
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
