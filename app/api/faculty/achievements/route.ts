import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending achievements for approval
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select(
        `
        *,
        student:profiles(full_name, email),
        category:achievement_categories(name, description)
      `
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (achievementsError) {
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      );
    }

    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { achievementId, status, feedback } = body;

    // Update achievement status
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .update({
        status,
        feedback,
        approved_by: session.user.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', achievementId)
      .select()
      .single();

    if (achievementError) {
      return NextResponse.json(
        { error: 'Failed to update achievement' },
        { status: 500 }
      );
    }

    return NextResponse.json(achievement);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
