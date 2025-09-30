import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface UseDashboardUpdatesProps {
  userId?: string;
  role?: string;
  refreshInterval?: number;
}

interface DashboardStats {
  pendingApprovals: number;
  mentees: number;
  eventsCreated: number;
  achievementsApproved: number;
  thisWeekApprovals: number;
  avgApprovalTime: number;
  recentActivity: any[];
}

export function useDashboardUpdates({
  userId,
  role = 'faculty',
  refreshInterval = 5000, // 5 seconds
}: UseDashboardUpdatesProps) {
  const [stats, setStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    mentees: 0,
    eventsCreated: 0,
    achievementsApproved: 0,
    thisWeekApprovals: 0,
    avgApprovalTime: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch dashboard stats
  const fetchDashboardStats = async () => {
    if (!userId) {
      // For development, use mock data when no userId is provided
      setStats({
        pendingApprovals: 5,
        mentees: 12,
        eventsCreated: 3,
        achievementsApproved: 45,
        thisWeekApprovals: 8,
        avgApprovalTime: 2.1,
        recentActivity: [],
      });
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // For faculty role
      if (role === 'faculty') {
        // Get pending approvals count
        const { count: pendingCount, error: pendingError } = await supabase
          .from('achievements')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Get mentees count
        const { count: menteesCount, error: menteesError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('mentor_id', userId);

        // Get events created count
        const { count: eventsCount, error: eventsError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', userId);

        // Get achievements approved count
        const { count: approvedCount, error: approvedError } = await supabase
          .from('achievements')
          .select('*', { count: 'exact', head: true })
          .eq('approved_by', userId);

        // Get this week's approvals
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: weekApprovals, error: weekError } = await supabase
          .from('achievements')
          .select('*', { count: 'exact', head: true })
          .eq('approved_by', userId)
          .gte('approved_at', oneWeekAgo.toISOString());

        // Get recent activity
        const { data: recentActivity, error: activityError } = await supabase
          .from('activity_log')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        // Update stats
        setStats({
          pendingApprovals: pendingCount || 0,
          mentees: menteesCount || 0,
          eventsCreated: eventsCount || 0,
          achievementsApproved: approvedCount || 0,
          thisWeekApprovals: weekApprovals || 0,
          avgApprovalTime: 2.3, // Mock data for now
          recentActivity: recentActivity || [],
        });

        if (pendingError || menteesError || eventsError || approvedError || weekError || activityError) {
          console.error('Error fetching faculty stats:', { 
            pendingError, menteesError, eventsError, approvedError, weekError, activityError 
          });
        }
      }

      // For other roles, implement similar logic
      // ...

    } catch (err: any) {
      console.error('Error in dashboard updates:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchDashboardStats();

    // Set up interval for regular updates
    const intervalId = setInterval(() => {
      fetchDashboardStats();
    }, refreshInterval);

    // Set up Supabase real-time subscriptions
    const achievementsSubscription = supabase
      .channel('achievements-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'achievements',
          filter: role === 'faculty' ? `status=eq.pending` : undefined
        }, 
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    // Clean up
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(achievementsSubscription);
    };
  }, [userId, role, refreshInterval]);

  return {
    stats,
    loading,
    error,
    refresh: fetchDashboardStats,
  };
}
