import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  uuid,
  jsonb,
  real,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'student',
  'faculty',
  'recruiter',
  'institution_admin',
  'super_admin',
]);

export const privacyModeEnum = pgEnum('privacy_mode', [
  'private',
  'faculty_only',
  'recruiter_visible',
  'public',
]);

export const achievementStatusEnum = pgEnum('achievement_status', [
  'pending',
  'approved',
  'rejected',
]);

export const eventStatusEnum = pgEnum('event_status', [
  'draft',
  'published',
  'ongoing',
  'completed',
  'cancelled',
]);

export const applicationStatusEnum = pgEnum('application_status', [
  'applied',
  'shortlisted',
  'rejected',
  'selected',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'achievement_approved',
  'achievement_rejected',
  'event_invitation',
  'recruiter_view',
  'badge_earned',
  'faculty_feedback',
  'job_application_update',
]);

// Core Tables
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  avatar: text('avatar'),
  role: userRoleEnum('role').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false),
  privacyMode: privacyModeEnum('privacy_mode').default('faculty_only'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}));

export const institutions = pgTable('institutions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  type: text('type').notNull(), // university, college, institute
  address: jsonb('address').$type<{
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  }>(),
  logo: text('logo'),
  website: text('website'),
  naacGrade: text('naac_grade'),
  nirfRanking: integer('nirf_ranking'),
  isVerified: boolean('is_verified').default(false),
  settings: jsonb('settings').$type<{
    creditSystem: { enabled: boolean; pointsPerHour: number };
    badgeSystem: { enabled: boolean; customBadges: string[] };
    branding: { primaryColor: string; secondaryColor: string };
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  institutionId: uuid('institution_id').notNull().references(() => institutions.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  code: text('code').notNull(),
  headOfDepartment: uuid('head_of_department').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  institutionCodeIdx: uniqueIndex('dept_institution_code_idx').on(table.institutionId, table.code),
}));

export const studentProfiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  institutionId: uuid('institution_id').notNull().references(() => institutions.id),
  departmentId: uuid('department_id').references(() => departments.id),
  rollNumber: text('roll_number').notNull(),
  batch: text('batch'), // 2021-2025
  course: text('course'), // BTech, MTech, etc
  specialization: text('specialization'),
  currentYear: integer('current_year'),
  currentSemester: integer('current_semester'),
  cgpa: real('cgpa'),
  skills: text('skills').array(), // Array of skill tags
  interests: text('interests').array(),
  languages: text('languages').array(),
  portfolioUrl: text('portfolio_url'),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  resumeUrl: text('resume_url'),
  qrCode: text('qr_code'), // Generated QR code for digital ID
  totalCredits: integer('total_credits').default(0),
  achievements: integer('achievements').default(0),
  badges: text('badges').array().default([]),
  isProfileComplete: boolean('is_profile_complete').default(false),
  mentorId: uuid('mentor_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: uniqueIndex('profiles_user_idx').on(table.userId),
  rollNumberIdx: index('profiles_roll_number_idx').on(table.rollNumber),
}));

export const facultyProfiles = pgTable('faculty_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  institutionId: uuid('institution_id').notNull().references(() => institutions.id),
  departmentId: uuid('department_id').references(() => departments.id),
  designation: text('designation').notNull(),
  employeeId: text('employee_id'),
  specialization: text('specialization'),
  qualifications: text('qualifications').array(),
  experience: integer('experience'), // in years
  researchAreas: text('research_areas').array(),
  publications: integer('publications').default(0),
  canMentor: boolean('can_mentor').default(true),
  maxMentees: integer('max_mentees').default(20),
  currentMentees: integer('current_mentees').default(0),
  approvalPower: jsonb('approval_power').$type<{
    canApproveAchievements: boolean;
    canCreateEvents: boolean;
    maxCreditValue: number;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: uniqueIndex('faculty_profiles_user_idx').on(table.userId),
}));

export const recruiterProfiles = pgTable('recruiter_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  companyName: text('company_name').notNull(),
  designation: text('designation').notNull(),
  companyWebsite: text('company_website'),
  companyLogo: text('company_logo'),
  companySize: text('company_size'),
  industry: text('industry'),
  companyDescription: text('company_description'),
  linkedinUrl: text('linkedin_url'),
  isVerified: boolean('is_verified').default(false),
  canPostJobs: boolean('can_post_jobs').default(true),
  creditsBalance: integer('credits_balance').default(100), // For posting jobs, viewing profiles
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: uniqueIndex('recruiter_profiles_user_idx').on(table.userId),
}));

// Achievement System
export const achievementCategories = pgTable('achievement_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  creditMultiplier: real('credit_multiplier').default(1.0),
  tags: text('tags').array().default([]),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').notNull().references(() => studentProfiles.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => achievementCategories.id),
  title: text('title').notNull(),
  description: text('description'),
  dateAchieved: timestamp('date_achieved').notNull(),
  certificateUrl: text('certificate_url'),
  evidenceUrls: text('evidence_urls').array().default([]),
  skillTags: text('skill_tags').array().default([]),
  status: achievementStatusEnum('status').default('pending'),
  credits: integer('credits').default(0),
  approvedBy: uuid('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  rejectionReason: text('rejection_reason'),
  isPublic: boolean('is_public').default(true),
  verificationHash: text('verification_hash'), // For blockchain/verification
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  studentIdx: index('achievements_student_idx').on(table.studentId),
  statusIdx: index('achievements_status_idx').on(table.status),
  categoryIdx: index('achievements_category_idx').on(table.categoryId),
}));

// Event System
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  institutionId: uuid('institution_id').notNull().references(() => institutions.id),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(), // workshop, seminar, competition, cultural, sports
  category: text('category'), // technical, cultural, sports, social
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  venue: text('venue'),
  isOnline: boolean('is_online').default(false),
  meetingLink: text('meeting_link'),
  maxParticipants: integer('max_participants'),
  currentParticipants: integer('current_participants').default(0),
  registrationDeadline: timestamp('registration_deadline'),
  poster: text('poster'),
  tags: text('tags').array().default([]),
  status: eventStatusEnum('status').default('draft'),
  roles: jsonb('roles').$type<{
    organizer: { credits: number; maxCount: number; currentCount: number };
    volunteer: { credits: number; maxCount: number; currentCount: number };
    participant: { credits: number; maxCount: number; currentCount: number };
  }>(),
  prerequisites: text('prerequisites').array().default([]),
  outcomes: text('outcomes').array().default([]),
  certificateTemplate: text('certificate_template'),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  institutionIdx: index('events_institution_idx').on(table.institutionId),
  statusIdx: index('events_status_idx').on(table.status),
  startDateIdx: index('events_start_date_idx').on(table.startDate),
}));

export const eventParticipations = pgTable('event_participations', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => studentProfiles.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // participant, organizer, volunteer
  status: text('status').default('registered'), // registered, attended, completed, cancelled
  creditsEarned: integer('credits_earned').default(0),
  feedback: text('feedback'),
  rating: integer('rating'), // 1-5
  certificateUrl: text('certificate_url'),
  attendanceProof: text('attendance_proof'),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  eventStudentIdx: uniqueIndex('event_participations_event_student_idx').on(table.eventId, table.studentId),
}));

// Job & Recruitment System
export const jobPostings = pgTable('job_postings', {
  id: uuid('id').defaultRandom().primaryKey(),
  recruiterId: uuid('recruiter_id').notNull().references(() => recruiterProfiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // full-time, part-time, internship, contract
  location: text('location'),
  isRemote: boolean('is_remote').default(false),
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  currency: text('currency').default('INR'),
  experience: text('experience'), // 0-1, 1-3, 3-5, 5+
  skillsRequired: text('skills_required').array().default([]),
  qualifications: text('qualifications').array().default([]),
  benefits: text('benefits').array().default([]),
  applicationDeadline: timestamp('application_deadline'),
  maxApplications: integer('max_applications'),
  currentApplications: integer('current_applications').default(0),
  isActive: boolean('is_active').default(true),
  priority: integer('priority').default(0), // For featured listings
  institutionFilter: uuid('institution_filter').array(), // Target specific institutions
  departmentFilter: uuid('department_filter').array(),
  batchFilter: text('batch_filter').array(),
  cgpaMin: real('cgpa_min'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  recruiterIdx: index('job_postings_recruiter_idx').on(table.recruiterId),
  isActiveIdx: index('job_postings_is_active_idx').on(table.isActive),
  deadlineIdx: index('job_postings_deadline_idx').on(table.applicationDeadline),
}));

export const jobApplications = pgTable('job_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').notNull().references(() => jobPostings.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => studentProfiles.id, { onDelete: 'cascade' }),
  coverLetter: text('cover_letter'),
  resumeUrl: text('resume_url'),
  portfolioUrl: text('portfolio_url'),
  status: applicationStatusEnum('status').default('applied'),
  recruiterNotes: text('recruiter_notes'),
  interviewDate: timestamp('interview_date'),
  feedbackFromRecruiter: text('feedback_from_recruiter'),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  jobStudentIdx: uniqueIndex('job_applications_job_student_idx').on(table.jobId, table.studentId),
  statusIdx: index('job_applications_status_idx').on(table.status),
}));

// Notification System
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  data: jsonb('data'), // Additional context data
  isRead: boolean('is_read').default(false),
  actionUrl: text('action_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
}));

// Badge System
export const badges = pgTable('badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  criteria: jsonb('criteria').$type<{
    type: 'achievement_count' | 'credit_threshold' | 'event_participation' | 'skill_based';
    parameters: Record<string, any>;
  }>(),
  rarity: text('rarity').default('common'), // common, uncommon, rare, legendary
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const studentBadges = pgTable('student_badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').notNull().references(() => studentProfiles.id, { onDelete: 'cascade' }),
  badgeId: uuid('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
  verificationData: jsonb('verification_data'),
}, (table) => ({
  studentBadgeIdx: uniqueIndex('student_badges_student_badge_idx').on(table.studentId, table.badgeId),
}));

// Analytics & Reporting
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  eventType: text('event_type').notNull(),
  eventData: jsonb('event_data'),
  sessionId: text('session_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  eventTypeIdx: index('analytics_events_event_type_idx').on(table.eventType),
  timestampIdx: index('analytics_events_timestamp_idx').on(table.timestamp),
}));

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  studentProfile: one(studentProfiles),
  facultyProfile: one(facultyProfiles),
  recruiterProfile: one(recruiterProfiles),
  createdEvents: many(events),
  notifications: many(notifications),
}));

export const institutionsRelations = relations(institutions, ({ many }) => ({
  departments: many(departments),
  students: many(studentProfiles),
  faculty: many(facultyProfiles),
  events: many(events),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [departments.institutionId],
    references: [institutions.id],
  }),
  head: one(users, {
    fields: [departments.headOfDepartment],
    references: [users.id],
  }),
  students: many(studentProfiles),
  faculty: many(facultyProfiles),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
  institution: one(institutions, {
    fields: [studentProfiles.institutionId],
    references: [institutions.id],
  }),
  department: one(departments, {
    fields: [studentProfiles.departmentId],
    references: [departments.id],
  }),
  mentor: one(users, {
    fields: [studentProfiles.mentorId],
    references: [users.id],
  }),
  achievements: many(achievements),
  eventParticipations: many(eventParticipations),
  jobApplications: many(jobApplications),
  badges: many(studentBadges),
}));

export const facultyProfilesRelations = relations(facultyProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [facultyProfiles.userId],
    references: [users.id],
  }),
  institution: one(institutions, {
    fields: [facultyProfiles.institutionId],
    references: [institutions.id],
  }),
  department: one(departments, {
    fields: [facultyProfiles.departmentId],
    references: [departments.id],
  }),
  approvedAchievements: many(achievements),
}));

export const recruiterProfilesRelations = relations(recruiterProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [recruiterProfiles.userId],
    references: [users.id],
  }),
  jobPostings: many(jobPostings),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [achievements.studentId],
    references: [studentProfiles.id],
  }),
  category: one(achievementCategories, {
    fields: [achievements.categoryId],
    references: [achievementCategories.id],
  }),
  approver: one(users, {
    fields: [achievements.approvedBy],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [events.institutionId],
    references: [institutions.id],
  }),
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  participations: many(eventParticipations),
}));

export const eventParticipationsRelations = relations(eventParticipations, ({ one }) => ({
  event: one(events, {
    fields: [eventParticipations.eventId],
    references: [events.id],
  }),
  student: one(studentProfiles, {
    fields: [eventParticipations.studentId],
    references: [studentProfiles.id],
  }),
}));

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  recruiter: one(recruiterProfiles, {
    fields: [jobPostings.recruiterId],
    references: [recruiterProfiles.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobPostings, {
    fields: [jobApplications.jobId],
    references: [jobPostings.id],
  }),
  student: one(studentProfiles, {
    fields: [jobApplications.studentId],
    references: [studentProfiles.id],
  }),
}));

export const studentBadgesRelations = relations(studentBadges, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [studentBadges.studentId],
    references: [studentProfiles.id],
  }),
  badge: one(badges, {
    fields: [studentBadges.badgeId],
    references: [badges.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
