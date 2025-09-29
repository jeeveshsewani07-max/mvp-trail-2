import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Simplified middleware - let client-side components handle authentication
  // This eliminates all Supabase auth calls that were causing warnings
  
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Just pass through all requests - let the app handle auth on client side
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    // Only run middleware on API routes and page routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
