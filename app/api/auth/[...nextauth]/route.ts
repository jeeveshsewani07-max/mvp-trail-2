import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';
import type { User as DbUser } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    'Supabase admin credentials are missing. Google sign-in will fail.'
  );
}

const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

async function upsertAppUser(googleUser: any) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured');
  }

  const email = googleUser.email?.toLowerCase();
  if (!email) {
    throw new Error('Google account did not return an email address');
  }

  const { data: existingUser, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle<DbUser>();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError;
  }

  if (!existingUser) {
    const fullName = googleUser.name || email.split('@')[0];
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        full_name: fullName,
        role: 'student',
        is_email_verified: true,
      })
      .select()
      .single<DbUser>();

    if (error || !data) {
      throw error || new Error('Failed to create application user');
    }

    return { appUser: data, isNewUser: true };
  }

  return { appUser: existingUser, isNewUser: false };
}

async function needsOnboarding(appUser: DbUser) {
  if (!supabaseAdmin) return true;

  switch (appUser.role) {
    case 'student': {
      const { data } = await supabaseAdmin
        .from('profiles')
        .select('is_profile_complete')
        .eq('user_id', appUser.id)
        .maybeSingle<{ is_profile_complete: boolean }>();
      return !data?.is_profile_complete;
    }
    case 'faculty': {
      const { data } = await supabaseAdmin
        .from('faculty_profiles')
        .select('id')
        .eq('user_id', appUser.id)
        .maybeSingle<{ id: string }>();
      return !data;
    }
    case 'recruiter': {
      const { data } = await supabaseAdmin
        .from('recruiter_profiles')
        .select('id')
        .eq('profile_id', appUser.id)
        .maybeSingle<{ id: string }>();
      return !data;
    }
    case 'institution_admin':
    default:
      return false;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const { appUser } = await upsertAppUser(user);
        const requiresOnboarding = await needsOnboarding(appUser);

        (user as any).appUser = appUser;
        (user as any).role = appUser.role;
        (user as any).needsOnboarding = requiresOnboarding;

        if (requiresOnboarding) {
          return `/onboarding?role=${appUser.role}`;
        }

        return '/dashboard';
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).appUser?.id ?? token.id;
        token.role = (user as any).role ?? token.role;
        token.needsOnboarding = (user as any).needsOnboarding ?? false;
        token.appUser = (user as any).appUser ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).needsOnboarding = token.needsOnboarding;
      }
      (session as any).appUser = token.appUser || null;
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
