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

    // Get events created by the faculty
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select(
        `
        *,
        organizer:profiles(full_name, email),
        participants:event_participants(
          student:profiles(full_name, email)
        )
      `
      )
      .eq('organizer_id', session.user.id)
      .order('start_date', { ascending: false });

    if (eventsError) {
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    return NextResponse.json(events);
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

    // Create new event
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
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
