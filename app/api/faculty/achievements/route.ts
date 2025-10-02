import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify faculty role
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty_profiles')
      .select('*')
      .eq('faculty_id', session.user.id)
      .single();

    if (facultyError || !faculty) {
      return NextResponse.json(
        { error: 'Only faculty members can review achievements' },
        { status: 403 }
      );
    }

    // Get pending achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select(
        `
        *,
        student:profiles(
          full_name,
          email
        ),
        category:achievement_categories(
          name,
          description
        )
      `
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      );
    }

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify faculty role
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty_profiles')
      .select('*')
      .eq('faculty_id', session.user.id)
      .single();

    if (facultyError || !faculty) {
      return NextResponse.json(
        { error: 'Only faculty members can review achievements' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { achievementId, status, feedback } = body;

    if (!achievementId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update achievement
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .update({
        status,
        feedback,
        approved_by: session.user.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', achievementId)
      .eq('status', 'pending') // Only update if still pending
      .select()
      .single();

    if (achievementError) {
      console.error('Error updating achievement:', achievementError);
      return NextResponse.json(
        { error: 'Failed to update achievement' },
        { status: 500 }
      );
    }

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
