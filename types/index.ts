import { type InferSelectModel } from 'drizzle-orm';
import {
  users,
  institutions,
  departments,
  studentProfiles,
  facultyProfiles,
  recruiterProfiles,
  achievements,
  achievementCategories,
  events,
  eventParticipations,
  jobPostings,
  jobApplications,
  notifications,
  badges,
  studentBadges,
} from '@/lib/db/schema';

// Database model types
export type User = InferSelectModel<typeof users>;
export type Institution = InferSelectModel<typeof institutions>;
export type Department = InferSelectModel<typeof departments>;
export type StudentProfile = InferSelectModel<typeof studentProfiles>;
export type FacultyProfile = InferSelectModel<typeof facultyProfiles>;
export type RecruiterProfile = InferSelectModel<typeof recruiterProfiles>;
export type Achievement = InferSelectModel<typeof achievements>;
export type AchievementCategory = InferSelectModel<typeof achievementCategories>;
export type Event = InferSelectModel<typeof events>;
export type EventParticipation = InferSelectModel<typeof eventParticipations>;
export type JobPosting = InferSelectModel<typeof jobPostings>;
export type JobApplication = InferSelectModel<typeof jobApplications>;
export type Notification = InferSelectModel<typeof notifications>;
export type Badge = InferSelectModel<typeof badges>;
export type StudentBadge = InferSelectModel<typeof studentBadges>;

// Extended types with relationships
export type StudentWithProfile = User & {
  studentProfile: StudentProfile & {
    institution: Institution;
    department: Department | null;
    mentor: User | null;
  };
};

export type FacultyWithProfile = User & {
  facultyProfile: FacultyProfile & {
    institution: Institution;
    department: Department | null;
  };
};

export type RecruiterWithProfile = User & {
  recruiterProfile: RecruiterProfile;
};

export type AchievementWithDetails = Achievement & {
  student: StudentProfile & {
    user: User;
    institution: Institution;
  };
  category: AchievementCategory;
  approver: User | null;
};

export type EventWithDetails = Event & {
  institution: Institution;
  creator: User;
  _count: {
    participations: number;
  };
};

export type JobWithDetails = JobPosting & {
  recruiter: RecruiterProfile & {
    user: User;
  };
  _count: {
    applications: number;
  };
};

export type ApplicationWithDetails = JobApplication & {
  job: JobPosting & {
    recruiter: RecruiterProfile & {
      user: User;
    };
  };
  student: StudentProfile & {
    user: User;
    institution: Institution;
  };
};

// Form types
export interface LoginForm {
  email: string;
}

export interface GoogleAuthForm {
  redirectTo?: string;
}

export interface StudentOnboardingForm {
  institutionId: string;
  departmentId?: string;
  rollNumber: string;
  batch: string;
  course: string;
  specialization?: string;
  currentYear: number;
  currentSemester: number;
  skills: string[];
  interests: string[];
  languages: string[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface FacultyOnboardingForm {
  institutionId: string;
  departmentId?: string;
  designation: string;
  employeeId?: string;
  specialization?: string;
  qualifications: string[];
  experience: number;
  researchAreas: string[];
  canMentor: boolean;
  maxMentees: number;
}

export interface RecruiterOnboardingForm {
  companyName: string;
  designation: string;
  companyWebsite?: string;
  companySize?: string;
  industry: string;
  companyDescription?: string;
  linkedinUrl?: string;
}

export interface AchievementForm {
  categoryId: string;
  title: string;
  description?: string;
  dateAchieved: Date;
  skillTags: string[];
  certificateFile?: File;
  evidenceFiles?: File[];
  isPublic: boolean;
}

export interface EventForm {
  title: string;
  description?: string;
  type: string;
  category?: string;
  startDate: Date;
  endDate: Date;
  venue?: string;
  isOnline: boolean;
  meetingLink?: string;
  maxParticipants?: number;
  registrationDeadline?: Date;
  posterFile?: File;
  tags: string[];
  roles: {
    organizer: { credits: number; maxCount: number };
    volunteer: { credits: number; maxCount: number };
    participant: { credits: number; maxCount: number };
  };
  prerequisites: string[];
  outcomes: string[];
  isPublic: boolean;
}

export interface JobPostingForm {
  title: string;
  description: string;
  type: string;
  location?: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  experience?: string;
  skillsRequired: string[];
  qualifications: string[];
  benefits: string[];
  applicationDeadline?: Date;
  maxApplications?: number;
  institutionFilter: string[];
  departmentFilter: string[];
  batchFilter: string[];
  cgpaMin?: number;
}

export interface JobApplicationForm {
  coverLetter?: string;
  resumeFile?: File;
  portfolioUrl?: string;
}

// Dashboard data types
export interface StudentDashboardData {
  profile: StudentWithProfile;
  stats: {
    achievements: number;
    credits: number;
    events: number;
    applications: number;
  };
  recentAchievements: AchievementWithDetails[];
  upcomingEvents: EventWithDetails[];
  jobRecommendations: JobWithDetails[];
  badges: (StudentBadge & { badge: Badge })[];
  notifications: Notification[];
}

export interface FacultyDashboardData {
  profile: FacultyWithProfile;
  stats: {
    mentees: number;
    pendingApprovals: number;
    eventsCreated: number;
    achievementsApproved: number;
  };
  pendingAchievements: AchievementWithDetails[];
  mentees: StudentWithProfile[];
  recentEvents: EventWithDetails[];
}

export interface RecruiterDashboardData {
  profile: RecruiterWithProfile;
  stats: {
    activeJobs: number;
    totalApplications: number;
    shortlisted: number;
    hired: number;
  };
  recentJobs: JobWithDetails[];
  recentApplications: ApplicationWithDetails[];
  topCandidates: StudentWithProfile[];
}

export interface InstitutionDashboardData {
  institution: Institution;
  stats: {
    totalStudents: number;
    totalFaculty: number;
    totalAchievements: number;
    totalEvents: number;
    departments: number;
  };
  departmentStats: Array<{
    department: Department;
    students: number;
    faculty: number;
    achievements: number;
  }>;
  recentAchievements: AchievementWithDetails[];
  upcomingEvents: EventWithDetails[];
  topPerformers: StudentWithProfile[];
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  institution?: string;
  department?: string;
  batch?: string;
  cgpaMin?: number;
  cgpaMax?: number;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
  jobType?: string;
  eventType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Notification types
export interface NotificationData {
  achievementId?: string;
  eventId?: string;
  jobId?: string;
  applicationId?: string;
  badgeId?: string;
  menteeId?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// Privacy and settings types
export interface PrivacySettings {
  profileVisibility: 'private' | 'faculty_only' | 'recruiter_visible' | 'public';
  showEmail: boolean;
  showPhone: boolean;
  showSocialLinks: boolean;
  allowRecruiterContact: boolean;
  allowMentorship: boolean;
  emailNotifications: {
    achievements: boolean;
    events: boolean;
    jobs: boolean;
    badges: boolean;
    general: boolean;
  };
}

// Analytics types
export interface AnalyticsData {
  profileViews: number;
  applicationsSent: number;
  eventsAttended: number;
  achievementsEarned: number;
  skillsGained: number;
  timeline: Array<{
    date: string;
    metric: string;
    value: number;
  }>;
}

// Export/Import types
export interface StudentPortfolio {
  profile: StudentWithProfile;
  achievements: AchievementWithDetails[];
  events: EventWithDetails[];
  skills: string[];
  badges: Badge[];
  analytics: AnalyticsData;
  generatedAt: Date;
}

export interface ResumeData {
  profile: StudentWithProfile;
  achievements: Achievement[];
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
}
