'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface EventFiltersProps {
  filters: {
    status: string;
    type: string;
    search: string;
    dateRange: string;
  };
  onFiltersChange: (filters: any) => void;
}

const eventTypes = [
  { value: 'all', label: 'All Types', icon: Icons.list },
  { value: 'competition', label: 'Competition', icon: Icons.trophy },
  { value: 'workshop', label: 'Workshop', icon: Icons.book },
  { value: 'seminar', label: 'Seminar', icon: Icons.user },
  { value: 'cultural', label: 'Cultural', icon: Icons.star },
  { value: 'sports', label: 'Sports', icon: Icons.target },
  { value: 'technical', label: 'Technical', icon: Icons.code },
];

const eventStatuses = [
  { value: 'all', label: 'All Status', icon: Icons.list },
  { value: 'published', label: 'Open for Registration', icon: Icons.checkCircle },
  { value: 'ongoing', label: 'Ongoing', icon: Icons.clock },
  { value: 'completed', label: 'Completed', icon: Icons.check },
  { value: 'cancelled', label: 'Cancelled', icon: Icons.x },
];

const dateRanges = [
  { value: 'upcoming', label: 'Upcoming Events' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'past', label: 'Past Events' },
  { value: 'all', label: 'All Time' },
];

export function EventFilters({ filters, onFiltersChange }: EventFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      type: 'all',
      search: '',
      dateRange: 'upcoming',
    });
  };

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.type !== 'all' || 
    filters.search !== '' || 
    filters.dateRange !== 'upcoming';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">Search events</Label>
            <div className="relative">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Event Type Filter */}
          <div className="min-w-[160px]">
            <Label htmlFor="type" className="sr-only">Filter by type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => updateFilter('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[180px]">
            <Label htmlFor="status" className="sr-only">Filter by status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Event status" />
              </SelectTrigger>
              <SelectContent>
                {eventStatuses.map((status) => {
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

          {/* Date Range Filter */}
          <div className="min-w-[160px]">
            <Label htmlFor="dateRange" className="sr-only">Filter by date range</Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => updateFilter('dateRange', value)}
            >
              <SelectTrigger id="dateRange">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
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
              
              {filters.type !== 'all' && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Type: {eventTypes.find(t => t.value === filters.type)?.label}
                  <button
                    onClick={() => updateFilter('type', 'all')}
                    className="ml-1 hover:bg-primary/20 rounded"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {filters.status !== 'all' && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Status: {eventStatuses.find(s => s.value === filters.status)?.label}
                  <button
                    onClick={() => updateFilter('status', 'all')}
                    className="ml-1 hover:bg-primary/20 rounded"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.dateRange !== 'upcoming' && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Date: {dateRanges.find(d => d.value === filters.dateRange)?.label}
                  <button
                    onClick={() => updateFilter('dateRange', 'upcoming')}
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
