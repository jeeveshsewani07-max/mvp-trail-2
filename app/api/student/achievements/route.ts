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

    // Get student achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select(
        `
        *,
        category:achievement_categories(name, description),
        approved_by:profiles(full_name, email)
      `
      )
      .eq('student_id', session.user.id)
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
    const { title, description, category_id, date_achieved, proof_url } = body;

    // Create new achievement
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .insert({
        student_id: session.user.id,
        title,
        description,
        category_id,
        date_achieved,
        proof_url,
        status: 'pending',
      })
      .select()
      .single();

    if (achievementError) {
      return NextResponse.json(
        { error: 'Failed to create achievement' },
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
