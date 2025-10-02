'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  proof_url: string;
  status: string;
  created_at: string;
  student: {
    full_name: string;
    email: string;
  };
  category: {
    name: string;
    description: string;
  };
}

export default function ApproveAchievementsPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/faculty/achievements');
        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }

        const data = await response.json();
        setAchievements(data || []);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        toast.error('Failed to fetch achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const handleAction = async (
    achievementId: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      const response = await fetch('/api/faculty/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          achievementId,
          status,
          feedback: feedback[achievementId] || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update achievement');
      }

      // Update local state
      setAchievements((prev) =>
        prev.filter((achievement) => achievement.id !== achievementId)
      );
      setFeedback((prev) => {
        const newFeedback = { ...prev };
        delete newFeedback[achievementId];
        return newFeedback;
      });

      toast.success(
        `Achievement ${status === 'approved' ? 'approved' : 'rejected'} successfully`
      );
    } catch (error) {
      console.error('Error updating achievement:', error);
      toast.error('Failed to update achievement');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Review Achievements</h1>
            <p className="text-muted-foreground">
              Review and approve student achievements
            </p>
          </div>
        </div>

        {achievements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Icons.trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium">No pending achievements</p>
              <p className="text-sm text-muted-foreground">
                All achievements have been reviewed
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{achievement.title}</CardTitle>
                      <CardDescription>
                        Submitted by {achievement.student.full_name} •{' '}
                        {new Date(achievement.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge>{achievement.category.name}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>

                    {achievement.proof_url && (
                      <div>
                        <h4 className="font-medium mb-2">Proof</h4>
                        <a
                          href={achievement.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View Proof
                        </a>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-medium">Feedback</h4>
                      <Textarea
                        placeholder="Add your feedback here..."
                        value={feedback[achievement.id] || ''}
                        onChange={(e) =>
                          setFeedback((prev) => ({
                            ...prev,
                            [achievement.id]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleAction(achievement.id, 'rejected')}
                      >
                        <Icons.x className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleAction(achievement.id, 'approved')}
                      >
                        <Icons.check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
