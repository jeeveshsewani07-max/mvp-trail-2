import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    host: request.headers.get('host'),
    tests: [] as any[],
  };

  try {
    // Test 1: Environment Variables
    diagnostics.tests.push({
      test: 'Environment Variables',
      supabase_url: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
          process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 50) + '...' : 'MISSING',
        length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      },
      anon_key: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      },
      service_key: {
        exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      }
    });

    // Test 2: Create Supabase Client
    let supabase;
    try {
      supabase = createClient();
      diagnostics.tests.push({
        test: 'Supabase Client Creation',
        success: true,
        client_exists: !!supabase,
      });
    } catch (clientError: any) {
      diagnostics.tests.push({
        test: 'Supabase Client Creation',
        success: false,
        error: clientError.message,
      });
      return NextResponse.json(diagnostics, { status: 500 });
    }

    // Test 3: Basic Connection Test
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      diagnostics.tests.push({
        test: 'Auth Connection',
        success: !authError,
        error: authError?.message || null,
        has_user: !!authData?.user,
      });
    } catch (authErr: any) {
      diagnostics.tests.push({
        test: 'Auth Connection',
        success: false,
        error: authErr.message,
      });
    }

    // Test 4: Database Table Access
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1);
      
      diagnostics.tests.push({
        test: 'Users Table Access',
        success: !usersError,
        error: usersError?.message || null,
        result: users,
      });
    } catch (usersErr: any) {
      diagnostics.tests.push({
        test: 'Users Table Access', 
        success: false,
        error: usersErr.message,
      });
    }

    // Test 5: Student Profiles Table (The failing one!)
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);
      
      diagnostics.tests.push({
        test: 'Student Profiles Table Access',
        success: !profilesError,
        error: profilesError?.message || null,
        result: profiles,
        note: 'This is the table causing the original error!'
      });
    } catch (profilesErr: any) {
      diagnostics.tests.push({
        test: 'Student Profiles Table Access',
        success: false,
        error: profilesErr.message,
        note: 'This is the table causing the original error!'
      });
    }

    // Test 6: Check if mock user exists
    try {
      const { data: mockUser, error: mockError } = await supabase
        .from('profiles')
        .select('id, user_id')
        .eq('user_id', 'mock-user-id')
        .limit(1);
      
      diagnostics.tests.push({
        test: 'Mock User Check',
        success: !mockError,
        error: mockError?.message || null,
        mock_user_exists: !!mockUser && mockUser.length > 0,
        note: 'Your API routes look for user_id = "mock-user-id"'
      });
    } catch (mockErr: any) {
      diagnostics.tests.push({
        test: 'Mock User Check',
        success: false,
        error: mockErr.message,
        note: 'Your API routes look for user_id = "mock-user-id"'
      });
    }

    // Test 7: List actual users in database
    try {
      const { data: actualUsers, error: listError } = await supabase
        .from('users')
        .select('id, email, role')
        .limit(5);
      
      diagnostics.tests.push({
        test: 'List Actual Users',
        success: !listError,
        error: listError?.message || null,
        user_count: actualUsers?.length || 0,
        sample_users: actualUsers?.map(u => ({ id: u.id, email: u.email, role: u.role })) || [],
        note: 'These are the real users in your database'
      });
    } catch (listErr: any) {
      diagnostics.tests.push({
        test: 'List Actual Users',
        success: false,
        error: listErr.message,
      });
    }

    return NextResponse.json(diagnostics, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      ...diagnostics,
      fatal_error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
