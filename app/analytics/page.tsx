'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalMentees: 15,
    activeApprovals: 8,
    totalApprovals: 156,
    avgApprovalTime: 2.3, // days
    thisMonthApprovals: 23,
    approvalRate: 94.2, // percentage
    totalCreditsAwarded: 2340,
    avgCreditsPerApproval: 15.2,
  },
  approvalTrends: [
    { month: 'Jan', approvals: 18, credits: 285, avgTime: 2.1 },
    { month: 'Feb', approvals: 22, credits: 335, avgTime: 2.4 },
    { month: 'Mar', approvals: 19, credits: 298, avgTime: 2.0 },
    { month: 'Apr', approvals: 25, credits: 378, avgTime: 2.2 },
    { month: 'May', approvals: 21, credits: 315, avgTime: 2.5 },
    { month: 'Jun', approvals: 23, credits: 342, avgTime: 2.3 },
  ],
  categoryBreakdown: [
    { category: 'Technical Certification', count: 45, percentage: 28.8, avgCredits: 12.5, trend: '+15%' },
    { category: 'Project', count: 38, percentage: 24.4, avgCredits: 18.2, trend: '+8%' },
    { category: 'Competition', count: 28, percentage: 17.9, avgCredits: 20.3, trend: '+22%' },
    { category: 'Research Publication', count: 22, percentage: 14.1, avgCredits: 25.0, trend: '+5%' },
    { category: 'Professional Certification', count: 15, percentage: 9.6, avgCredits: 16.8, trend: '+12%' },
    { category: 'Leadership', count: 8, percentage: 5.1, avgCredits: 14.2, trend: '-3%' },
  ],
  topMentees: [
    {
      id: '1',
      name: 'Priya Sharma',
      studentId: 'CS2022001',
      department: 'Computer Science',
      year: '3rd Year',
      totalAchievements: 12,
      totalCredits: 185,
      recentActivity: '2 days ago',
      performance: 'excellent',
      cgpa: 3.8,
    },
    {
      id: '2',
      name: 'Rahul Kumar',
      studentId: 'CS2022045',
      department: 'Computer Science', 
      year: '4th Year',
      totalAchievements: 15,
      totalCredits: 225,
      recentActivity: '1 day ago',
      performance: 'excellent',
      cgpa: 3.9,
    },
    {
      id: '3',
      name: 'Anita Patel',
      studentId: 'EE2022078',
      department: 'Electrical Engineering',
      year: '3rd Year',
      totalAchievements: 8,
      totalCredits: 142,
      recentActivity: '5 days ago',
      performance: 'good',
      cgpa: 3.7,
    },
    {
      id: '4',
      name: 'Vikash Singh',
      studentId: 'CS2022091',
      department: 'Computer Science',
      year: '4th Year',
      totalAchievements: 18,
      totalCredits: 285,
      recentActivity: '3 days ago',
      performance: 'outstanding',
      cgpa: 3.95,
    },
    {
      id: '5',
      name: 'Sneha Gupta',
      studentId: 'IT2022034',
      department: 'Information Technology',
      year: '3rd Year',
      totalAchievements: 10,
      totalCredits: 168,
      recentActivity: '1 week ago',
      performance: 'good',
      cgpa: 3.85,
    },
  ],
  recentApprovals: [
    {
      id: '1',
      title: 'React.js Full Stack Certification',
      studentName: 'Priya Sharma',
      category: 'Technical Certification',
      creditsAwarded: 15,
      approvedDate: '2024-01-20',
      approvalTime: 2, // days
    },
    {
      id: '2',
      title: 'Google Cloud Professional Architect',
      studentName: 'Rahul Kumar',
      category: 'Professional Certification',
      creditsAwarded: 20,
      approvedDate: '2024-01-19',
      approvalTime: 1, // days
    },
    {
      id: '3',
      title: 'Smart Campus IoT Project',
      studentName: 'Anita Patel',
      category: 'Project',
      creditsAwarded: 18,
      approvedDate: '2024-01-18',
      approvalTime: 3, // days
    },
    {
      id: '4',
      title: 'National Hackathon Winner',
      studentName: 'Sneha Gupta',
      category: 'Competition',
      creditsAwarded: 22,
      approvedDate: '2024-01-17',
      approvalTime: 2, // days
    },
    {
      id: '5',
      title: 'IEEE Research Paper',
      studentName: 'Vikash Singh',
      category: 'Research Publication',
      creditsAwarded: 25,
      approvedDate: '2024-01-16',
      approvalTime: 1, // days
    },
  ],
  insights: [
    {
      type: 'positive',
      title: 'High Approval Rate',
      description: 'Your approval rate of 94.2% is above the faculty average of 87%',
      recommendation: 'Continue maintaining high standards while supporting student growth'
    },
    {
      type: 'neutral',
      title: 'Approval Time Trends',
      description: 'Your average approval time has increased slightly to 2.3 days',
      recommendation: 'Consider setting aside dedicated time slots for faster reviews'
    },
    {
      type: 'positive',
      title: 'Competition Category Growth',
      description: 'Competition-based achievements are up 22% this month',
      recommendation: 'Encourage more students to participate in hackathons and contests'
    },
    {
      type: 'warning',
      title: 'Leadership Achievements Down',
      description: 'Leadership category shows a 3% decline',
      recommendation: 'Promote leadership opportunities and student organization involvement'
    }
  ]
};

export default function AnalyticsPage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');
  const data = mockAnalyticsData;

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'outstanding': return 'text-purple-600 bg-purple-100';
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <Icons.trendingUp className="h-5 w-5 text-green-600" />;
      case 'warning': return <Icons.alertCircle className="h-5 w-5 text-yellow-600" />;
      case 'negative': return <Icons.arrowDown className="h-5 w-5 text-red-600" />;
      default: return <Icons.info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Faculty Analytics</h1>
            <p className="text-muted-foreground">
              Track your mentoring impact and approval patterns
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Icons.download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mentees">Mentees</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Mentees</CardTitle>
                  <Icons.users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{data.overview.totalMentees}</div>
                  <p className="text-xs text-muted-foreground">Active students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Approvals</CardTitle>
                  <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{data.overview.totalApprovals}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                  <Icons.target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{data.overview.approvalRate}%</div>
                  <p className="text-xs text-muted-foreground">Above average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credits Awarded</CardTitle>
                  <Icons.award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{data.overview.totalCreditsAwarded}</div>
                  <p className="text-xs text-muted-foreground">Total credits</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Trends</CardTitle>
                <CardDescription>Monthly approval patterns and credit distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.approvalTrends.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="font-medium text-sm w-12">{month.month}</div>
                        <div className="flex items-center gap-6">
                          <div className="text-sm">
                            <span className="font-medium">{month.approvals}</span> approvals
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {month.credits} credits
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {month.avgTime} days avg
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={(month.approvals / 30) * 100} 
                        className="w-20" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Achievement Categories</CardTitle>
                <CardDescription>Breakdown by achievement type and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.categoryBreakdown.map((category) => (
                    <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{category.category}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              Avg: {category.avgCredits} credits
                            </span>
                            <Badge className={`text-xs ${getTrendColor(category.trend)}`} variant="outline">
                              {category.trend}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress 
                            value={category.percentage} 
                            className="flex-1" 
                          />
                          <span className="text-sm text-muted-foreground w-16">
                            {category.count} ({category.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Mentees</CardTitle>
                <CardDescription>Your most active and successful students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topMentees.map((mentee) => (
                    <Card key={mentee.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {mentee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{mentee.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>ID: {mentee.studentId}</span>
                              <span>{mentee.department}</span>
                              <span>{mentee.year}</span>
                              <span>CGPA: {mentee.cgpa}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`text-xs ${getPerformanceColor(mentee.performance)}`}>
                              {mentee.performance}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium text-green-600">{mentee.totalAchievements}</div>
                              <div className="text-xs text-muted-foreground">achievements</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-blue-600">{mentee.totalCredits}</div>
                              <div className="text-xs text-muted-foreground">credits</div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last active: {mentee.recentActivity}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Approvals</CardTitle>
                <CardDescription>Your latest achievement approvals and processing times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{approval.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{approval.studentName}</span>
                          <span>{approval.category}</span>
                          <span>Approved: {formatDate(approval.approvedDate)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary text-lg">
                          {approval.creditsAwarded} credits
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {approval.approvalTime} day{approval.approvalTime !== 1 ? 's' : ''} to approve
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{data.overview.thisMonthApprovals}</div>
                  <p className="text-xs text-muted-foreground">Approvals processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Avg Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{data.overview.avgApprovalTime} days</div>
                  <p className="text-xs text-muted-foreground">Per approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{data.overview.activeApprovals}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              {data.insights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{insight.title}</h3>
                        <p className="text-muted-foreground mb-3">{insight.description}</p>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Icons.lightbulb className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm">Recommendation</span>
                          </div>
                          <p className="text-sm">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Take action based on your analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Icons.messageCircle className="h-4 w-4 mr-2" />
                    Message All Mentees
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Icons.calendar className="h-4 w-4 mr-2" />
                    Schedule Reviews
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Icons.target className="h-4 w-4 mr-2" />
                    Set Goals
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Icons.fileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Icons.users className="h-4 w-4 mr-2" />
                    Faculty Meeting
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Icons.settings className="h-4 w-4 mr-2" />
                    Analytics Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
