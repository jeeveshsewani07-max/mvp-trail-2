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

    // Get mentees assigned to the faculty
    const { data: mentees, error: menteesError } = await supabase
      .from('mentees')
      .select(
        `
        *,
        student:profiles(
          id,
          full_name,
          email,
          role_data:students(
            roll_number,
            batch,
            course,
            current_year,
            current_semester
          )
        ),
        achievements:achievements(
          id,
          title,
          description,
          status,
          created_at
        )
      `
      )
      .eq('mentor_id', session.user.id)
      .order('created_at', { ascending: false });

    if (menteesError) {
      return NextResponse.json(
        { error: 'Failed to fetch mentees' },
        { status: 500 }
      );
    }

    return NextResponse.json(mentees);
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
    const { student_id, notes } = body;

    // Add new mentee
    const { data: mentee, error: menteeError } = await supabase
      .from('mentees')
      .insert({
        mentor_id: session.user.id,
        student_id,
        notes,
        status: 'active',
      })
      .select()
      .single();

    if (menteeError) {
      return NextResponse.json(
        { error: 'Failed to add mentee' },
        { status: 500 }
      );
    }

    return NextResponse.json(mentee);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
