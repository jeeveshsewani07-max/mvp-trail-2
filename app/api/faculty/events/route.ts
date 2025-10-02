import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');

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
        { error: 'Only faculty members can manage events' },
        { status: 403 }
      );
    }

    // Get events
    let query = supabase
      .from('events')
      .select(
        `
        *,
        participants:event_participants(
          student:profiles(
            full_name,
            email
          )
        )
      `
      )
      .eq('organizer_id', session.user.id)
      .order('start_date', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: events, error: eventsError } = await query;

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    return NextResponse.json(events);
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
        { error: 'Only faculty members can create events' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      start_date,
      end_date,
      location,
      max_participants,
      credits,
      registration_deadline,
    } = body;

    // Create event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title,
        description,
        type,
        start_date,
        end_date,
        location,
        max_participants,
        credits,
        registration_deadline,
        organizer_id: session.user.id,
        status: 'upcoming',
      })
      .select()
      .single();

    if (eventError) {
      console.error('Error creating event:', eventError);
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
        { error: 'Only faculty members can update events' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { eventId, status } = body;

    if (!eventId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)
      .eq('organizer_id', session.user.id) // Only update own events
      .select()
      .single();

    if (eventError) {
      console.error('Error updating event:', eventError);
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
