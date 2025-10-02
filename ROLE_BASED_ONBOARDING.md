# Role-Based Onboarding Implementation

This document describes the implementation of role-based onboarding using Supabase for the Smart Student Hub application.

## Overview

The system automatically creates user profiles and role-specific data when users sign up, then redirects them to appropriate dashboards based on their role.

## Architecture

### 1. Database Functions

**File: `supabase-bootstrap.sql`**

- `bootstrap_user_profile()`: Creates user profile and role-specific data
- `get_user_profile()`: Retrieves user profile with role-specific data
- Row Level Security (RLS) policies for data access control

### 2. API Routes

**File: `app/api/bootstrap/route.ts`**

- `POST /api/bootstrap`: Calls the bootstrap function and returns redirect URL
- `GET /api/bootstrap`: Retrieves user profile data

### 3. Role-Specific Dashboards

- `app/dashboard/student/page.tsx`: Student dashboard
- `app/dashboard/recruiter/page.tsx`: Recruiter dashboard
- `app/dashboard/faculty/page.tsx`: Faculty dashboard
- `app/dashboard/admin/page.tsx`: Institution admin dashboard

### 4. Authentication Flow

**File: `app/auth/callback/route.ts`**

1. User completes OAuth (Google)
2. Session is created
3. Bootstrap API is called
4. User is redirected to role-specific dashboard

## Database Schema

### Profiles Table

```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  role TEXT,
  email TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Role-Specific Tables

**Students:**

```sql
students (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  institution_id UUID,
  roll_number TEXT,
  batch TEXT,
  course TEXT,
  current_year INTEGER,
  current_semester INTEGER,
  skills TEXT[],
  interests TEXT[],
  languages TEXT[],
  is_profile_complete BOOLEAN
)
```

**Recruiters:**

```sql
recruiter_profiles (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  company_name TEXT,
  designation TEXT,
  company_website TEXT,
  industry TEXT,
  company_size TEXT
)
```

**Faculty:**

```sql
faculty_profiles (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  institution_id UUID,
  department_id UUID,
  designation TEXT,
  specialization TEXT,
  qualifications TEXT[],
  experience INTEGER,
  research_areas TEXT[]
)
```

**Institutions:**

```sql
institutions (
  id UUID PRIMARY KEY,
  name TEXT,
  code TEXT,
  type TEXT,
  website TEXT,
  owner_id UUID REFERENCES profiles(id)
)
```

## Bootstrap Function Logic

The `bootstrap_user_profile()` function:

1. **Extracts user data** from JWT metadata:
   - `full_name` from `user_metadata.full_name` or `user_metadata.name`
   - `role` from `user_metadata.role` (defaults to 'student')
   - `email` from auth user

2. **Creates/updates profile** in `profiles` table

3. **Inserts role-specific data**:
   - **Student**: Creates row in `students` table
   - **Recruiter**: Creates row in `recruiter_profiles` table
   - **Faculty**: Creates row in `faculty_profiles` table
   - **Institution Admin**: Creates row in `institutions` table

4. **Returns redirect URL** based on role:
   - Student → `/dashboard/student`
   - Recruiter → `/dashboard/recruiter`
   - Faculty → `/dashboard/faculty`
   - Institution Admin → `/dashboard/admin`

## Row Level Security (RLS)

All tables have RLS enabled with policies:

- Users can only access their own profile and role-specific data
- Policies use `auth.uid()` to match user ID
- Separate policies for SELECT, INSERT, UPDATE operations

## Usage

### 1. Setup Database

Run the SQL in `supabase-bootstrap.sql` in your Supabase SQL editor.

### 2. Environment Variables

Ensure these are set in your Supabase project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Sign Up Flow

1. User visits `/signup`
2. Selects role (student, recruiter, faculty, institution_admin)
3. Signs up with Google OAuth
4. User metadata includes role information
5. After OAuth callback, bootstrap function runs
6. User is redirected to appropriate dashboard

### 4. Sign In Flow

1. User visits `/login`
2. Signs in with Google OAuth
3. Bootstrap function runs (idempotent)
4. User is redirected to appropriate dashboard

## API Endpoints

### POST /api/bootstrap

Bootstrap user profile and return redirect URL.

**Response:**

```json
{
  "success": true,
  "redirect_url": "/dashboard/student",
  "profile_id": "uuid",
  "role": "student"
}
```

### GET /api/bootstrap

Get user profile with role-specific data.

**Response:**

```json
{
  "profile": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "role_data": {
    "student_id": "uuid",
    "institution_id": "uuid",
    "roll_number": "CS2022001",
    "batch": "2021-2025",
    "course": "B.Tech",
    "current_year": 3,
    "current_semester": 5,
    "skills": ["JavaScript", "React"],
    "interests": ["Web Development"],
    "languages": ["English", "Hindi"],
    "is_profile_complete": false
  }
}
```

## Error Handling

- Authentication errors redirect to `/auth/auth-code-error`
- Bootstrap errors fall back to `/dashboard`
- API errors return appropriate HTTP status codes
- Client-side error handling with toast notifications

## Security Features

- **RLS Policies**: Users can only access their own data
- **JWT Validation**: User data extracted from verified JWT
- **Idempotent Operations**: Safe to call bootstrap multiple times
- **Input Validation**: Server-side validation of user data

## Testing

1. **Test Sign Up**: Create new users with different roles
2. **Test Sign In**: Existing users should be redirected correctly
3. **Test RLS**: Verify users can only access their own data
4. **Test Idempotency**: Call bootstrap multiple times safely

## Troubleshooting

### Common Issues

1. **Bootstrap fails**: Check Supabase logs for SQL errors
2. **Wrong redirect**: Verify role is set in user metadata
3. **RLS errors**: Ensure policies are correctly configured
4. **Missing data**: Check if user metadata is properly set during OAuth

### Debug Steps

1. Check Supabase logs for SQL errors
2. Verify user metadata in Supabase Auth dashboard
3. Test RLS policies with direct SQL queries
4. Check API response in browser network tab

## Future Enhancements

1. **Profile Completion**: Add profile completion tracking
2. **Role Switching**: Allow users to switch roles (with approval)
3. **Bulk Operations**: Support for bulk user creation
4. **Analytics**: Track onboarding completion rates
5. **Custom Fields**: Support for custom role-specific fields
