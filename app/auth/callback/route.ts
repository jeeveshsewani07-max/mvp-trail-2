import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

        // Check if user needs onboarding (new signup)
        if (next === '/onboarding') {
          return NextResponse.redirect(`${origin}/profile`);
        }

        // Redirect to dashboard for existing users
        return NextResponse.redirect(`${origin}/dashboard`);
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
