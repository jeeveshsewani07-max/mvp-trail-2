import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Call the bootstrap function
    const { data, error } = await supabase.rpc('bootstrap_user_profile');

    if (error) {
      console.error('Bootstrap error:', error);
      return NextResponse.json(
        { error: 'Failed to bootstrap user profile' },
        { status: 500 }
      );
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    // Return the redirect URL
    return NextResponse.json({
      success: true,
      redirect_url: data.redirect_url,
      profile_id: data.profile_id,
      role: data.role,
    });
  } catch (error) {
    console.error('Bootstrap API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get user profile with role-specific data
    const { data, error } = await supabase.rpc('get_user_profile');

    if (error) {
      console.error('Get profile error:', error);
      return NextResponse.json(
        { error: 'Failed to get user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
