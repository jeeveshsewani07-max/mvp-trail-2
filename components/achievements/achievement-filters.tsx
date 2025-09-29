'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface AchievementFiltersProps {
  filters: {
    status: string;
    category: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

const categories = [
  { id: 'all', name: 'All Categories', icon: '📋' },
  { id: '1', name: 'Technical', icon: '💻' },
  { id: '2', name: 'Competition', icon: '🏆' },
  { id: '3', name: 'Research', icon: '📚' },
  { id: '4', name: 'Professional', icon: '💼' },
  { id: '5', name: 'Leadership', icon: '👥' },
  { id: '6', name: 'Community Service', icon: '🤝' },
  { id: '7', name: 'Sports', icon: '⚽' },
  { id: '8', name: 'Arts & Culture', icon: '🎨' },
];

const statuses = [
  { value: 'all', label: 'All Status', icon: Icons.list },
  { value: 'approved', label: 'Approved', icon: Icons.checkCircle },
  { value: 'pending', label: 'Pending', icon: Icons.clock },
  { value: 'rejected', label: 'Rejected', icon: Icons.x },
];

export function AchievementFilters({ filters, onFiltersChange }: AchievementFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      category: 'all',
      search: '',
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.category !== 'all' || filters.search !== '';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">Search achievements</Label>
            <div className="relative">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search achievements..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="min-w-[160px]">
            <Label htmlFor="status" className="sr-only">Filter by status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => {
                  const IconComponent = status.icon;
                  return (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {status.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="min-w-[180px]">
            <Label htmlFor="category" className="sr-only">Filter by category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="default"
              onClick={clearFilters}
              className="shrink-0"
            >
              <Icons.x className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {filters.search && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Search: "{filters.search}"
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="ml-1 hover:bg-primary/20 rounded"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {filters.status !== 'all' && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Status: {statuses.find(s => s.value === filters.status)?.label}
                  <button
                    onClick={() => updateFilter('status', 'all')}
                    className="ml-1 hover:bg-primary/20 rounded"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {filters.category !== 'all' && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Category: {categories.find(c => c.id === filters.category)?.name}
                  <button
                    onClick={() => updateFilter('category', 'all')}
                    className="ml-1 hover:bg-primary/20 rounded"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

