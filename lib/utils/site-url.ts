/**
 * Get the correct site URL for the current environment
 * This handles both development and production environments
 */
export function getSiteUrl(): string {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side: use environment variables
  const siteUrl = 
    process.env.NEXT_PUBLIC_SITE_URL ||     // Custom site URL
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : // Vercel deployment URL
    process.env.NEXTAUTH_URL ||             // NextAuth URL
    'http://localhost:3000';                // Fallback for development

  return siteUrl;
}

/**
 * Get the auth callback URL for the current environment
 */
export function getAuthCallbackUrl(next?: string): string {
  const baseUrl = getSiteUrl();
  const nextParam = next ? `?next=${encodeURIComponent(next)}` : '';
  return `${baseUrl}/auth/callback${nextParam}`;
}
