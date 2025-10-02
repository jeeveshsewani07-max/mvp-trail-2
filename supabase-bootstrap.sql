-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bootstrap function for role-based onboarding
CREATE OR REPLACE FUNCTION bootstrap_user_profile()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
    user_email TEXT;
    user_full_name TEXT;
    user_role TEXT;
    profile_id UUID;
    result JSON;
BEGIN
    -- Get current user info
    user_id := auth.uid();
    user_email := auth.email();
    user_full_name := COALESCE(
        (auth.jwt() ->> 'user_metadata')::json ->> 'full_name',
        (auth.jwt() ->> 'user_metadata')::json ->> 'name',
        split_part(user_email, '@', 1)
    );
    user_role := COALESCE(
        (auth.jwt() ->> 'user_metadata')::json ->> 'role',
        'student'
    );

    -- Check if user exists
    IF user_id IS NULL THEN
        RETURN json_build_object('error', 'User not authenticated');
    END IF;

    -- Insert or update profile
    INSERT INTO profiles (id, full_name, role, email, created_at, updated_at)
    VALUES (user_id, user_full_name, user_role, user_email, NOW(), NOW())
    ON CONFLICT (id) 
    DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        email = EXCLUDED.email,
        updated_at = NOW()
    RETURNING id INTO profile_id;

    -- Role-specific inserts
    CASE user_role
        WHEN 'student' THEN
            INSERT INTO students (profile_id, created_at, updated_at)
            VALUES (profile_id, NOW(), NOW())
            ON CONFLICT (profile_id) DO NOTHING;
            
        WHEN 'recruiter' THEN
            INSERT INTO recruiter_profiles (profile_id, created_at, updated_at)
            VALUES (profile_id, NOW(), NOW())
            ON CONFLICT (profile_id) DO NOTHING;
            
        WHEN 'faculty' THEN
            INSERT INTO faculty_profiles (profile_id, created_at, updated_at)
            VALUES (profile_id, NOW(), NOW())
            ON CONFLICT (profile_id) DO NOTHING;
            
        WHEN 'institution_admin' THEN
            -- Create a default institution for the admin
            INSERT INTO institutions (name, code, type, owner_id, created_at, updated_at)
            VALUES (
                user_full_name || '''s Institution',
                'INST_' || substr(user_id::text, 1, 8),
                'University',
                profile_id,
                NOW(),
                NOW()
            )
            ON CONFLICT (owner_id) DO NOTHING;
    END CASE;

    -- Return success with redirect URL
    result := json_build_object(
        'success', true,
        'profile_id', profile_id,
        'role', user_role,
        'redirect_url', CASE user_role
            WHEN 'student' THEN '/dashboard/student'
            WHEN 'recruiter' THEN '/dashboard/recruiter'
            WHEN 'faculty' THEN '/dashboard/faculty'
            WHEN 'institution_admin' THEN '/dashboard/admin'
            ELSE '/dashboard'
        END
    );

    RETURN result;
END;
$$;

-- Create function to get user profile with role-specific data
CREATE OR REPLACE FUNCTION get_user_profile()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
    profile_data JSON;
    role_data JSON;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RETURN json_build_object('error', 'User not authenticated');
    END IF;

    -- Get basic profile
    SELECT json_build_object(
        'id', p.id,
        'full_name', p.full_name,
        'email', p.email,
        'role', p.role,
        'created_at', p.created_at,
        'updated_at', p.updated_at
    ) INTO profile_data
    FROM profiles p
    WHERE p.id = user_id;

    -- Get role-specific data
    SELECT CASE (SELECT role FROM profiles WHERE id = user_id)
        WHEN 'student' THEN
            (SELECT json_build_object(
                'student_id', s.id,
                'institution_id', s.institution_id,
                'roll_number', s.roll_number,
                'batch', s.batch,
                'course', s.course,
                'current_year', s.current_year,
                'current_semester', s.current_semester,
                'skills', s.skills,
                'interests', s.interests,
                'languages', s.languages,
                'is_profile_complete', s.is_profile_complete
            ) FROM students s WHERE s.profile_id = user_id)
        WHEN 'recruiter' THEN
            (SELECT json_build_object(
                'recruiter_id', r.id,
                'company_name', r.company_name,
                'designation', r.designation,
                'company_website', r.company_website,
                'industry', r.industry,
                'company_size', r.company_size
            ) FROM recruiter_profiles r WHERE r.profile_id = user_id)
        WHEN 'faculty' THEN
            (SELECT json_build_object(
                'faculty_id', f.id,
                'institution_id', f.institution_id,
                'department_id', f.department_id,
                'designation', f.designation,
                'specialization', f.specialization,
                'qualifications', f.qualifications,
                'experience', f.experience,
                'research_areas', f.research_areas
            ) FROM faculty_profiles f WHERE f.profile_id = user_id)
        WHEN 'institution_admin' THEN
            (SELECT json_build_object(
                'institution_id', i.id,
                'institution_name', i.name,
                'institution_code', i.code,
                'institution_type', i.type,
                'institution_website', i.website
            ) FROM institutions i WHERE i.owner_id = user_id)
        ELSE json_build_object()
    END INTO role_data;

    RETURN json_build_object(
        'profile', profile_data,
        'role_data', role_data
    );
END;
$$;

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Students policies
CREATE POLICY "Students can view their own data" ON students
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Students can update their own data" ON students
    FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Students can insert their own data" ON students
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Recruiter profiles policies
CREATE POLICY "Recruiters can view their own data" ON recruiter_profiles
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Recruiters can update their own data" ON recruiter_profiles
    FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Recruiters can insert their own data" ON recruiter_profiles
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Faculty profiles policies
CREATE POLICY "Faculty can view their own data" ON faculty_profiles
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Faculty can update their own data" ON faculty_profiles
    FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Faculty can insert their own data" ON faculty_profiles
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Institutions policies
CREATE POLICY "Institution admins can view their own institution" ON institutions
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Institution admins can update their own institution" ON institutions
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Institution admins can insert their own institution" ON institutions
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION bootstrap_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_profile() TO authenticated;
