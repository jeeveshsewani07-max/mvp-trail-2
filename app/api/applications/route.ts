import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);

  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('job_applications')
      .select(
        `
        *,
        job:jobs(
          title,
          type,
          location,
          company:companies(
            name,
            logo_url,
            industry
          )
        )
      `
      )
      .eq('student_id', session.user.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data: applications, error: applicationsError } = await query;

    if (applicationsError) {
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', session.user.id);

    return NextResponse.json({
      applications,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
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
    const { job_id, cover_letter, resume_url } = body;

    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('job_applications')
      .select('id')
      .eq('student_id', session.user.id)
      .eq('job_id', job_id)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Already applied to this job' },
        { status: 400 }
      );
    }

    // Create application
    const { data: application, error: applicationError } = await supabase
      .from('job_applications')
      .insert({
        student_id: session.user.id,
        job_id,
        cover_letter,
        resume_url,
        status: 'pending',
      })
      .select()
      .single();

    if (applicationError) {
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
