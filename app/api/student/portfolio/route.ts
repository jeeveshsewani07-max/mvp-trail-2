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

    // Get student portfolio data
    const [
      { data: profile, error: profileError },
      { data: achievements, error: achievementsError },
      { data: skills, error: skillsError },
    ] = await Promise.all([
      // Get profile
      supabase
        .from('students')
        .select('*')
        .eq('student_id', session.user.id)
        .single(),

      // Get verified achievements
      supabase
        .from('achievements')
        .select('*')
        .eq('student_id', session.user.id)
        .eq('status', 'approved')
        .order('date_achieved', { ascending: false }),

      // Get skills with endorsements
      supabase
        .from('student_skills')
        .select('*')
        .eq('student_id', session.user.id)
        .order('endorsements_count', { ascending: false }),
    ]);

    if (profileError || achievementsError || skillsError) {
      return NextResponse.json(
        { error: 'Failed to fetch portfolio data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profile,
      achievements,
      skills,
    });
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
    const { skills, about, interests, projects } = body;

    // Update portfolio data
    const { data: portfolio, error: portfolioError } = await supabase
      .from('student_portfolios')
      .upsert({
        student_id: session.user.id,
        skills,
        about,
        interests,
        projects,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (portfolioError) {
      return NextResponse.json(
        { error: 'Failed to update portfolio' },
        { status: 500 }
      );
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
