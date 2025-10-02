'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { getAuthCallbackUrl, getSiteUrl } from '@/lib/utils/site-url';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [signupMethod, setSignupMethod] = useState<'magic' | 'password'>(
    'magic'
  );
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMagicLinkSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.fullName || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // First, sign up the user
      const { data: authData, error: authError } =
        await supabase.auth.signInWithOtp({
          email: formData.email,
          options: {
            data: {
              full_name: formData.fullName,
              role: formData.role,
            },
            emailRedirectTo: getAuthCallbackUrl('/bootstrap'),
          },
        });

      if (authError) {
        toast.error(authError.message);
        return;
      }

      toast.success(
        'Check your email for the magic link to complete registration!'
      );
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.fullName ||
      !formData.role
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with password
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account!');
      } else {
        toast.success('Account created successfully!');
        router.push('/bootstrap');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getSiteUrl()}/auth/callback`,
          queryParams: {
            next: '/dashboard',
            role: formData.role || 'student',
          },
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <Icons.graduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Join Smart Student Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Create your verified digital student identity
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign up</CardTitle>
            <CardDescription className="text-center">
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Signup Method Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={signupMethod === 'magic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSignupMethod('magic')}
                className="text-xs"
              >
                <Icons.mail className="mr-1 h-3 w-3" />
                Magic Link
              </Button>
              <Button
                type="button"
                variant={signupMethod === 'password' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSignupMethod('password')}
                className="text-xs"
              >
                <Icons.lock className="mr-1 h-3 w-3" />
                Password
              </Button>
            </div>

            {signupMethod === 'magic' ? (
              <form onSubmit={handleMagicLinkSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange('fullName', e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={isLoading}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <Icons.graduationCap className="h-4 w-4" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="faculty">
                        <div className="flex items-center gap-2">
                          <Icons.user className="h-4 w-4" />
                          Faculty/Mentor
                        </div>
                      </SelectItem>
                      <SelectItem value="recruiter">
                        <div className="flex items-center gap-2">
                          <Icons.briefcase className="h-4 w-4" />
                          Recruiter
                        </div>
                      </SelectItem>
                      <SelectItem value="institution_admin">
                        <div className="flex items-center gap-2">
                          <Icons.building className="h-4 w-4" />
                          Institution Admin
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.mail className="mr-2 h-4 w-4" />
                  )}
                  Send Magic Link
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange('fullName', e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Choose a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    disabled={isLoading}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <Icons.graduationCap className="h-4 w-4" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="faculty">
                        <div className="flex items-center gap-2">
                          <Icons.user className="h-4 w-4" />
                          Faculty/Mentor
                        </div>
                      </SelectItem>
                      <SelectItem value="recruiter">
                        <div className="flex items-center gap-2">
                          <Icons.briefcase className="h-4 w-4" />
                          Recruiter
                        </div>
                      </SelectItem>
                      <SelectItem value="institution_admin">
                        <div className="flex items-center gap-2">
                          <Icons.building className="h-4 w-4" />
                          Institution Admin
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.userPlus className="mr-2 h-4 w-4" />
                  )}
                  Create Account
                </Button>
              </form>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || !formData.role}
              className="w-full"
              variant="outline"
            >
              {isGoogleLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>

            {!formData.role && (
              <p className="text-xs text-muted-foreground text-center">
                Please select your role before using Google sign-up
              </p>
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </span>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
