import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Diagnostic information about the Vercel deployment
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      host: request.headers.get('host'),
      vercel: {
        url: process.env.VERCEL_URL || 'Not detected',
        env: process.env.VERCEL_ENV || 'Not detected',
        region: process.env.VERCEL_REGION || 'Not detected',
      },
      environment_variables: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? {
          exists: true,
          value: process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...',
          length: process.env.NEXT_PUBLIC_SUPABASE_URL.length,
        } : { exists: false },
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? {
          exists: true,
          length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length,
        } : { exists: false },
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? {
          exists: true,
          length: process.env.SUPABASE_SERVICE_ROLE_KEY.length,
        } : { exists: false },
        DATABASE_URL: process.env.DATABASE_URL ? {
          exists: true,
          value: process.env.DATABASE_URL.substring(0, 30) + '...',
          length: process.env.DATABASE_URL.length,
        } : { exists: false },
      },
      connection_tests: {
        supabase_client_creation: null as any,
        database_connection: null as any,
        table_query: null as any,
      }
    };

    // Test 1: Can we create a Supabase client?
    try {
      const supabase = createClient();
      diagnostics.connection_tests.supabase_client_creation = {
        success: true,
        client_exists: !!supabase,
      };

      // Test 2: Can we connect to the database?
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        diagnostics.connection_tests.database_connection = {
          success: !authError,
          error: authError?.message || null,
          connected: true,
        };

        // Test 3: Can we query a table? (This is where the error likely occurs)
        try {
          const { data: tableData, error: tableError } = await supabase
            .from('profiles')
            .select('count(*)')
            .limit(1);
          
          diagnostics.connection_tests.table_query = {
            success: !tableError,
            error: tableError?.message || null,
            table: 'profiles',
            result: tableData || null,
          };
        } catch (tableErr: any) {
          diagnostics.connection_tests.table_query = {
            success: false,
            error: tableErr.message,
            table: 'profiles',
            stack: tableErr.stack,
          };
        }
      } catch (dbErr: any) {
        diagnostics.connection_tests.database_connection = {
          success: false,
          error: dbErr.message,
          connected: false,
        };
      }
    } catch (clientErr: any) {
      diagnostics.connection_tests.supabase_client_creation = {
        success: false,
        error: clientErr.message,
      };
    }

    return NextResponse.json(diagnostics, { 
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
