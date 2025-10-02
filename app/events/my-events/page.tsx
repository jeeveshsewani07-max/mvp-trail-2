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

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  credits: number;
  registration_deadline: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: {
    student: {
      full_name: string;
      email: string;
    };
  }[];
}

const EVENT_STATUSES = [
  { value: 'all', label: 'All Events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function MyEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      try {
        const params = new URLSearchParams();
        if (filter !== 'all') {
          params.append('status', filter);
        }

        const response = await fetch(
          '/api/faculty/events?' + params.toString()
        );
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, filter]);

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/faculty/events', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event status');
      }

      // Update local state
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, status: newStatus as Event['status'] }
            : event
        )
      );

      toast.success('Event status updated successfully');
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Failed to update event status');
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
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-muted-foreground">
              Manage your events and workshops
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = '/events/create';
            }}
          >
            <Icons.plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Status Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Events</CardTitle>
            <CardDescription>View events by status</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Icons.calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">No events found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {filter === 'all'
                    ? "You haven't created any events yet"
                    : `No ${filter} events found`}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/events/create';
                  }}
                >
                  <Icons.plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-muted-foreground mb-2">
                        {event.location} • {event.type}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {event.participants.length} / {event.max_participants}{' '}
                          Participants
                        </Badge>
                        <Badge
                          variant={
                            event.status === 'upcoming'
                              ? 'default'
                              : event.status === 'ongoing'
                                ? 'success'
                                : event.status === 'completed'
                                  ? 'secondary'
                                  : 'destructive'
                          }
                        >
                          {event.status.charAt(0).toUpperCase() +
                            event.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>
                          Start:{' '}
                          {new Date(event.start_date).toLocaleDateString()} •{' '}
                          {new Date(event.start_date).toLocaleTimeString()}
                        </p>
                        <p>
                          End: {new Date(event.end_date).toLocaleDateString()} •{' '}
                          {new Date(event.end_date).toLocaleTimeString()}
                        </p>
                        <p>
                          Registration Deadline:{' '}
                          {new Date(
                            event.registration_deadline
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Select
                        value={event.status}
                        onValueChange={(value) =>
                          handleStatusChange(event.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          window.location.href = `/events/${event.id}`;
                        }}
                      >
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
