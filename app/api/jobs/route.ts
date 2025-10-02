import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type') || 'all';
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('jobs')
      .select(
        `
        *,
        company:companies(name, logo_url, industry),
        applications:job_applications(
          id,
          status,
          created_at
        )
      `
      )
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Apply filters
    if (type !== 'all') {
      query = query.eq('type', type);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (location) {
      query = query.eq('location', location);
    }

    // Apply pagination
    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      jobs,
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

    // Only recruiters can post jobs
    const { data: recruiter } = await supabase
      .from('recruiter_profiles')
      .select('*')
      .eq('profile_id', session.user.id)
      .single();

    if (!recruiter) {
      return NextResponse.json(
        { error: 'Only recruiters can post jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      category,
      location,
      salary_min,
      salary_max,
      requirements,
      responsibilities,
      deadline,
    } = body;

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        title,
        description,
        type,
        category,
        location,
        salary_min,
        salary_max,
        requirements,
        responsibilities,
        deadline,
        company_id: recruiter.company_id,
        posted_by: session.user.id,
        status: 'active',
      })
      .select()
      .single();

    if (jobError) {
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
