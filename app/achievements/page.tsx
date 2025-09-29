'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AchievementsList } from '@/components/achievements/achievements-list';
import { AchievementFilters } from '@/components/achievements/achievement-filters';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function AchievementsPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: '',
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Achievements</h1>
            <p className="text-muted-foreground">
              Track and manage your verified achievements
            </p>
          </div>
          <Button asChild>
            <Link href="/achievements/add">
              <Icons.plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <AchievementFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Achievements List */}
        <AchievementsList filters={filters} />
      </div>
    </DashboardLayout>
  );
}

