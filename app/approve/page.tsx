'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// Mock data for pending achievements
const mockPendingAchievements = [
  {
    id: '1',
    title: 'React.js Full Stack Certification',
    studentName: 'Priya Sharma',
    studentId: 'CS2022001',
    studentEmail: 'priya.sharma@university.edu',
    category: 'Technical Certification',
    dateAchieved: '2024-01-15',
    dateSubmitted: '2024-01-20',
    description: 'Completed comprehensive React.js full-stack development course covering React fundamentals, state management with Redux, backend integration with Node.js and Express, database operations with MongoDB, and deployment strategies. Built 3 full-stack applications including an e-commerce platform.',
    evidenceFiles: [
      { name: 'react-certificate.pdf', url: '/certificates/react-cert.pdf' },
      { name: 'project-screenshots.png', url: '/evidence/react-projects.png' },
      { name: 'github-repository.txt', url: 'https://github.com/priya/react-projects' }
    ],
    skillTags: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Redux'],
    requestedCredits: 15,
    priority: 'high',
    submittedDaysAgo: 3,
    studentProfile: {
      year: '3rd Year',
      cgpa: 3.8,
      department: 'Computer Science',
      achievements: 8,
      totalCredits: 45
    }
  },
  {
    id: '2',
    title: 'Google Cloud Professional Cloud Architect',
    studentName: 'Rahul Kumar',
    studentId: 'CS2022045',
    studentEmail: 'rahul.k@university.edu',
    category: 'Professional Certification',
    dateAchieved: '2024-01-18',
    dateSubmitted: '2024-01-19',
    description: 'Achieved Google Cloud Professional Cloud Architect certification demonstrating expertise in designing and implementing Google Cloud Platform solutions. Covers cloud architecture patterns, security, compliance, scalability, and cost optimization.',
    evidenceFiles: [
      { name: 'gcp-certificate.pdf', url: '/certificates/gcp-cert.pdf' },
      { name: 'verification-badge.png', url: '/evidence/gcp-badge.png' }
    ],
    skillTags: ['Google Cloud', 'Cloud Architecture', 'DevOps', 'Kubernetes', 'Terraform'],
    requestedCredits: 20,
    priority: 'high',
    submittedDaysAgo: 2,
    studentProfile: {
      year: '4th Year',
      cgpa: 3.9,
      department: 'Computer Science',
      achievements: 12,
      totalCredits: 78
    }
  },
  {
    id: '3',
    title: 'Smart Campus IoT Project',
    studentName: 'Anita Patel',
    studentId: 'EE2022078',
    studentEmail: 'anita.patel@university.edu',
    category: 'Project',
    dateAchieved: '2024-01-10',
    dateSubmitted: '2024-01-18',
    description: 'Developed and implemented a comprehensive IoT-based smart campus monitoring system. The project includes environmental sensors, occupancy detection, energy monitoring, and a real-time dashboard. Deployed across 3 campus buildings with measurable energy savings.',
    evidenceFiles: [
      { name: 'project-report.pdf', url: '/evidence/iot-report.pdf' },
      { name: 'demo-video.mp4', url: '/evidence/iot-demo.mp4' },
      { name: 'code-repository.txt', url: 'https://github.com/anita/smart-campus-iot' },
      { name: 'deployment-photos.zip', url: '/evidence/iot-deployment.zip' }
    ],
    skillTags: ['IoT', 'Arduino', 'Raspberry Pi', 'Python', 'MQTT', 'React Dashboard'],
    requestedCredits: 18,
    priority: 'medium',
    submittedDaysAgo: 5,
    studentProfile: {
      year: '3rd Year',
      cgpa: 3.7,
      department: 'Electrical Engineering',
      achievements: 6,
      totalCredits: 35
    }
  },
  {
    id: '4',
    title: 'IEEE Research Paper Publication',
    studentName: 'Vikash Singh',
    studentId: 'CS2022091',
    studentEmail: 'vikash.singh@university.edu',
    category: 'Research Publication',
    dateAchieved: '2024-01-05',
    dateSubmitted: '2024-01-17',
    description: 'Co-authored and published research paper "Machine Learning Applications in Predictive Maintenance for Industrial IoT Systems" in IEEE Transactions on Industrial Informatics. Paper presents novel ML algorithms for predicting equipment failures with 94% accuracy.',
    evidenceFiles: [
      { name: 'ieee-paper.pdf', url: '/evidence/ieee-paper.pdf' },
      { name: 'publication-proof.pdf', url: '/evidence/ieee-acceptance.pdf' },
      { name: 'citation-metrics.pdf', url: '/evidence/citations.pdf' }
    ],
    skillTags: ['Machine Learning', 'Research', 'Industrial IoT', 'Python', 'TensorFlow', 'Academic Writing'],
    requestedCredits: 25,
    priority: 'high',
    submittedDaysAgo: 6,
    studentProfile: {
      year: '4th Year',
      cgpa: 3.95,
      department: 'Computer Science',
      achievements: 15,
      totalCredits: 89
    }
  },
  {
    id: '5',
    title: 'National Level Hackathon Winner',
    studentName: 'Sneha Gupta',
    studentId: 'IT2022034',
    studentEmail: 'sneha.gupta@university.edu',
    category: 'Competition',
    dateAchieved: '2024-01-12',
    dateSubmitted: '2024-01-16',
    description: 'First place winner at the National Student Innovation Hackathon 2024. Led a team of 4 to develop "EcoTrack" - a blockchain-based carbon footprint tracking application. Competed against 200+ teams from across India.',
    evidenceFiles: [
      { name: 'winner-certificate.pdf', url: '/evidence/hackathon-cert.pdf' },
      { name: 'project-presentation.pdf', url: '/evidence/ecotrack-pitch.pdf' },
      { name: 'news-coverage.pdf', url: '/evidence/hackathon-news.pdf' },
      { name: 'team-photo.jpg', url: '/evidence/team-photo.jpg' }
    ],
    skillTags: ['Blockchain', 'React', 'Node.js', 'Solidity', 'Team Leadership', 'Problem Solving'],
    requestedCredits: 22,
    priority: 'high',
    submittedDaysAgo: 7,
    studentProfile: {
      year: '3rd Year',
      cgpa: 3.85,
      department: 'Information Technology',
      achievements: 9,
      totalCredits: 52
    }
  }
];

export default function ApprovePage() {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState('approve');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [approvedCredits, setApprovedCredits] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const handleApprovalAction = (achievement: any, action: string) => {
    setSelectedAchievement(achievement);
    setApprovalAction(action);
    setApprovedCredits(achievement.requestedCredits);
    setApprovalNotes('');
    setIsApprovalDialogOpen(true);
  };

  const submitApproval = async () => {
    if (!selectedAchievement) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (approvalAction === 'approve') {
        toast.success(`Achievement approved with ${approvedCredits} credits`);
      } else {
        toast.success('Achievement rejected with feedback');
      }
      
      setIsApprovalDialogOpen(false);
      setSelectedAchievement(null);
    } catch (error) {
      toast.error('Failed to process approval');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium': return <Badge variant="secondary" className="text-xs">Medium Priority</Badge>;
      default: return <Badge variant="outline" className="text-xs">Low Priority</Badge>;
    }
  };

  const filteredAchievements = mockPendingAchievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || achievement.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || achievement.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Achievement Approvals</h1>
            <p className="text-muted-foreground">
              Review and approve student achievement submissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {filteredAchievements.length} pending
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search achievements, students, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technical Certification">Technical Certification</SelectItem>
                  <SelectItem value="Professional Certification">Professional Certification</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Research Publication">Research Publication</SelectItem>
                  <SelectItem value="Competition">Competition</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Achievements List */}
        <div className="space-y-4">
          {filteredAchievements.map((achievement) => (
            <Card key={achievement.id} className={`${getPriorityColor(achievement.priority)} border-l-4`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{achievement.title}</h3>
                      {getPriorityBadge(achievement.priority)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Icons.user className="h-4 w-4" />
                        <span className="font-medium">{achievement.studentName}</span>
                      </div>
                      <span>ID: {achievement.studentId}</span>
                      <span>{achievement.studentProfile.year}</span>
                      <span>{achievement.studentProfile.department}</span>
                      <span>CGPA: {achievement.studentProfile.cgpa}</span>
                    </div>
                    <p className="text-sm mb-3 leading-relaxed">{achievement.description}</p>
                    
                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {achievement.skillTags.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span>Achieved: {formatDate(achievement.dateAchieved)}</span>
                      <span>Submitted: {formatDate(achievement.dateSubmitted)}</span>
                      <span>Category: {achievement.category}</span>
                      <span>{achievement.evidenceFiles.length} evidence file(s)</span>
                    </div>
                  </div>

                  <div className="ml-6">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-bold text-primary">{achievement.requestedCredits}</div>
                      <div className="text-xs text-muted-foreground">credits requested</div>
                    </div>
                    <Badge variant="outline" className="mb-2">
                      {achievement.submittedDaysAgo} days ago
                    </Badge>
                  </div>
                </div>

                {/* Evidence Files */}
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm">Evidence Files:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {achievement.evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Icons.fileText className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <Icons.eye className="h-4 w-4 mr-2" />
                      View Evidence
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icons.user className="h-4 w-4 mr-2" />
                      View Student Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icons.messageCircle className="h-4 w-4 mr-2" />
                      Message Student
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleApprovalAction(achievement, 'reject')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icons.x className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApprovalAction(achievement, 'approve')}
                    >
                      <Icons.check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Icons.checkCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No achievements to review</h3>
              <p className="text-muted-foreground">
                All achievements matching your filters have been reviewed.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Approval Dialog */}
        <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {approvalAction === 'approve' ? 'Approve Achievement' : 'Reject Achievement'}
              </DialogTitle>
              <DialogDescription>
                {selectedAchievement && (
                  <>
                    <strong>{selectedAchievement.title}</strong> by {selectedAchievement.studentName}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {approvalAction === 'approve' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Credits to Award</label>
                  <Input
                    type="number"
                    value={approvedCredits}
                    onChange={(e) => setApprovedCredits(parseInt(e.target.value) || 0)}
                    min="0"
                    max="50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Requested: {selectedAchievement?.requestedCredits} credits
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {approvalAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason'}
                </label>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder={
                    approvalAction === 'approve' 
                      ? "Add any comments about this achievement..." 
                      : "Please explain why this achievement is being rejected..."
                  }
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitApproval}
                variant={approvalAction === 'approve' ? 'default' : 'destructive'}
              >
                {approvalAction === 'approve' ? 'Approve Achievement' : 'Reject Achievement'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
