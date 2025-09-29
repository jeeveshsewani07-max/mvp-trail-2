'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { dbUser, signOut } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Icons.home,
        current: pathname === '/dashboard',
      },
    ];

    switch (dbUser?.role) {
      case 'student':
        return [
          ...baseItems,
          {
            name: 'My Portfolio',
            href: '/portfolio',
            icon: Icons.user,
            current: pathname === '/portfolio',
          },
          {
            name: 'Achievements',
            href: '/achievements',
            icon: Icons.award,
            current: pathname.startsWith('/achievements'),
          },
          {
            name: 'Events',
            href: '/events',
            icon: Icons.calendar,
            current: pathname.startsWith('/events'),
          },
          {
            name: 'Jobs & Internships',
            href: '/jobs',
            icon: Icons.briefcase,
            current: pathname.startsWith('/jobs'),
          },
          {
            name: 'My Applications',
            href: '/applications',
            icon: Icons.fileText,
            current: pathname.startsWith('/applications'),
          },
          {
            name: 'Badges',
            href: '/badges',
            icon: Icons.badge,
            current: pathname.startsWith('/badges'),
          },
        ];

      case 'faculty':
        return [
          ...baseItems,
          {
            name: 'My Mentees',
            href: '/mentees',
            icon: Icons.users,
            current: pathname.startsWith('/mentees'),
          },
          {
            name: 'Approve Achievements',
            href: '/approve',
            icon: Icons.checkCircle,
            current: pathname.startsWith('/approve'),
            badge: 5, // This would come from API
          },
          {
            name: 'Create Event',
            href: '/events/create',
            icon: Icons.plus,
            current: pathname === '/events/create',
          },
          {
            name: 'My Events',
            href: '/events/manage',
            icon: Icons.calendar,
            current: pathname.startsWith('/events/manage'),
          },
          {
            name: 'Analytics',
            href: '/analytics',
            icon: Icons.barChart,
            current: pathname.startsWith('/analytics'),
          },
        ];

      case 'recruiter':
        return [
          ...baseItems,
          {
            name: 'Post Job',
            href: '/jobs/post',
            icon: Icons.plus,
            current: pathname === '/jobs/post',
          },
          {
            name: 'My Job Posts',
            href: '/jobs/manage',
            icon: Icons.briefcase,
            current: pathname.startsWith('/jobs/manage'),
          },
          {
            name: 'Applications',
            href: '/applications/manage',
            icon: Icons.fileText,
            current: pathname.startsWith('/applications/manage'),
            badge: 12, // This would come from API
          },
          {
            name: 'Find Candidates',
            href: '/candidates',
            icon: Icons.search,
            current: pathname.startsWith('/candidates'),
          },
          {
            name: 'Shortlisted',
            href: '/shortlisted',
            icon: Icons.heart,
            current: pathname.startsWith('/shortlisted'),
          },
        ];

      case 'institution_admin':
        return [
          ...baseItems,
          {
            name: 'Students',
            href: '/students',
            icon: Icons.graduationCap,
            current: pathname.startsWith('/students'),
          },
          {
            name: 'Faculty',
            href: '/faculty',
            icon: Icons.users,
            current: pathname.startsWith('/faculty'),
          },
          {
            name: 'Departments',
            href: '/departments',
            icon: Icons.building,
            current: pathname.startsWith('/departments'),
          },
          {
            name: 'Analytics',
            href: '/analytics',
            icon: Icons.barChart,
            current: pathname.startsWith('/analytics'),
          },
          {
            name: 'Reports',
            href: '/reports',
            icon: Icons.fileText,
            current: pathname.startsWith('/reports'),
          },
          {
            name: 'Settings',
            href: '/settings',
            icon: Icons.settings,
            current: pathname.startsWith('/settings'),
          },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 lg:static lg:inset-auto lg:translate-x-0 transform transition-transform duration-200 ease-in-out border-r border-gray-200 dark:border-gray-800',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icons.graduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Smart Student Hub</span>
            </div>
          </div>

          {/* User info */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icons.user className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {dbUser?.fullName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {dbUser?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          <Separator />

          {/* Bottom actions */}
          <div className="p-4 space-y-2">
            <Link
              href="/profile"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === '/profile'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icons.settings className="h-4 w-4" />
              Profile Settings
            </Link>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={signOut}
            >
              <Icons.logOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

