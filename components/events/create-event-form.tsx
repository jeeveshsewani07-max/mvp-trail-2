'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.string().min(1, 'Please select an event type'),
  category: z.string().optional(),
  startDate: z.date({
    required_error: 'Please select start date and time',
  }),
  endDate: z.date({
    required_error: 'Please select end date and time',
  }),
  venue: z.string().min(1, 'Venue is required'),
  isOnline: z.boolean(),
  meetingLink: z.string().url().optional().or(z.literal('')),
  maxParticipants: z.number().min(1, 'Must allow at least 1 participant'),
  registrationDeadline: z.date({
    required_error: 'Please select registration deadline',
  }),
  tags: z.array(z.string()).min(1, 'Please add at least one tag'),
  roles: z.object({
    organizer: z.object({
      credits: z.number().min(0),
      maxCount: z.number().min(1),
    }),
    volunteer: z.object({
      credits: z.number().min(0),
      maxCount: z.number().min(0),
    }),
    participant: z.object({
      credits: z.number().min(0),
      maxCount: z.number().min(1),
    }),
  }),
  prerequisites: z.array(z.string()),
  outcomes: z.array(z.string()),
  isPublic: z.boolean(),
});

type EventForm = z.infer<typeof eventSchema>;

const eventTypes = [
  { value: 'competition', label: 'Competition', icon: '🏆' },
  { value: 'workshop', label: 'Workshop', icon: '🛠️' },
  { value: 'seminar', label: 'Seminar', icon: '📢' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'technical', label: 'Technical', icon: '💻' },
];

const skillTags = [
  'Programming', 'Web Development', 'Mobile Development', 'AI/ML', 'Data Science',
  'Cybersecurity', 'Cloud Computing', 'DevOps', 'UI/UX Design', 'Leadership',
  'Project Management', 'Communication', 'Teamwork', 'Innovation', 'Research',
  'Entrepreneurship', 'Marketing', 'Finance', 'Analytics', 'Problem Solving',
];

export function CreateEventForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [regDeadline, setRegDeadline] = useState<Date>();
  
  const router = useRouter();
  const posterInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      tags: [],
      prerequisites: [''],
      outcomes: [''],
      isOnline: false,
      isPublic: true,
      roles: {
        organizer: { credits: 20, maxCount: 5 },
        volunteer: { credits: 10, maxCount: 10 },
        participant: { credits: 5, maxCount: 100 },
      },
    },
  });

  const { fields: prerequisiteFields, append: appendPrerequisite, remove: removePrerequisite } = useFieldArray({
    control,
    name: 'prerequisites',
  });

  const { fields: outcomeFields, append: appendOutcome, remove: removeOutcome } = useFieldArray({
    control,
    name: 'outcomes',
  });

  const watchedTags = watch('tags');
  const watchedIsOnline = watch('isOnline');
  const watchedTitle = watch('title');
  const watchedDescription = watch('description');

  const onSubmit = async (data: EventForm) => {
    // Validate dates
    if (data.endDate <= data.startDate) {
      toast.error('End date must be after start date');
      return;
    }

    if (data.registrationDeadline >= data.startDate) {
      toast.error('Registration deadline must be before event start date');
      return;
    }

    if (data.isOnline && !data.meetingLink) {
      toast.error('Meeting link is required for online events');
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would upload poster and submit to API
      console.log('Form data:', data);
      console.log('Poster file:', posterFile);

      // Filter out empty prerequisites and outcomes
      const cleanData = {
        ...data,
        prerequisites: data.prerequisites.filter(p => p.trim() !== ''),
        outcomes: data.outcomes.filter(o => o.trim() !== ''),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Event created successfully!');
      toast.info('Your event is now published and open for registration.');
      
      router.push('/events');
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePosterUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.includes('image')) {
        toast.error('Please upload an image file');
        return;
      }
      setPosterFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              {...register('title')}
              id="title"
              placeholder="e.g., TechFest 2024 - AI/ML Hackathon"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watchedTitle?.length || 0}/100 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type *</Label>
            <Select onValueChange={(value) => setValue('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Event Description *</Label>
          <Textarea
            {...register('description')}
            id="description"
            placeholder="Provide a detailed description of your event, including objectives, activities, and what participants can expect to learn or achieve..."
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {watchedDescription?.length || 0}/1000 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags & Topics *</Label>
          <MultiSelect
            options={skillTags.map(tag => ({ label: tag, value: tag }))}
            value={watchedTags || []}
            onChange={(values) => setValue('tags', values)}
            placeholder="Select relevant tags..."
            maxItems={8}
          />
          {errors.tags && (
            <p className="text-sm text-red-500">{errors.tags.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Choose tags that help students find your event
          </p>
        </div>
      </div>

      {/* Date & Time */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Schedule</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Event Start Date & Time *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  {startDate ? formatDate(startDate) : <span>Pick start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setValue('startDate', date!);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Event End Date & Time *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  {endDate ? formatDate(endDate) : <span>Pick end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setValue('endDate', date!);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Registration Deadline *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !regDeadline && 'text-muted-foreground'
                  )}
                >
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  {regDeadline ? formatDate(regDeadline) : <span>Pick deadline</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={regDeadline}
                  onSelect={(date) => {
                    setRegDeadline(date);
                    setValue('registrationDeadline', date!);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.registrationDeadline && (
              <p className="text-sm text-red-500">{errors.registrationDeadline.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Venue & Logistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Venue & Logistics</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isOnline"
            checked={watchedIsOnline}
            onCheckedChange={(checked) => setValue('isOnline', !!checked)}
          />
          <Label htmlFor="isOnline">This is an online event</Label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="venue">
              {watchedIsOnline ? 'Platform/Description' : 'Venue'} *
            </Label>
            <Input
              {...register('venue')}
              id="venue"
              placeholder={watchedIsOnline ? 'e.g., Google Meet, Zoom' : 'e.g., Main Auditorium, Lab 101'}
            />
            {errors.venue && (
              <p className="text-sm text-red-500">{errors.venue.message}</p>
            )}
          </div>

          {watchedIsOnline && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                {...register('meetingLink')}
                id="meetingLink"
                type="url"
                placeholder="https://meet.google.com/xxx-xxx-xxx"
              />
              {errors.meetingLink && (
                <p className="text-sm text-red-500">{errors.meetingLink.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Maximum Participants *</Label>
            <Input
              {...register('maxParticipants', { valueAsNumber: true })}
              id="maxParticipants"
              type="number"
              min="1"
              placeholder="100"
            />
            {errors.maxParticipants && (
              <p className="text-sm text-red-500">{errors.maxParticipants.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Roles & Credits */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Participation Roles & Credits</h3>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Organizer Role</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer-credits">Credits per Organizer</Label>
                <Input
                  {...register('roles.organizer.credits', { valueAsNumber: true })}
                  id="organizer-credits"
                  type="number"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer-count">Max Organizers</Label>
                <Input
                  {...register('roles.organizer.maxCount', { valueAsNumber: true })}
                  id="organizer-count"
                  type="number"
                  min="1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Volunteer Role</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volunteer-credits">Credits per Volunteer</Label>
                <Input
                  {...register('roles.volunteer.credits', { valueAsNumber: true })}
                  id="volunteer-credits"
                  type="number"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volunteer-count">Max Volunteers</Label>
                <Input
                  {...register('roles.volunteer.maxCount', { valueAsNumber: true })}
                  id="volunteer-count"
                  type="number"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Participant Role</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant-credits">Credits per Participant</Label>
                <Input
                  {...register('roles.participant.credits', { valueAsNumber: true })}
                  id="participant-credits"
                  type="number"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-count">Max Participants</Label>
                <Input
                  {...register('roles.participant.maxCount', { valueAsNumber: true })}
                  id="participant-count"
                  type="number"
                  min="1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Prerequisites (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          List any skills, requirements, or preparations needed for participation
        </p>
        
        <div className="space-y-3">
          {prerequisiteFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`prerequisites.${index}`)}
                placeholder={`Prerequisite ${index + 1}`}
              />
              {prerequisiteFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePrerequisite(index)}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendPrerequisite('')}
          >
            <Icons.plus className="h-4 w-4 mr-2" />
            Add Prerequisite
          </Button>
        </div>
      </div>

      {/* Outcomes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Expected Outcomes (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          What will participants gain from this event?
        </p>
        
        <div className="space-y-3">
          {outcomeFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`outcomes.${index}`)}
                placeholder={`Outcome ${index + 1}`}
              />
              {outcomeFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOutcome(index)}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendOutcome('')}
          >
            <Icons.plus className="h-4 w-4 mr-2" />
            Add Outcome
          </Button>
        </div>
      </div>

      {/* Poster Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Event Poster (Optional)</h3>
        
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          {posterFile ? (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Icons.image className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">{posterFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(posterFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPosterFile(null)}
              >
                <Icons.x className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Icons.upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <Button
                type="button"
                variant="outline"
                onClick={() => posterInputRef.current?.click()}
              >
                Upload Event Poster
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG up to 5MB
              </p>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={posterInputRef}
          onChange={handlePosterUpload}
          accept=".jpg,.jpeg,.png"
          className="hidden"
        />
      </div>

      {/* Privacy Setting */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPublic"
          checked={watch('isPublic')}
          onCheckedChange={(checked) => setValue('isPublic', !!checked)}
        />
        <Label htmlFor="isPublic">Make this event publicly visible to all students</Label>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Creating Event...
            </>
          ) : (
            <>
              <Icons.calendar className="mr-2 h-4 w-4" />
              Create Event
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
