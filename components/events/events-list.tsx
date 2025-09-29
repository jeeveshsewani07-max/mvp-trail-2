'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { formatDate, formatRelativeTime } from '@/lib/utils';

// Mock data - would come from API
const mockEvents = [
  {
    id: '1',
    title: 'TechFest 2024 - AI/ML Hackathon',
    description: '48-hour hackathon focused on AI/ML applications in education. Build innovative solutions and compete for exciting prizes.',
    type: 'competition',
    category: 'technical',
    startDate: '2024-02-15T09:00:00Z',
    endDate: '2024-02-17T18:00:00Z',
    venue: 'Tech Campus Auditorium',
    isOnline: false,
    maxParticipants: 200,
    currentParticipants: 156,
    registrationDeadline: '2024-02-10T23:59:00Z',
    poster: '/posters/techfest-2024.jpg',
    tags: ['AI/ML', 'Hackathon', 'Competition', 'Innovation'],
    status: 'published',
    roles: {
      organizer: { credits: 25, maxCount: 10, currentCount: 8 },
      volunteer: { credits: 15, maxCount: 20, currentCount: 15 },
      participant: { credits: 10, maxCount: 170, currentCount: 133 },
    },
    prerequisites: ['Basic programming knowledge', 'Team of 2-4 members'],
    outcomes: ['Certificate of participation', 'Prizes for top 3 teams', 'Networking opportunities'],
    institution: { name: 'Tech University', logo: '/logos/tech-uni.png' },
    creator: { name: 'Prof. Sarah Johnson', avatar: '/avatars/prof-sarah.jpg' },
    isRegistered: false,
    userRole: null,
  },
  {
    id: '2',
    title: 'Web Development Workshop',
    description: 'Comprehensive workshop covering modern web development with React, Next.js, and deployment strategies.',
    type: 'workshop',
    category: 'technical',
    startDate: '2024-02-20T14:00:00Z',
    endDate: '2024-02-20T17:00:00Z',
    venue: 'Computer Lab 101',
    isOnline: true,
    meetingLink: 'https://meet.example.com/web-workshop',
    maxParticipants: 50,
    currentParticipants: 32,
    registrationDeadline: '2024-02-18T23:59:00Z',
    tags: ['React', 'Next.js', 'Web Development', 'Frontend'],
    status: 'published',
    roles: {
      participant: { credits: 5, maxCount: 50, currentCount: 32 },
    },
    prerequisites: ['Basic HTML/CSS knowledge', 'Laptop with VS Code installed'],
    outcomes: ['Hands-on project experience', 'Certificate of completion', 'Resource materials'],
    institution: { name: 'Tech University', logo: '/logos/tech-uni.png' },
    creator: { name: 'Dr. Mike Chen', avatar: '/avatars/dr-mike.jpg' },
    isRegistered: true,
    userRole: 'participant',
  },
  {
    id: '3',
    title: 'Annual Sports Meet 2024',
    description: 'Inter-department sports competition featuring various athletic events including track and field, team sports, and more.',
    type: 'sports',
    category: 'sports',
    startDate: '2024-03-01T08:00:00Z',
    endDate: '2024-03-03T18:00:00Z',
    venue: 'University Sports Complex',
    isOnline: false,
    maxParticipants: 500,
    currentParticipants: 342,
    registrationDeadline: '2024-02-25T23:59:00Z',
    tags: ['Sports', 'Athletics', 'Team Building', 'Inter-department'],
    status: 'published',
    roles: {
      organizer: { credits: 30, maxCount: 15, currentCount: 12 },
      volunteer: { credits: 20, maxCount: 30, currentCount: 25 },
      participant: { credits: 15, maxCount: 455, currentCount: 305 },
    },
    prerequisites: ['Medical fitness certificate', 'Department nomination'],
    outcomes: ['Medals and trophies', 'Participation certificates', 'Department championship'],
    institution: { name: 'Tech University', logo: '/logos/tech-uni.png' },
    creator: { name: 'Sports Committee', avatar: '/avatars/sports-committee.jpg' },
    isRegistered: false,
    userRole: null,
  },
];

interface EventsListProps {
  filters: {
    status: string;
    type: string;
    search: string;
    dateRange: string;
  };
  viewType: 'discover' | 'registered' | 'created' | 'past';
}

export function EventsList({ filters, viewType }: EventsListProps) {
  const [events, setEvents] = useState(mockEvents);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [filters, viewType]);

  // Filter events based on current filters and view type
  const filteredEvents = events.filter(event => {
    // View type filtering
    if (viewType === 'registered' && !event.isRegistered) return false;
    if (viewType === 'past' && new Date(event.endDate) > new Date()) return false;
    if (viewType === 'discover' && new Date(event.endDate) < new Date()) return false;

    // Status filtering
    if (filters.status !== 'all' && event.status !== filters.status) return false;
    
    // Type filtering
    if (filters.type !== 'all' && event.type !== filters.type) return false;
    
    // Search filtering
    if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !event.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'secondary';
      case 'ongoing':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'competition':
        return <Icons.trophy className="h-4 w-4" />;
      case 'workshop':
        return <Icons.book className="h-4 w-4" />;
      case 'seminar':
        return <Icons.user className="h-4 w-4" />;
      case 'cultural':
        return <Icons.star className="h-4 w-4" />;
      case 'sports':
        return <Icons.target className="h-4 w-4" />;
      default:
        return <Icons.calendar className="h-4 w-4" />;
    }
  };

  const getRegistrationStatus = (event: typeof mockEvents[0]) => {
    const now = new Date();
    const deadline = new Date(event.registrationDeadline);
    const startDate = new Date(event.startDate);
    
    if (now > startDate) return 'closed';
    if (now > deadline) return 'deadline-passed';
    if (event.currentParticipants >= event.maxParticipants) return 'full';
    return 'open';
  };

  const handleRegister = async (eventId: string, role: string) => {
    // Here you would make API call to register for event
    console.log(`Registering for event ${eventId} as ${role}`);
    
    // Update local state
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: true, userRole: role, currentParticipants: event.currentParticipants + 1 }
        : event
    ));
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            {viewType === 'registered'
              ? "You haven't registered for any events yet."
              : viewType === 'past'
              ? "No past events to display."
              : "No events match your current filters."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {filteredEvents.map((event) => {
        const registrationStatus = getRegistrationStatus(event);
        const availableRoles = Object.entries(event.roles).filter(([_, role]) => role.currentCount < role.maxCount);
        
        return (
          <Card key={event.id} className="card-hover overflow-hidden">
            <div className="flex">
              {/* Event Image/Poster */}
              <div className="w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 hidden md:block">
                <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                  {getTypeIcon(event.type)}
                </div>
              </div>

              {/* Event Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <Badge variant={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                      {event.isRegistered && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Registered
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Icons.calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {event.isOnline ? (
                          <>
                            <Icons.globe className="h-4 w-4 text-muted-foreground" />
                            <span>Online Event</span>
                          </>
                        ) : (
                          <>
                            <Icons.mapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.venue}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Icons.users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Icons.clock className="h-4 w-4 text-muted-foreground" />
                        <span>Register by {formatDate(event.registrationDeadline)}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {event.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{event.tags.length - 4} more
                        </Badge>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Registration Progress</span>
                        <span>{Math.round((event.currentParticipants / event.maxParticipants) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(event.currentParticipants / event.maxParticipants) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                          <Icons.eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                    </Dialog>

                    {registrationStatus === 'open' && !event.isRegistered && (
                      <div className="space-y-2">
                        {availableRoles.map(([roleName, roleInfo]) => (
                          <Button 
                            key={roleName}
                            size="sm" 
                            onClick={() => handleRegister(event.id, roleName)}
                            className="w-full"
                          >
                            <Icons.userPlus className="h-4 w-4 mr-1" />
                            Join as {roleName}
                            <span className="ml-1 text-xs">({roleInfo.credits} credits)</span>
                          </Button>
                        ))}
                      </div>
                    )}

                    {registrationStatus === 'closed' && (
                      <Badge variant="outline" className="justify-center">
                        Registration Closed
                      </Badge>
                    )}

                    {registrationStatus === 'full' && (
                      <Badge variant="outline" className="justify-center">
                        Event Full
                      </Badge>
                    )}

                    {event.isRegistered && (
                      <Button variant="outline" size="sm" className="text-green-600">
                        <Icons.check className="h-4 w-4 mr-1" />
                        Registered as {event.userRole}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getTypeIcon(selectedEvent.type)}
                {selectedEvent.title}
              </DialogTitle>
              <DialogDescription>
                Complete event information and registration details
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Event Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Event Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icons.calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedEvent.isOnline ? (
                        <>
                          <Icons.globe className="h-4 w-4 text-muted-foreground" />
                          <span>Online Event</span>
                        </>
                      ) : (
                        <>
                          <Icons.mapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedEvent.venue}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.currentParticipants}/{selectedEvent.maxParticipants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.clock className="h-4 w-4 text-muted-foreground" />
                      <span>Registration closes {formatRelativeTime(selectedEvent.registrationDeadline)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Organizer</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Icons.user className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedEvent.creator.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedEvent.institution.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">About This Event</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Prerequisites */}
              {selectedEvent.prerequisites.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Prerequisites</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedEvent.prerequisites.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcomes */}
              {selectedEvent.outcomes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">What You'll Get</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedEvent.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Available Roles */}
              <div>
                <h4 className="font-medium mb-3">Available Roles</h4>
                <div className="grid gap-3">
                  {Object.entries(selectedEvent.roles).map(([roleName, roleInfo]) => (
                    <div key={roleName} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{roleName}</p>
                        <p className="text-sm text-muted-foreground">
                          {roleInfo.currentCount}/{roleInfo.maxCount} positions filled • {roleInfo.credits} credits
                        </p>
                      </div>
                      {roleInfo.currentCount >= roleInfo.maxCount ? (
                        <Badge variant="outline">Full</Badge>
                      ) : selectedEvent.isRegistered && selectedEvent.userRole === roleName ? (
                        <Badge variant="default">Registered</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleRegister(selectedEvent.id, roleName)}
                          disabled={selectedEvent.isRegistered}
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-medium mb-2">Topics & Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
