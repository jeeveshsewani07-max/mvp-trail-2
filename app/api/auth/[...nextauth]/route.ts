import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Store Google user info in session for later use in onboarding
      (user as any).googleProfile = profile;
      (user as any).role = 'student'; // Default role, will be updated in onboarding
      (user as any).needsOnboarding = true; // Always redirect to onboarding for Google users

      return true; // Always allow sign-in, handle logic in onboarding
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = token.sub; // Use NextAuth's built-in sub as user ID
        token.role = (user as any).role ?? 'student';
        token.needsOnboarding = (user as any).needsOnboarding ?? true;
        token.googleProfile = (user as any).googleProfile ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).needsOnboarding = token.needsOnboarding;
      }
      (session as any).googleProfile = token.googleProfile || null;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
