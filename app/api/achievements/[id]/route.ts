import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PATCH: Update achievement status (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    // Get the authenticated user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to update achievements' },
        { status: 401 }
      );
    }

    const achievementId = params.id;
    const body = await request.json();
    const { status, credits, rejectionReason } = body;

    // Validate input
    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    // If approving, credits are required
    if (status === 'approved' && (typeof credits !== 'number' || credits < 0)) {
      return NextResponse.json(
        { error: 'Valid credits are required for approval' },
        { status: 400 }
      );
    }

    // If rejecting, reason is required
    if (status === 'rejected' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // First, get the faculty profile to verify approval permissions
    const { data: facultyProfile, error: facultyError } = await supabase
      .from('faculty_profiles')
      .select('id, approval_power')
      .eq('user_id', user.id)
      .single();

    if (facultyError || !facultyProfile) {
      return NextResponse.json(
        { error: 'Faculty profile not found' },
        { status: 404 }
      );
    }

    // Check if faculty has approval power
    const approvalPower = facultyProfile.approval_power as any;
    if (!approvalPower?.can_approve_achievements) {
      return NextResponse.json(
        { error: 'You do not have permission to approve achievements' },
        { status: 403 }
      );
    }

    // Check credit limit if approving
    if (
      status === 'approved' &&
      approvalPower.max_credit_value &&
      credits > approvalPower.max_credit_value
    ) {
      return NextResponse.json(
        {
          error: `You can only approve up to ${approvalPower.max_credit_value} credits`,
        },
        { status: 403 }
      );
    }

    // Update the achievement
    const updateData: Record<string, any> = {
      status,
      approved_by: status === 'approved' ? user.id : null,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
    };

    if (status === 'approved') {
      updateData.credits = credits;
    }

    if (status === 'rejected') {
      updateData.rejection_reason = rejectionReason;
    }

    const { data: achievement, error: updateError } = await supabase
      .from('achievements')
      .update(updateData)
      .eq('id', achievementId)
      .select()
      .single();

    if (updateError) {
      console.error('Achievement update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update achievement' },
        { status: 500 }
      );
    }

    // If approved, update student profile with new credits
    if (status === 'approved') {
      const { data: studentProfile, error: studentError } = await supabase
        .from('profiles')
        .select('id, total_credits, achievements')
        .eq('id', achievement.student_id)
        .single();

      if (!studentError && studentProfile) {
        await supabase
          .from('profiles')
          .update({
            total_credits: (studentProfile.total_credits || 0) + credits,
            achievements: (studentProfile.achievements || 0) + 1,
          })
          .eq('id', studentProfile.id);
      }
    }

    return NextResponse.json({
      success: true,
      achievement,
      message: `Achievement ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error: any) {
    console.error('Achievement API error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Get a single achievement by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    // Get the authenticated user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to view achievements' },
        { status: 401 }
      );
    }

    const achievementId = params.id;

    const { data: achievement, error } = await supabase
      .from('achievements')
      .select(`
        *,
        profiles!achievements_student_id_fkey (
          id,
          users!profiles_user_id_fkey (
            id,
            full_name,
            email
          )
        ),
        achievement_categories!achievements_category_id_fkey (
          id,
          name
        )
      `)
      .eq('id', achievementId)
      .single();

    if (error) {
      console.error('Achievement fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch achievement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      achievement,
    });
  } catch (error: any) {
    console.error('Achievement GET API error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
