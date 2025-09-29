import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description?: string;
  date_achieved: string;
  skill_tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  credits: number;
  created_at: string;
  updated_at: string;
  student_profiles: {
    id: string;
    users: {
      id: string;
      full_name: string;
      email: string;
    };
  };
  achievement_categories: {
    id: string;
    name: string;
  };
}

interface UseAchievementsResult {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAchievements(status?: string, studentId?: string): UseAchievementsResult {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (studentId) params.append('student_id', studentId);

      const response = await fetch(`/api/achievements?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }

      const data = await response.json();
      
      if (data.success) {
        setAchievements(data.achievements || []);
      } else {
        throw new Error(data.error || 'Failed to load achievements');
      }
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
      setError(err.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [status, studentId]);

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements,
  };
}
