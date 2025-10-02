import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const location = searchParams.get('location');

    // First, get the session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Base query for jobs
    let query = supabase
      .from('jobs')
      .select('*, company:companies(name, logo_url, industry)')
      .eq('status', 'active');

    // Apply filters
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Get jobs
    const { data: jobs, error: jobsError } = await query;
    if (jobsError) {
      console.error('Error fetching jobs:', jobsError);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }

    // If no jobs found, return empty array
    if (!jobs) {
      return NextResponse.json({ jobs: [] });
    }

    // Get applications for these jobs for the current user
    const jobIds = jobs.map((job) => job.id);
    const { data: applications, error: applicationsError } = await supabase
      .from('job_applications')
      .select('job_id')
      .eq('student_id', session.user.id)
      .in('job_id', jobIds);

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError);
      // Continue without applications data
    }

    // Create a map of job_id to applications
    const applicationMap = new Map();
    applications?.forEach((app) => {
      applicationMap.set(app.job_id, app);
    });

    // Format jobs with applications
    const formattedJobs = jobs.map((job) => ({
      ...job,
      applications: applicationMap.has(job.id)
        ? [applicationMap.get(job.id)]
        : [],
    }));

    return NextResponse.json({ jobs: formattedJobs });
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
      console.error('Error creating job:', jobError);
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
