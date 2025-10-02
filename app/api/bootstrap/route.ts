import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

function getRoleRedirectUrl(role: string): string {
  switch (role) {
    case 'student':
      return '/dashboard/student';
    case 'recruiter':
      return '/dashboard/recruiter';
    case 'faculty':
      return '/dashboard/faculty';
    case 'institution_admin':
      return '/dashboard/admin';
    default:
      return '/dashboard';
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get user metadata to determine role
    const userRole = user.user_metadata?.role || 'student';
    const userFullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User';

    console.log('Bootstrap API - User role:', userRole);
    console.log('Bootstrap API - User full name:', userFullName);

    // Create or update profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name: userFullName,
          email: user.email,
          role: userRole,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { error: 'Failed to create/update profile' },
        { status: 500 }
      );
    }

    // Create role-specific data
    let roleData = null;
    try {
      switch (userRole) {
        case 'student':
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .upsert(
              {
                profile_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'profile_id',
              }
            )
            .select()
            .single();

          if (studentError)
            console.error('Student creation error:', studentError);
          roleData = studentData;
          break;

        case 'recruiter':
          const { data: recruiterData, error: recruiterError } = await supabase
            .from('recruiter_profiles')
            .upsert(
              {
                profile_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'profile_id',
              }
            )
            .select()
            .single();

          if (recruiterError)
            console.error('Recruiter creation error:', recruiterError);
          roleData = recruiterData;
          break;

        case 'faculty':
          const { data: facultyData, error: facultyError } = await supabase
            .from('faculty_profiles')
            .upsert(
              {
                profile_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'profile_id',
              }
            )
            .select()
            .single();

          if (facultyError)
            console.error('Faculty creation error:', facultyError);
          roleData = facultyData;
          break;

        case 'institution_admin':
          const { data: institutionData, error: institutionError } =
            await supabase
              .from('institutions')
              .upsert(
                {
                  name: `${userFullName}'s Institution`,
                  code: `INST_${user.id.substring(0, 8)}`,
                  type: 'University',
                  owner_id: user.id,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                {
                  onConflict: 'owner_id',
                }
              )
              .select()
              .single();

          if (institutionError)
            console.error('Institution creation error:', institutionError);
          roleData = institutionData;
          break;
      }
    } catch (roleError) {
      console.error('Role-specific data creation error:', roleError);
      // Continue even if role-specific data creation fails
    }

    // Determine redirect URL
    const redirectUrl = getRoleRedirectUrl(userRole);

    console.log('Bootstrap API - Redirect URL:', redirectUrl);

    // Return the redirect URL
    return NextResponse.json({
      success: true,
      redirect_url: redirectUrl,
      profile_id: user.id,
      role: userRole,
    });
  } catch (error) {
    console.error('Bootstrap API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Get profile error:', profileError);
      return NextResponse.json(
        { error: 'Failed to get user profile' },
        { status: 500 }
      );
    }

    // Get role-specific data based on role
    let roleData = null;
    if (profileData.role) {
      try {
        switch (profileData.role) {
          case 'student':
            const { data: studentData } = await supabase
              .from('students')
              .select('*')
              .eq('profile_id', user.id)
              .single();
            roleData = studentData;
            break;
          case 'recruiter':
            const { data: recruiterData } = await supabase
              .from('recruiter_profiles')
              .select('*')
              .eq('profile_id', user.id)
              .single();
            roleData = recruiterData;
            break;
          case 'faculty':
            const { data: facultyData } = await supabase
              .from('faculty_profiles')
              .select('*')
              .eq('profile_id', user.id)
              .single();
            roleData = facultyData;
            break;
          case 'institution_admin':
            const { data: institutionData } = await supabase
              .from('institutions')
              .select('*')
              .eq('owner_id', user.id)
              .single();
            roleData = institutionData;
            break;
        }
      } catch (roleError) {
        console.error('Role-specific data fetch error:', roleError);
      }
    }

    return NextResponse.json({
      profile: profileData,
      role_data: roleData,
    });
  } catch (error) {
    console.error('Get profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
