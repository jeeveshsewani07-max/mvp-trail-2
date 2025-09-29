'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

// Mock badges data
const mockBadges = [
  {
    id: '1',
    name: 'Early Adopter',
    description: 'One of the first 100 students to join Smart Student Hub',
    icon: '🌟',
    rarity: 'common',
    category: 'milestone',
    earned: true,
    earnedAt: '2024-01-01',
    progress: 100,
    maxProgress: 100,
    condition: 'Join Smart Student Hub in the beta phase',
  },
  {
    id: '2',
    name: 'Academic Excellence',
    description: 'Maintain a GPA above 3.8 for 2 consecutive semesters',
    icon: '🎓',
    rarity: 'rare',
    category: 'academic',
    earned: true,
    earnedAt: '2024-01-15',
    progress: 100,
    maxProgress: 100,
    condition: 'GPA ≥ 3.8 for 2 semesters',
  },
  {
    id: '3',
    name: 'Innovation Master',
    description: 'Win 3 hackathons or innovation competitions',
    icon: '💡',
    rarity: 'legendary',
    category: 'competition',
    earned: false,
    progress: 1,
    maxProgress: 3,
    condition: 'Win 3 hackathons or competitions',
  },
  {
    id: '4',
    name: 'Team Player',
    description: 'Complete 5 group projects with excellent teamwork ratings',
    icon: '🤝',
    rarity: 'uncommon',
    category: 'collaboration',
    earned: false,
    progress: 3,
    maxProgress: 5,
    condition: 'Complete 5 group projects with high ratings',
  },
  {
    id: '5',
    name: 'Research Pioneer',
    description: 'Publish 2 research papers in recognized journals',
    icon: '📚',
    rarity: 'rare',
    category: 'research',
    earned: false,
    progress: 0,
    maxProgress: 2,
    condition: 'Publish 2 research papers',
  },
  {
    id: '6',
    name: 'Community Leader',
    description: 'Organize and lead 3 successful student events',
    icon: '👑',
    rarity: 'rare',
    category: 'leadership',
    earned: true,
    earnedAt: '2024-02-01',
    progress: 100,
    maxProgress: 100,
    condition: 'Organize 3 successful events',
  },
  {
    id: '7',
    name: 'Skill Collector',
    description: 'Master 10 different technical skills',
    icon: '🔧',
    rarity: 'uncommon',
    category: 'skills',
    earned: false,
    progress: 7,
    maxProgress: 10,
    condition: 'Master 10 technical skills',
  },
  {
    id: '8',
    name: 'Mentor',
    description: 'Successfully mentor 5 junior students',
    icon: '🎯',
    rarity: 'rare',
    category: 'mentorship',
    earned: false,
    progress: 2,
    maxProgress: 5,
    condition: 'Mentor 5 junior students',
  },
];

const categories = [
  { id: 'all', name: 'All Badges', count: mockBadges.length },
  { id: 'milestone', name: 'Milestones', count: mockBadges.filter(b => b.category === 'milestone').length },
  { id: 'academic', name: 'Academic', count: mockBadges.filter(b => b.category === 'academic').length },
  { id: 'competition', name: 'Competition', count: mockBadges.filter(b => b.category === 'competition').length },
  { id: 'collaboration', name: 'Collaboration', count: mockBadges.filter(b => b.category === 'collaboration').length },
  { id: 'research', name: 'Research', count: mockBadges.filter(b => b.category === 'research').length },
  { id: 'leadership', name: 'Leadership', count: mockBadges.filter(b => b.category === 'leadership').length },
  { id: 'skills', name: 'Skills', count: mockBadges.filter(b => b.category === 'skills').length },
  { id: 'mentorship', name: 'Mentorship', count: mockBadges.filter(b => b.category === 'mentorship').length },
];

export default function BadgesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  const filteredBadges = mockBadges.filter(badge => {
    if (selectedCategory !== 'all' && badge.category !== selectedCategory) {
      return false;
    }
    if (selectedRarity !== 'all' && badge.rarity !== selectedRarity) {
      return false;
    }
    return true;
  });

  const earnedBadges = mockBadges.filter(b => b.earned);
  const totalProgress = mockBadges.reduce((sum, b) => sum + (b.progress / b.maxProgress * 100), 0) / mockBadges.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500';
      case 'uncommon':
        return 'bg-green-500';
      case 'rare':
        return 'bg-blue-500';
      case 'legendary':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'uncommon':
        return 'from-green-400 to-green-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'legendary':
        return 'from-purple-400 to-pink-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Achievement Badges</h1>
        <p className="text-muted-foreground">
          Collect badges by completing achievements and reaching milestones. Show off your accomplishments!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Icons.badge className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{earnedBadges.length}</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Icons.target className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockBadges.length - earnedBadges.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Icons.zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Icons.crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{earnedBadges.filter(b => b.rarity === 'rare' || b.rarity === 'legendary').length}</div>
                <div className="text-sm text-muted-foreground">Rare+ Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="all">All Badges</TabsTrigger>
            <TabsTrigger value="earned">Earned ({earnedBadges.length})</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => (
              <Card key={badge.id} className={cn(
                "card-hover transition-all duration-200",
                badge.earned 
                  ? `ring-2 ring-offset-2 ring-offset-background bg-gradient-to-br ${getRarityGradient(badge.rarity)}/10`
                  : "opacity-75"
              )}>
                <CardContent className="p-6 text-center">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl relative",
                    badge.earned 
                      ? `bg-gradient-to-br ${getRarityGradient(badge.rarity)}` 
                      : "bg-muted"
                  )}>
                    <span className={badge.earned ? "text-white" : "grayscale"}>{badge.icon}</span>
                    {badge.earned && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Icons.check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold mb-2">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {badge.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn("capitalize", getRarityColor(badge.rarity), "text-white")}
                      >
                        {badge.rarity}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {badge.category}
                      </Badge>
                    </div>

                    {!badge.earned && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(badge.progress / badge.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {badge.earned && badge.earnedAt && (
                      <div className="text-xs text-muted-foreground">
                        Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earned" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {earnedBadges.filter(badge => 
              (selectedCategory === 'all' || badge.category === selectedCategory) &&
              (selectedRarity === 'all' || badge.rarity === selectedRarity)
            ).map((badge) => (
              <Card key={badge.id} className={cn(
                "card-hover transition-all duration-200 ring-2 ring-offset-2 ring-offset-background",
                `bg-gradient-to-br ${getRarityGradient(badge.rarity)}/10`
              )}>
                <CardContent className="p-6 text-center">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl relative",
                    `bg-gradient-to-br ${getRarityGradient(badge.rarity)}`
                  )}>
                    <span className="text-white">{badge.icon}</span>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Icons.check className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  <h3 className="font-semibold mb-2">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {badge.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn("capitalize", getRarityColor(badge.rarity), "text-white")}
                      >
                        {badge.rarity}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {badge.category}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Earned on {new Date(badge.earnedAt!).toLocaleDateString()}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Icons.share className="h-4 w-4 mr-2" />
                      Share Badge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredBadges.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Icons.badge className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No badges found</h3>
            <p className="text-muted-foreground mb-4">
              No badges match your current filters. Try adjusting your selection.
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </DashboardLayout>
  );
}
