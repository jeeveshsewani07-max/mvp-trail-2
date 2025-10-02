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

    // Get faculty profile
    const { data: facultyProfile, error: profileError } = await supabase
      .from('faculty_profiles')
      .select('*')
      .eq('faculty_id', session.user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(facultyProfile);
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
      designation,
      specialization,
      qualifications,
      experience,
      research_areas,
      department_id,
      institution_id,
    } = body;

    // Update or insert faculty profile
    const { data: facultyProfile, error: profileError } = await supabase
      .from('faculty_profiles')
      .upsert({
        faculty_id: session.user.id,
        designation,
        specialization,
        qualifications,
        experience,
        research_areas,
        department_id,
        institution_id,
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

    return NextResponse.json(facultyProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
