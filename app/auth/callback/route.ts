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
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();

    try {
      // Exchange the auth code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        console.log('User authenticated successfully:', data.user.email);

        // Get user role from metadata
        const userRole = data.user.user_metadata?.role || 'student';
        console.log('User role from metadata:', userRole);

        // Determine redirect URL based on role
        const redirectUrl = getRoleRedirectUrl(userRole);
        console.log('Redirecting to:', redirectUrl);

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

  // No code provided - redirect to error
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`);
}
