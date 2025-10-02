import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the current session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  console.log('Middleware - Path:', req.nextUrl.pathname);
  console.log('Middleware - Session:', session?.user?.email);
  console.log('Middleware - Error:', error);

  // If there's an error getting the session, let the request continue
  if (error) {
    console.log('Middleware - Session error, allowing request to continue');
    return res;
  }

  // If user is not authenticated and trying to access protected routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('Middleware - No session, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is authenticated and trying to access auth pages
  if (
    session &&
    (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')
  ) {
    console.log('Middleware - User authenticated, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Temporarily disable middleware to test auth flow
     * Match only specific paths that need protection
     */
    '/dashboard/:path*',
  ],
};
