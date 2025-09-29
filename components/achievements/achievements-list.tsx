'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';

// Mock data - would come from API
const mockAchievements = [
  {
    id: '1',
    title: 'Web Development Certificate',
    description: 'Completed comprehensive web development course covering HTML, CSS, JavaScript, and React.',
    category: { id: '1', name: 'Technical', icon: '💻' },
    dateAchieved: '2024-01-15',
    status: 'approved',
    credits: 10,
    skillTags: ['HTML', 'CSS', 'JavaScript', 'React'],
    certificateUrl: '/certificates/web-dev-cert.pdf',
    evidenceUrls: ['/evidence/project1.png', '/evidence/project2.png'],
    approvedBy: 'Prof. John Smith',
    approvedAt: '2024-01-18',
    isPublic: true,
    verificationHash: 'abc123...',
  },
  {
    id: '2',
    title: 'Hackathon Winner - TechFest 2024',
    description: 'First place in the 48-hour hackathon for developing an AI-powered student productivity app.',
    category: { id: '2', name: 'Competition', icon: '🏆' },
    dateAchieved: '2024-01-10',
    status: 'pending',
    credits: 15,
    skillTags: ['Python', 'AI/ML', 'React', 'Team Leadership'],
    certificateUrl: '/certificates/hackathon-cert.pdf',
    evidenceUrls: ['/evidence/hackathon-project.png', '/evidence/presentation.pdf'],
    isPublic: true,
  },
  {
    id: '3',
    title: 'Research Paper Publication',
    description: 'Co-authored research paper on "Machine Learning in Educational Technology" published in IEEE conference.',
    category: { id: '3', name: 'Research', icon: '📚' },
    dateAchieved: '2023-12-01',
    status: 'approved',
    credits: 20,
    skillTags: ['Research', 'Machine Learning', 'Academic Writing'],
    certificateUrl: '/certificates/research-paper.pdf',
    approvedBy: 'Dr. Sarah Johnson',
    approvedAt: '2023-12-05',
    isPublic: true,
  },
  {
    id: '4',
    title: 'Internship Completion - TechCorp',
    description: '3-month software development internship at TechCorp, worked on React Native mobile applications.',
    category: { id: '4', name: 'Professional', icon: '💼' },
    dateAchieved: '2023-11-30',
    status: 'rejected',
    credits: 0,
    skillTags: ['React Native', 'Mobile Development', 'Professional Experience'],
    certificateUrl: '/certificates/internship-cert.pdf',
    rejectionReason: 'Certificate does not meet institutional verification standards. Please provide official letter from company HR.',
    isPublic: false,
  },
];

interface AchievementsListProps {
  filters: {
    status: string;
    category: string;
    search: string;
  };
}

export function AchievementsList({ filters }: AchievementsListProps) {
  const [achievements, setAchievements] = useState(mockAchievements);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<typeof mockAchievements[0] | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter achievements based on current filters
  const filteredAchievements = achievements.filter(achievement => {
    if (filters.status !== 'all' && achievement.status !== filters.status) {
      return false;
    }
    
    if (filters.category !== 'all' && achievement.category.id !== filters.category) {
      return false;
    }
    
    if (filters.search && !achievement.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !achievement.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Icons.checkCircle className="h-4 w-4" />;
      case 'pending':
        return <Icons.clock className="h-4 w-4" />;
      case 'rejected':
        return <Icons.x className="h-4 w-4" />;
      default:
        return <Icons.clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredAchievements.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.award className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
          <p className="text-muted-foreground mb-4">
            {filters.status !== 'all' || filters.category !== 'all' || filters.search
              ? 'No achievements match your current filters.'
              : 'You haven\'t added any achievements yet.'}
          </p>
          <Button>
            <Icons.plus className="h-4 w-4 mr-2" />
            Add Your First Achievement
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.checkCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {achievements.filter(a => a.status === 'approved').length}
                </div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.clock className="h-5 w-5 text-amber-500" />
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {achievements.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icons.star className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {achievements.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.credits, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                    {achievement.category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(achievement.status)} className="flex items-center gap-1">
                    {getStatusIcon(achievement.status)}
                    {achievement.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Icons.calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Achieved on {formatDate(achievement.dateAchieved)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Icons.bookmark className="h-4 w-4 text-muted-foreground" />
                    <span>{achievement.category.name}</span>
                  </div>

                  {achievement.approvedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icons.user className="h-4 w-4 text-muted-foreground" />
                      <span>Approved by {achievement.approvedBy}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Icons.star className="h-4 w-4 text-muted-foreground" />
                    <span>{achievement.credits} credits</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {achievement.isPublic ? (
                      <>
                        <Icons.globe className="h-4 w-4 text-muted-foreground" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Icons.lock className="h-4 w-4 text-muted-foreground" />
                        <span>Private</span>
                      </>
                    )}
                  </div>

                  {achievement.verificationHash && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icons.shield className="h-4 w-4 text-muted-foreground" />
                      <span>Blockchain verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {achievement.skillTags.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  {achievement.certificateUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={achievement.certificateUrl} target="_blank" rel="noopener noreferrer">
                        <Icons.download className="h-4 w-4 mr-1" />
                        Certificate
                      </a>
                    </Button>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedAchievement(achievement)}>
                        <Icons.eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {achievement.category.icon}
                          {achievement.title}
                        </DialogTitle>
                        <DialogDescription>
                          Achievement details and verification information
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedAchievement && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">{selectedAchievement.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Achievement Details</h4>
                              <div className="space-y-2 text-sm">
                                <div>Date: {formatDate(selectedAchievement.dateAchieved)}</div>
                                <div>Category: {selectedAchievement.category.name}</div>
                                <div>Credits: {selectedAchievement.credits}</div>
                                <div>Status: <Badge variant={getStatusColor(selectedAchievement.status)}>{selectedAchievement.status}</Badge></div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Verification</h4>
                              <div className="space-y-2 text-sm">
                                {selectedAchievement.approvedBy && (
                                  <div>Approved by: {selectedAchievement.approvedBy}</div>
                                )}
                                {selectedAchievement.approvedAt && (
                                  <div>Approved on: {formatDate(selectedAchievement.approvedAt)}</div>
                                )}
                                {selectedAchievement.verificationHash && (
                                  <div className="flex items-center gap-2">
                                    <Icons.shield className="h-4 w-4 text-green-500" />
                                    <span>Blockchain verified</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {selectedAchievement.skillTags.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Skills & Technologies</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedAchievement.skillTags.map((skill) => (
                                  <Badge key={skill} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedAchievement.rejectionReason && (
                            <div>
                              <h4 className="font-medium mb-2 text-red-600">Rejection Reason</h4>
                              <p className="text-sm text-red-600">{selectedAchievement.rejectionReason}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-4 border-t">
                            {selectedAchievement.certificateUrl && (
                              <Button asChild>
                                <a href={selectedAchievement.certificateUrl} target="_blank" rel="noopener noreferrer">
                                  <Icons.download className="h-4 w-4 mr-2" />
                                  Download Certificate
                                </a>
                              </Button>
                            )}
                            
                            <Button variant="outline">
                              <Icons.share className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Icons.edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Icons.share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

