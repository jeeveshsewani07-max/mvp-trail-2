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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  console.log('Auth callback - URL:', request.url);
  console.log(
    'Auth callback - Search params:',
    Object.fromEntries(searchParams.entries())
  );

  if (code) {
    const supabase = createClient();

    try {
      // Exchange the auth code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        console.log('User authenticated successfully:', data.user.email);
        console.log('User metadata:', data.user.user_metadata);
        console.log('User app metadata:', data.user.app_metadata);

        // Get user role from metadata
        const userRole = data.user.user_metadata?.role || 'student';
        console.log('User role from metadata:', userRole);

        // Determine redirect URL based on role
        const redirectUrl = getRoleRedirectUrl(userRole);
        console.log('Redirecting to:', redirectUrl);

        // If no role found, redirect to main dashboard for role selection
        if (!data.user.user_metadata?.role) {
          console.log(
            'No role found in metadata, redirecting to main dashboard'
          );
          return NextResponse.redirect(`${origin}/dashboard`);
        }

        return NextResponse.redirect(`${origin}${redirectUrl}`);
      } else {
        console.error('Auth error:', error);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=${encodeURIComponent(error?.message || 'Unknown error')}`
        );
      }
    } catch (err) {
      console.error('Callback error:', err);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=callback_error`
      );
    }
  }

  // No code provided - try to get current session for direct redirects
  const supabase = createClient();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (session?.user) {
      console.log('Direct redirect - User session found:', session.user.email);
      console.log('User metadata:', session.user.user_metadata);

      // Get user role from metadata
      const userRole = session.user.user_metadata?.role || 'student';
      console.log('User role from metadata:', userRole);

      // Determine redirect URL based on role
      const redirectUrl = getRoleRedirectUrl(userRole);
      console.log('Redirecting to:', redirectUrl);

      // If no role found, redirect to main dashboard for role selection
      if (!session.user.user_metadata?.role) {
        console.log('No role found in metadata, redirecting to main dashboard');
        return NextResponse.redirect(`${origin}/dashboard`);
      }

      return NextResponse.redirect(`${origin}${redirectUrl}`);
    } else {
      console.log('No session found, redirecting to login');
      return NextResponse.redirect(`${origin}/login`);
    }
  } catch (err) {
    console.error('Session check error:', err);
    return NextResponse.redirect(`${origin}/login`);
  }
}
