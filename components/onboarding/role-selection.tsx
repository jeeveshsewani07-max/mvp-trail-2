'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
  isLoading: boolean;
}

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Build your verified digital portfolio, discover opportunities, and track your achievements.',
    icon: Icons.graduationCap,
    features: [
      'Create verified achievement portfolio',
      'Discover jobs and internships',
      'Participate in events and earn credits',
      'Get personalized career guidance',
    ],
  },
  {
    id: 'faculty',
    title: 'Faculty / Mentor',
    description: 'Guide students, approve achievements, and create impactful events.',
    icon: Icons.user,
    features: [
      'Mentor students and track their progress',
      'Approve student achievements',
      'Create and manage events',
      'Provide feedback and recommendations',
    ],
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    description: 'Find top talent with verified skills and achievements.',
    icon: Icons.briefcase,
    features: [
      'Access verified student profiles',
      'Post jobs and internships',
      'Filter candidates by skills and achievements',
      'Connect with high-potential students',
    ],
  },
  {
    id: 'institution_admin',
    title: 'Institution Admin',
    description: 'Manage your institution\'s presence and get comprehensive analytics.',
    icon: Icons.building,
    features: [
      'Institution dashboard and analytics',
      'NAAC/NIRF compliance reporting',
      'Custom credit and badge systems',
      'Department-wise performance tracking',
    ],
  },
];

export function RoleSelection({ onRoleSelect, isLoading }: RoleSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {roles.map((role) => {
        const IconComponent = role.icon;
        
        return (
          <Card
            key={role.id}
            className="glass-card card-hover cursor-pointer relative overflow-hidden group"
            onClick={() => !isLoading && onRoleSelect(role.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{role.title}</CardTitle>
              <CardDescription className="text-base">
                {role.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative">
              <ul className="space-y-2 mb-6">
                {role.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Icons.check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className="w-full"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  onRoleSelect(role.id);
                }}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <span>Continue as {role.title}</span>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


