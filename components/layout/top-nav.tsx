'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { NotificationDropdown } from '@/components/notifications/notification-dropdown';

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { dbUser, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getSearchPlaceholder = () => {
    switch (dbUser?.role) {
      case 'student':
        return 'Search jobs, events, achievements...';
      case 'faculty':
        return 'Search students, achievements...';
      case 'recruiter':
        return 'Search candidates, applications...';
      case 'institution_admin':
        return 'Search students, faculty, reports...';
      default:
        return 'Search...';
    }
  };

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Icons.menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>

          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold">
              {getGreeting()}, {dbUser?.fullName?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-sm text-muted-foreground capitalize">
              {dbUser?.role?.replace('_', ' ')} Dashboard
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Quick Actions based on role */}
          {dbUser?.role === 'student' && (
            <Link href="/achievements/add">
              <Button size="sm" className="hidden sm:flex">
                <Icons.plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            </Link>
          )}

          {dbUser?.role === 'faculty' && (
            <Link href="/events/create">
              <Button size="sm" className="hidden sm:flex">
                <Icons.plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </Link>
          )}

          {dbUser?.role === 'recruiter' && (
            <Link href="/jobs/post">
              <Button size="sm" className="hidden sm:flex">
                <Icons.plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </Link>
          )}

          {/* Notifications */}
          <NotificationDropdown />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icons.user className="h-4 w-4 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {dbUser?.fullName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {dbUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <Icons.user className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Icons.settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              {dbUser?.role === 'student' && (
                <DropdownMenuItem>
                  <Icons.download className="mr-2 h-4 w-4" />
                  <span>Export Resume</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem>
                <Icons.helpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={signOut}
              >
                <Icons.logOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

