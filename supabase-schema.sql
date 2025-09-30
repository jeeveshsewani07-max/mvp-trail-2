-- Smart Student Hub Database Schema
-- Run this script in your Supabase SQL Editor

-- Create enums first
CREATE TYPE user_role AS ENUM (
  'student',
  'faculty', 
  'recruiter',
  'institution_admin',
  'super_admin'
);

CREATE TYPE privacy_mode AS ENUM (
  'private',
  'faculty_only',
  'recruiter_visible', 
  'public'
);

CREATE TYPE achievement_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE event_status AS ENUM (
  'draft',
  'published',
  'ongoing',
  'completed',
  'cancelled'
);

CREATE TYPE application_status AS ENUM (
  'applied',
  'shortlisted',
  'rejected',
  'selected'
);

CREATE TYPE notification_type AS ENUM (
  'achievement_approved',
  'achievement_rejected',
  'event_invitation',
  'recruiter_view',
  'badge_earned',
  'faculty_feedback',
  'job_application_update'
);

-- Core Tables
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar TEXT,
  role user_role NOT NULL,
  is_email_verified BOOLEAN DEFAULT false,
  privacy_mode privacy_mode DEFAULT 'faculty_only',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX users_email_idx ON users(email);

CREATE TABLE institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  address JSONB,
  logo TEXT,
  website TEXT,
  naac_grade TEXT,
  nirf_ranking INTEGER,
  is_verified BOOLEAN DEFAULT false,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  head_of_department UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX dept_institution_code_idx ON departments(institution_id, code);

CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  institution_id UUID NOT NULL REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  roll_number TEXT NOT NULL,
  batch TEXT,
  course TEXT,
  specialization TEXT,
  current_year INTEGER,
  current_semester INTEGER,
  cgpa REAL,
  skills TEXT[],
  interests TEXT[],
  languages TEXT[],
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  resume_url TEXT,
  qr_code TEXT,
  total_credits INTEGER DEFAULT 0,
  achievements INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  is_profile_complete BOOLEAN DEFAULT false,
  mentor_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX profiles_user_idx ON profiles(user_id);
CREATE INDEX profiles_roll_number_idx ON profiles(roll_number);

CREATE TABLE faculty_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  institution_id UUID NOT NULL REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  designation TEXT NOT NULL,
  employee_id TEXT,
  specialization TEXT,
  qualifications TEXT[],
  experience INTEGER,
  research_areas TEXT[],
  publications INTEGER DEFAULT 0,
  can_mentor BOOLEAN DEFAULT true,
  max_mentees INTEGER DEFAULT 20,
  current_mentees INTEGER DEFAULT 0,
  approval_power JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX faculty_profiles_user_idx ON faculty_profiles(user_id);

CREATE TABLE recruiter_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  company_website TEXT,
  company_logo TEXT,
  company_size TEXT,
  industry TEXT,
  company_description TEXT,
  linkedin_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  can_post_jobs BOOLEAN DEFAULT true,
  credits_balance INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX recruiter_profiles_profile_idx ON recruiter_profiles(profile_id);

-- Achievement System
CREATE TABLE achievement_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  credit_multiplier REAL DEFAULT 1.0,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES achievement_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  date_achieved TIMESTAMP NOT NULL,
  certificate_url TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  skill_tags TEXT[] DEFAULT '{}',
  status achievement_status DEFAULT 'pending',
  credits INTEGER DEFAULT 0,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  is_public BOOLEAN DEFAULT true,
  verification_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX achievements_student_idx ON achievements(student_id);
CREATE INDEX achievements_status_idx ON achievements(status);
CREATE INDEX achievements_category_idx ON achievements(category_id);

-- Event System
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID NOT NULL REFERENCES institutions(id),
  created_by UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  category TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  venue TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_deadline TIMESTAMP,
  poster TEXT,
  tags TEXT[] DEFAULT '{}',
  status event_status DEFAULT 'draft',
  roles JSONB,
  prerequisites TEXT[] DEFAULT '{}',
  outcomes TEXT[] DEFAULT '{}',
  certificate_template TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX events_institution_idx ON events(institution_id);
CREATE INDEX events_status_idx ON events(status);
CREATE INDEX events_start_date_idx ON events(start_date);

CREATE TABLE event_participations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'registered',
  credits_earned INTEGER DEFAULT 0,
  feedback TEXT,
  rating INTEGER,
  certificate_url TEXT,
  attendance_proof TEXT,
  registered_at TIMESTAMP DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP
);

CREATE UNIQUE INDEX event_participations_event_student_idx ON event_participations(event_id, student_id);

-- Job & Recruitment System
CREATE TABLE job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  is_remote BOOLEAN DEFAULT false,
  salary_min INTEGER,
  salary_max INTEGER,
  currency TEXT DEFAULT 'INR',
  experience TEXT,
  skills_required TEXT[] DEFAULT '{}',
  qualifications TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  application_deadline TIMESTAMP,
  max_applications INTEGER,
  current_applications INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  institution_filter UUID[],
  department_filter UUID[],
  batch_filter TEXT[],
  cgpa_min REAL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX job_postings_recruiter_idx ON job_postings(recruiter_id);
CREATE INDEX job_postings_is_active_idx ON job_postings(is_active);
CREATE INDEX job_postings_deadline_idx ON job_postings(application_deadline);

CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  status application_status DEFAULT 'applied',
  recruiter_notes TEXT,
  interview_date TIMESTAMP,
  feedback_from_recruiter TEXT,
  applied_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX job_applications_job_student_idx ON job_applications(job_id, student_id);
CREATE INDEX job_applications_status_idx ON job_applications(status);

-- Notification System
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX notifications_user_idx ON notifications(user_id);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);

-- Badge System
CREATE TABLE badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  criteria JSONB,
  rarity TEXT DEFAULT 'common',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE student_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW() NOT NULL,
  verification_data JSONB
);

CREATE UNIQUE INDEX student_badges_student_badge_idx ON student_badges(student_id, badge_id);

-- Analytics & Reporting
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX analytics_events_event_type_idx ON analytics_events(event_type);
CREATE INDEX analytics_events_timestamp_idx ON analytics_events(timestamp);

-- Insert some default achievement categories
INSERT INTO achievement_categories (name, description, icon, credit_multiplier) VALUES
('Technical Certification', 'Programming, Cloud, and Technical Certifications', 'code', 1.0),
('Competition', 'Hackathons, Coding Contests, and Competitions', 'trophy', 1.5),
('Project', 'Personal and Academic Projects', 'folder', 1.0),
('Research', 'Research Papers, Publications, and Patents', 'bookOpen', 2.0),
('Leadership', 'Leadership roles and positions', 'users', 1.2),
('Volunteer', 'Community service and volunteer work', 'heart', 0.8),
('Sports', 'Sports achievements and participation', 'activity', 0.8),
('Cultural', 'Cultural activities and competitions', 'music', 0.8),
('Professional', 'Work experience and internships', 'briefcase', 1.3);

-- Insert some default badges
INSERT INTO badges (name, description, icon, criteria, rarity) VALUES
('First Achievement', 'Earned your first achievement', 'star', '{"type": "achievement_count", "parameters": {"count": 1}}', 'common'),
('Achievement Hunter', 'Earned 10 achievements', 'target', '{"type": "achievement_count", "parameters": {"count": 10}}', 'uncommon'),
('Credit Master', 'Earned 100 credits', 'award', '{"type": "credit_threshold", "parameters": {"credits": 100}}', 'rare'),
('Event Enthusiast', 'Participated in 5 events', 'calendar', '{"type": "event_participation", "parameters": {"count": 5}}', 'uncommon'),
('Tech Expert', 'Earned 5 technical achievements', 'cpu', '{"type": "skill_based", "parameters": {"category": "Technical Certification", "count": 5}}', 'rare');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your needs)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Students can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Faculty can view their own profile" ON faculty_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Faculty can update their own profile" ON faculty_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Faculty can insert their own profile" ON faculty_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recruiters can view their own profile" ON recruiter_profiles FOR SELECT USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = profile_id));
CREATE POLICY "Recruiters can update their own profile" ON recruiter_profiles FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = profile_id));
CREATE POLICY "Recruiters can insert their own profile" ON recruiter_profiles FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = profile_id));

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_profiles_updated_at BEFORE UPDATE ON faculty_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recruiter_profiles_updated_at BEFORE UPDATE ON recruiter_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
