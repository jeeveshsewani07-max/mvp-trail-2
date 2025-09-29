import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { categoryId, title, description, dateAchieved, skillTags, isPublic } = body;

    // Validation
    if (!categoryId || !title || !dateAchieved) {
      return NextResponse.json(
        { error: 'Missing required fields: categoryId, title, dateAchieved' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // First, get the student profile ID
    const { data: studentProfile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (profileError || !studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Insert the achievement
    const { data: achievement, error: insertError } = await supabase
      .from('achievements')
      .insert({
        student_id: studentProfile.id,
        category_id: categoryId,
        title,
        description: description || '',
        date_achieved: new Date(dateAchieved).toISOString(),
        skill_tags: skillTags || [],
        is_public: isPublic !== false, // Default to true
        status: 'pending',
        credits: 0, // Will be set by faculty during approval
      })
      .select()
      .single();

    if (insertError) {
      console.error('Achievement insertion error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create achievement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      achievement,
      message: 'Achievement submitted successfully! It is now pending faculty approval.',
    });

  } catch (error: any) {
    console.error('Achievement API error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const studentId = searchParams.get('student_id');

    const supabase = createClient();

    let query = supabase
      .from('achievements')
      .select(`
        id,
        title,
        description,
        date_achieved,
        skill_tags,
        status,
        credits,
        created_at,
        updated_at,
        student_profiles!achievements_student_id_fkey (
          id,
          users!student_profiles_user_id_fkey (
            id,
            full_name,
            email
          )
        ),
        achievement_categories!achievements_category_id_fkey (
          id,
          name
        )
      `);

    if (status) {
      query = query.eq('status', status);
    }

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    // If no specific student requested, get user's role to filter appropriately
    if (!studentId) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userProfile?.role === 'student') {
        // Students can only see their own achievements
        const { data: studentProfile } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (studentProfile) {
          query = query.eq('student_id', studentProfile.id);
        }
      }
      // Faculty can see all pending achievements (no additional filter needed)
    }

    const { data: achievements, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Achievement fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      achievements: achievements || [],
    });

  } catch (error: any) {
    console.error('Achievement GET API error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
