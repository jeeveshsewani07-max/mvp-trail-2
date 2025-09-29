'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { Icons } from '@/components/icons';
import { skillCategories, formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';

const achievementSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dateAchieved: z.date({
    required_error: 'Please select the achievement date',
  }),
  skillTags: z.array(z.string()).min(1, 'Please select at least one skill'),
  isPublic: z.boolean(),
});

type AchievementForm = z.infer<typeof achievementSchema>;

// Mock categories - would come from API
const categories = [
  { id: '1', name: 'Technical', icon: '💻', description: 'Programming, software development, technical certifications' },
  { id: '2', name: 'Competition', icon: '🏆', description: 'Hackathons, contests, competitive programming' },
  { id: '3', name: 'Research', icon: '📚', description: 'Research papers, publications, academic projects' },
  { id: '4', name: 'Professional', icon: '💼', description: 'Internships, work experience, industry projects' },
  { id: '5', name: 'Leadership', icon: '👥', description: 'Team leadership, management roles, organizing events' },
  { id: '6', name: 'Community Service', icon: '🤝', description: 'Volunteer work, social initiatives, community projects' },
  { id: '7', name: 'Sports', icon: '⚽', description: 'Athletic achievements, sports competitions, fitness goals' },
  { id: '8', name: 'Arts & Culture', icon: '🎨', description: 'Creative works, cultural activities, artistic achievements' },
];

export function AddAchievementForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [date, setDate] = useState<Date>();
  const [isDateOpen, setIsDateOpen] = useState(false);
  
  const router = useRouter();
  const certificateInputRef = useRef<HTMLInputElement>(null);
  const evidenceInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AchievementForm>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      skillTags: [],
      isPublic: true,
    },
  });

  const watchedSkills = watch('skillTags');
  const watchedTitle = watch('title');
  const watchedDescription = watch('description');

  // Get all available skills from categories
  const allSkills = Object.values(skillCategories).flat();

  const onSubmit = async (data: AchievementForm) => {
    setIsLoading(true);
    
    try {
      // Here you would upload files and submit to API
      console.log('Form data:', data);
      console.log('Certificate file:', certificateFile);
      console.log('Evidence files:', evidenceFiles);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Achievement submitted successfully!');
      toast.info('Your achievement is now pending faculty approval.');
      
      router.push('/achievements');
    } catch (error) {
      toast.error('Failed to submit achievement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!file.type.includes('pdf') && !file.type.includes('image')) {
        toast.error('Please upload a PDF or image file');
        return;
      }
      setCertificateFile(file);
    }
  };

  const handleEvidenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      if (!file.type.includes('pdf') && !file.type.includes('image')) {
        toast.error(`${file.name} is not a supported format`);
        return false;
      }
      return true;
    });
    
    setEvidenceFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeEvidenceFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <Icons.fileText className="h-4 w-4" />;
    return <Icons.image className="h-4 w-4" />;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Achievement Category *</Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            setValue('categoryId', value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select achievement category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-start gap-3 py-2">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-muted-foreground">{category.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Achievement Title *</Label>
        <Input
          {...register('title')}
          id="title"
          placeholder="e.g., Web Development Certificate, Hackathon Winner"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {watchedTitle?.length || 0}/100 characters
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          {...register('description')}
          id="description"
          placeholder="Describe your achievement, what you learned, and any notable outcomes..."
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {watchedDescription?.length || 0}/500 characters
        </p>
      </div>

      {/* Achievement Date */}
      <div className="space-y-2">
        <Label>Achievement Date *</Label>
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <Icons.calendar className="mr-2 h-4 w-4" />
              {date ? formatDate(date) : <span>Pick achievement date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setValue('dateAchieved', selectedDate!);
                setIsDateOpen(false);
              }}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dateAchieved && (
          <p className="text-sm text-red-500">{errors.dateAchieved.message}</p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label htmlFor="skills">Related Skills & Technologies *</Label>
        <MultiSelect
          options={allSkills.map(skill => ({ label: skill, value: skill }))}
          value={watchedSkills || []}
          onChange={(values) => setValue('skillTags', values)}
          placeholder="Select relevant skills..."
          maxItems={10}
        />
        {errors.skillTags && (
          <p className="text-sm text-red-500">{errors.skillTags.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Select skills that best represent your achievement
        </p>
      </div>

      {/* Certificate Upload */}
      <div className="space-y-2">
        <Label>Certificate/Document (Optional)</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          {certificateFile ? (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {getFileIcon(certificateFile)}
                <div>
                  <p className="text-sm font-medium">{certificateFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(certificateFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCertificateFile(null)}
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
                onClick={() => certificateInputRef.current?.click()}
              >
                Choose Certificate File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={certificateInputRef}
          onChange={handleCertificateUpload}
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
        />
      </div>

      {/* Evidence Files */}
      <div className="space-y-2">
        <Label>Evidence Files (Optional)</Label>
        <p className="text-xs text-muted-foreground">
          Upload screenshots, project images, or other supporting documents
        </p>
        
        {evidenceFiles.length > 0 && (
          <div className="space-y-2">
            {evidenceFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  {getFileIcon(file)}
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEvidenceFile(index)}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {evidenceFiles.length < 5 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => evidenceInputRef.current?.click()}
            className="w-full"
          >
            <Icons.plus className="h-4 w-4 mr-2" />
            Add Evidence Files ({evidenceFiles.length}/5)
          </Button>
        )}

        <input
          type="file"
          ref={evidenceInputRef}
          onChange={handleEvidenceUpload}
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
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
        <Label htmlFor="isPublic" className="text-sm">
          Make this achievement visible to recruiters and in public profile
        </Label>
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
              Submitting...
            </>
          ) : (
            <>
              <Icons.send className="mr-2 h-4 w-4" />
              Submit for Approval
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

