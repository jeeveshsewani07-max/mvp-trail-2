import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: categories, error } = await supabase
      .from('achievement_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Categories fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    // If no categories exist, return default ones
    if (!categories || categories.length === 0) {
      const defaultCategories = [
        {
          id: 'tech',
          name: 'Technical',
          description: 'Programming, certifications, technical skills',
          icon: 'code',
          credit_multiplier: 1.0,
          tags: ['programming', 'certification', 'technical']
        },
        {
          id: 'academic',
          name: 'Academic',
          description: 'Research papers, academic honors, scholarships',
          icon: 'graduationCap',
          credit_multiplier: 1.2,
          tags: ['research', 'academic', 'scholarship']
        },
        {
          id: 'competition',
          name: 'Competition',
          description: 'Hackathons, contests, competitive programming',
          icon: 'trophy',
          credit_multiplier: 1.5,
          tags: ['competition', 'hackathon', 'contest']
        },
        {
          id: 'leadership',
          name: 'Leadership',
          description: 'Team leadership, organizing events, mentoring',
          icon: 'users',
          credit_multiplier: 1.3,
          tags: ['leadership', 'teamwork', 'organizing']
        },
        {
          id: 'creative',
          name: 'Creative',
          description: 'Creative works, cultural activities, artistic achievements',
          icon: 'palette',
          credit_multiplier: 1.1,
          tags: ['creative', 'art', 'culture']
        }
      ];

      return NextResponse.json({
        success: true,
        categories: defaultCategories,
      });
    }

    return NextResponse.json({
      success: true,
      categories,
    });

  } catch (error: any) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
