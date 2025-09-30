import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    host: request.headers.get('host'),
    vercel_env: process.env.VERCEL_ENV || 'not-vercel',
    vercel_url: process.env.VERCEL_URL || 'not-set',
    
    environment_check: {
      supabase_url: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
          process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 50) + '...' : 'MISSING',
        full_length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        is_correct_format: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') || false
      },
      anon_key: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        starts_with_ey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('ey') || false
      },
      service_key: {
        exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        starts_with_ey: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('ey') || false
      }
    },
    
    connection_tests: [] as any[],
    database_tests: [] as any[],
    error_details: null as any
  };

  try {
    // Test 1: Can we create a Supabase client?
    let supabase;
    try {
      supabase = createClient();
      report.connection_tests.push({
        test: 'Supabase Client Creation',
        success: true,
        details: 'Client created successfully'
      });
    } catch (clientError: any) {
      report.connection_tests.push({
        test: 'Supabase Client Creation',
        success: false,
        error: clientError.message,
        stack: clientError.stack
      });
      report.error_details = { phase: 'client_creation', error: clientError.message };
      return NextResponse.json(report, { status: 500 });
    }

    // Test 2: Basic authentication test
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      report.connection_tests.push({
        test: 'Auth Connection',
        success: !authError,
        error: authError?.message || null,
        has_session: !!authData?.user,
        details: authError ? 'Auth connection failed' : 'Auth connection successful'
      });
    } catch (authErr: any) {
      report.connection_tests.push({
        test: 'Auth Connection',
        success: false,
        error: authErr.message,
        stack: authErr.stack
      });
    }

    // Test 3: Database connection test - simple query
    try {
      const { data: simpleTest, error: simpleError } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1);
      
      report.database_tests.push({
        test: 'Users Table Query',
        success: !simpleError,
        error: simpleError?.message || null,
        result_count: simpleTest?.length || 0,
        details: simpleError ? 'Failed to query users table' : 'Users table accessible'
      });
    } catch (userErr: any) {
      report.database_tests.push({
        test: 'Users Table Query',
        success: false,
        error: userErr.message,
        details: 'Exception during users table query'
      });
    }

    // Test 4: Student profiles table test (the problematic one!)
    try {
      const { data: profileTest, error: profileError } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);
      
      report.database_tests.push({
        test: 'Student Profiles Table Query',
        success: !profileError,
        error: profileError?.message || null,
        result_count: profileTest?.length || 0,
        details: profileError ? 'Failed to query profiles table - THIS IS THE MAIN ISSUE!' : 'Profiles table accessible',
        critical: true
      });
    } catch (profileErr: any) {
      report.database_tests.push({
        test: 'Student Profiles Table Query', 
        success: false,
        error: profileErr.message,
        details: 'Exception during profiles table query - THIS IS THE MAIN ISSUE!',
        critical: true
      });
    }

    // Test 5: Check if we can list tables (permissions test)
    try {
      const { data: tableList, error: listError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10);
      
      report.database_tests.push({
        test: 'Database Schema Access',
        success: !listError,
        error: listError?.message || null,
        tables_found: tableList?.map(t => t.table_name) || [],
        details: listError ? 'Cannot access database schema' : 'Database schema accessible'
      });
    } catch (schemaErr: any) {
      report.database_tests.push({
        test: 'Database Schema Access',
        success: false,
        error: schemaErr.message,
        details: 'Exception during schema query'
      });
    }

    // Summary
    const allTestsPassed = [
      ...report.connection_tests,
      ...report.database_tests
    ].every(test => test.success);

    return NextResponse.json({
      ...report,
      overall_status: allTestsPassed ? 'SUCCESS' : 'FAILED',
      summary: {
        connection_tests_passed: report.connection_tests.filter(t => t.success).length,
        connection_tests_total: report.connection_tests.length,
        database_tests_passed: report.database_tests.filter(t => t.success).length,
        database_tests_total: report.database_tests.length,
        critical_issues: report.database_tests.filter(t => t.critical && !t.success).length
      },
      recommendations: [
        !report.environment_check.supabase_url.exists ? '1. Set NEXT_PUBLIC_SUPABASE_URL in Vercel environment variables' : null,
        !report.environment_check.anon_key.exists ? '2. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel environment variables' : null,
        report.database_tests.some(t => t.test.includes('Student Profiles') && !t.success) ? '3. Check profiles table exists and has proper RLS policies' : null,
        !allTestsPassed ? '4. Check Supabase project status and CORS settings' : null
      ].filter(Boolean)
    }, { 
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (fatalError: any) {
    return NextResponse.json({
      ...report,
      overall_status: 'FATAL_ERROR',
      fatal_error: fatalError.message,
      stack: fatalError.stack,
      recommendations: [
        '1. Check all environment variables are set in Vercel Dashboard',
        '2. Ensure Supabase project is active and not paused',
        '3. Verify network connectivity from Vercel to Supabase'
      ]
    }, { status: 500 });
  }
}
