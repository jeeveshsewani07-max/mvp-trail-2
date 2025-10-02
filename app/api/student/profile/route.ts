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

    // Get student profile
    const { data: studentProfile, error: profileError } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', session.user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(studentProfile);
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
    const {
      roll_number,
      batch,
      course,
      current_year,
      current_semester,
      skills,
      interests,
      languages,
      institution_id,
    } = body;

    // Update or insert student profile
    const { data: studentProfile, error: profileError } = await supabase
      .from('students')
      .upsert({
        student_id: session.user.id,
        roll_number,
        batch,
        course,
        current_year,
        current_semester,
        skills,
        interests,
        languages,
        institution_id,
        is_profile_complete: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(studentProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
