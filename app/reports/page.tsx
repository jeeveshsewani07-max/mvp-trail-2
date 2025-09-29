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
import { toast } from 'sonner';
import { 
  exportToPDF, 
  exportDepartmentCSV, 
  exportFinancialCSV, 
  exportAchievementsCSV,
  exportCompleteJSON,
  shareReport,
  shareReportViaEmail
} from '@/lib/utils/export';

// Mock institutional reports data
const mockReportsData = {
  overview: {
    totalStudents: 1247,
    totalFaculty: 89,
    totalDepartments: 5,
    totalAchievements: 3456,
    activeEvents: 18,
    placementRate: 94.2,
    averageCGPA: 8.1,
    researchPublications: 342,
    industryPartnerships: 156,
    graduationRate: 96.8,
  },
  departmentPerformance: [
    { 
      name: 'Computer Science', 
      students: 312, 
      faculty: 24, 
      achievements: 1245, 
      placement: 98, 
      research: 89, 
      satisfaction: 94,
      avgCGPA: 8.4 
    },
    { 
      name: 'Electronics', 
      students: 278, 
      faculty: 18, 
      achievements: 892, 
      placement: 94, 
      research: 85, 
      satisfaction: 91,
      avgCGPA: 8.2 
    },
    { 
      name: 'Mechanical', 
      students: 298, 
      faculty: 22, 
      achievements: 756, 
      placement: 91, 
      research: 78, 
      satisfaction: 88,
      avgCGPA: 7.9 
    },
    { 
      name: 'Civil', 
      students: 201, 
      faculty: 15, 
      achievements: 423, 
      placement: 87, 
      research: 72, 
      satisfaction: 85,
      avgCGPA: 7.8 
    },
    { 
      name: 'Information Technology', 
      students: 158, 
      faculty: 10, 
      achievements: 340, 
      placement: 95, 
      research: 76, 
      satisfaction: 92,
      avgCGPA: 8.3 
    },
  ],
  monthlyTrends: [
    { month: 'Jan 2024', students: 1180, achievements: 245, events: 12, publications: 23 },
    { month: 'Feb 2024', students: 1195, achievements: 289, events: 15, publications: 28 },
    { month: 'Mar 2024', students: 1210, achievements: 312, events: 18, publications: 31 },
    { month: 'Apr 2024', students: 1225, achievements: 298, events: 14, publications: 25 },
    { month: 'May 2024', students: 1238, achievements: 334, events: 19, publications: 35 },
    { month: 'Jun 2024', students: 1247, achievements: 356, events: 22, publications: 38 },
  ],
  financialSummary: {
    totalBudget: 45000000, // 4.5 Crores
    utilized: 38200000,    // 3.82 Crores
    remaining: 6800000,    // 68 Lakhs
    departmentAllocation: [
      { department: 'Computer Science', allocated: 12000000, utilized: 10200000, utilization: 85 },
      { department: 'Electronics', allocated: 9500000, utilized: 8100000, utilization: 85.3 },
      { department: 'Mechanical', allocated: 11000000, utilized: 9800000, utilization: 89.1 },
      { department: 'Civil', allocated: 7500000, utilized: 6200000, utilization: 82.7 },
      { department: 'Information Technology', allocated: 5000000, utilized: 3900000, utilization: 78 },
    ]
  },
  topPerformers: {
    students: [
      { name: 'Aarav Sharma', department: 'Computer Science', cgpa: 9.8, achievements: 25, year: '4th Year' },
      { name: 'Priya Patel', department: 'Electronics', cgpa: 9.7, achievements: 22, year: '3rd Year' },
      { name: 'Rahul Gupta', department: 'Mechanical', cgpa: 9.5, achievements: 20, year: '4th Year' },
      { name: 'Sneha Reddy', department: 'Civil', cgpa: 9.4, achievements: 18, year: '3rd Year' },
      { name: 'Vikash Singh', department: 'Computer Science', cgpa: 9.6, achievements: 24, year: '4th Year' },
    ],
    faculty: [
      { name: 'Dr. Rajesh Kumar', department: 'Computer Science', publications: 45, mentees: 15, rating: 4.9 },
      { name: 'Dr. Kiran Rao', department: 'Electronics', publications: 38, mentees: 18, rating: 4.8 },
      { name: 'Dr. Priyanka Joshi', department: 'Mechanical', publications: 32, mentees: 12, rating: 4.7 },
      { name: 'Dr. Anjali Singh', department: 'Information Technology', publications: 28, mentees: 14, rating: 4.8 },
    ]
  },
  eventSummary: {
    totalEvents: 156,
    completedEvents: 138,
    upcomingEvents: 18,
    totalParticipants: 12450,
    averageAttendance: 78.5,
    eventTypes: [
      { type: 'Technical Workshops', count: 45, attendance: 82.3 },
      { type: 'Seminars', count: 38, attendance: 75.6 },
      { type: 'Competitions', count: 28, attendance: 89.2 },
      { type: 'Cultural Events', count: 25, attendance: 92.1 },
      { type: 'Industry Talks', count: 20, attendance: 68.4 },
    ]
  },
  achievementAnalysis: {
    totalAchievements: 3456,
    approvedAchievements: 3234,
    pendingAchievements: 145,
    rejectedAchievements: 77,
    categoryBreakdown: [
      { category: 'Technical Certification', count: 1245, percentage: 36, avgCredits: 15 },
      { category: 'Project Completion', count: 892, percentage: 26, avgCredits: 20 },
      { category: 'Research Publication', count: 567, percentage: 16, avgCredits: 25 },
      { category: 'Competition Winner', count: 445, percentage: 13, avgCredits: 18 },
      { category: 'Leadership Role', count: 307, percentage: 9, avgCredits: 12 },
    ]
  }
};

export default function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const data = mockReportsData;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const utilizationColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Handle PDF export
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      toast.info("Preparing PDF report...");
      
      // Small delay to allow toast to show
      await new Promise(resolve => setTimeout(resolve, 500));
      
      exportToPDF(data, `Institution Report - ${timeRange}`);
      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle Excel/CSV export based on current tab
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      toast.info("Preparing Excel data...");
      
      // Export different data based on selected tab
      switch (selectedTab) {
        case 'departments':
          exportDepartmentCSV(data.departmentPerformance);
          break;
        case 'financial':
          exportFinancialCSV(data.financialSummary);
          break;
        case 'achievements':
          exportAchievementsCSV(data.achievementAnalysis);
          break;
        default:
          // Export complete data as JSON for other tabs
          exportCompleteJSON(data, `institution_report_${selectedTab}`);
          break;
      }
      
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle report sharing
  const handleShareReport = async () => {
    try {
      setIsSharing(true);
      
      const title = `Institution Report - ${timeRange}`;
      const summary = `
        Institution Report Summary:
        • ${data.overview.totalStudents} students
        • ${data.overview.totalFaculty} faculty members
        • ${data.overview.placementRate}% placement rate
        • ${data.overview.averageCGPA} average CGPA
      `.trim();
      
      const shared = await shareReport(title, summary);
      
      if (shared) {
        toast.success("Report shared successfully!");
      } else {
        // Fallback to email sharing
        shareReportViaEmail(data, title);
        toast.info("Preparing email with report data");
      }
    } catch (error) {
      console.error("Sharing error:", error);
      toast.error("Failed to share report");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Institution Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and performance reports for the institution
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
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="cse">Computer Science</SelectItem>
                <SelectItem value="ece">Electronics</SelectItem>
                <SelectItem value="me">Mechanical</SelectItem>
                <SelectItem value="ce">Civil</SelectItem>
                <SelectItem value="it">Information Technology</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Icons.download className="h-4 w-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShareReport}
              disabled={isSharing}
            >
              {isSharing ? (
                <>
                  <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Icons.share className="h-4 w-4 mr-2" />
                  Share Report
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{data.overview.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Active enrollment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Faculty Strength</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{data.overview.totalFaculty}</div>
                  <p className="text-xs text-muted-foreground">Teaching staff</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Placement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">{data.overview.placementRate}%</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Average CGPA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{data.overview.averageCGPA}</div>
                  <p className="text-xs text-muted-foreground">Institution wide</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Research Papers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{data.overview.researchPublications}</div>
                  <p className="text-xs text-muted-foreground">Published</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Key metrics over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.monthlyTrends.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="font-medium w-20">{month.month}</div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{month.students}</div>
                          <div className="text-muted-foreground">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{month.achievements}</div>
                          <div className="text-muted-foreground">Achievements</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{month.events}</div>
                          <div className="text-muted-foreground">Events</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-orange-600">{month.publications}</div>
                          <div className="text-muted-foreground">Publications</div>
                        </div>
                      </div>
                      <Progress 
                        value={(month.students / 1300) * 100} 
                        className="w-24 h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Students</CardTitle>
                  <CardDescription>Highest achievers across all departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topPerformers.students.map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {student.department} • {student.year}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">CGPA: {student.cgpa}</div>
                          <div className="text-sm text-muted-foreground">{student.achievements} achievements</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Faculty Contributors</CardTitle>
                  <CardDescription>Faculty with highest research output and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.topPerformers.faculty.map((faculty, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{faculty.name}</div>
                            <div className="text-sm text-muted-foreground">{faculty.department}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-purple-600">Rating: {faculty.rating}/5</div>
                          <div className="text-sm text-muted-foreground">
                            {faculty.publications} publications • {faculty.mentees} mentees
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance Comparison</CardTitle>
                <CardDescription>Comprehensive comparison across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.departmentPerformance.map((dept, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold">{dept.name}</h4>
                        <div className="flex gap-4 text-sm">
                          <span><strong>{dept.students}</strong> students</span>
                          <span><strong>{dept.faculty}</strong> faculty</span>
                          <span>Avg CGPA: <strong>{dept.avgCGPA}</strong></span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Placement Rate</span>
                            <span className="font-medium">{dept.placement}%</span>
                          </div>
                          <Progress value={dept.placement} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Research Output</span>
                            <span className="font-medium">{dept.research}%</span>
                          </div>
                          <Progress value={dept.research} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Student Satisfaction</span>
                            <span className="font-medium">{dept.satisfaction}%</span>
                          </div>
                          <Progress value={dept.satisfaction} className="h-2" />
                        </div>
                        <div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{dept.achievements}</div>
                            <div className="text-sm text-muted-foreground">Total Achievements</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Budget Utilization</span>
                        <span>{((data.financialSummary.utilized / data.financialSummary.totalBudget) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(data.financialSummary.utilized / data.financialSummary.totalBudget) * 100} />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Budget:</span>
                        <span className="font-medium">{formatCurrency(data.financialSummary.totalBudget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilized:</span>
                        <span className="font-medium text-green-600">{formatCurrency(data.financialSummary.utilized)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining:</span>
                        <span className="font-medium text-blue-600">{formatCurrency(data.financialSummary.remaining)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Department-wise Budget Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.financialSummary.departmentAllocation.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{dept.department}</span>
                            <span className={`font-medium ${utilizationColor(dept.utilization)}`}>
                              {dept.utilization}% utilized
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground mb-2">
                            <span>Allocated: {formatCurrency(dept.allocated)}</span>
                            <span>Used: {formatCurrency(dept.utilized)}</span>
                          </div>
                          <Progress value={dept.utilization} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Graduation Rate</span>
                      <span className="font-medium">{data.overview.graduationRate}%</span>
                    </div>
                    <Progress value={data.overview.graduationRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average CGPA</span>
                      <span className="font-medium">{data.overview.averageCGPA}/10</span>
                    </div>
                    <Progress value={data.overview.averageCGPA * 10} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Placement Success Rate</span>
                      <span className="font-medium">{data.overview.placementRate}%</span>
                    </div>
                    <Progress value={data.overview.placementRate} />
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Research Publications:</span>
                      <span className="font-medium">{data.overview.researchPublications}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Industry Partnerships:</span>
                      <span className="font-medium">{data.overview.industryPartnerships}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Achievements:</span>
                      <span className="font-medium">{data.overview.totalAchievements}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Rankings</CardTitle>
                  <CardDescription>Based on overall performance score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.departmentPerformance
                      .sort((a, b) => (b.placement + b.research + b.satisfaction) - (a.placement + a.research + a.satisfaction))
                      .map((dept, index) => {
                        const overallScore = Math.round((dept.placement + dept.research + dept.satisfaction) / 3);
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">{dept.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {dept.students} students • {dept.faculty} faculty
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-primary">{overallScore}/100</div>
                              <div className="text-xs text-muted-foreground">Overall Score</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{data.eventSummary.totalEvents}</div>
                      <div className="text-sm text-muted-foreground">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{data.eventSummary.completedEvents}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average Attendance</span>
                      <span className="font-medium">{data.eventSummary.averageAttendance}%</span>
                    </div>
                    <Progress value={data.eventSummary.averageAttendance} />
                  </div>
                  
                  <div className="pt-4 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Upcoming Events:</span>
                      <span className="font-medium">{data.eventSummary.upcomingEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Participants:</span>
                      <span className="font-medium">{data.eventSummary.totalParticipants.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Types Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.eventSummary.eventTypes.map((type, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{type.type}</span>
                          <span>{type.count} events</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Attendance Rate</span>
                          <span>{type.attendance}%</span>
                        </div>
                        <Progress value={type.attendance} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievement Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{data.achievementAnalysis.approvedAchievements}</div>
                      <div className="text-sm text-muted-foreground">Approved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{data.achievementAnalysis.pendingAchievements}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{data.achievementAnalysis.rejectedAchievements}</div>
                      <div className="text-sm text-muted-foreground">Rejected</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Approval Rate</span>
                      <span className="font-medium">
                        {((data.achievementAnalysis.approvedAchievements / data.achievementAnalysis.totalAchievements) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(data.achievementAnalysis.approvedAchievements / data.achievementAnalysis.totalAchievements) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievement Categories</CardTitle>
                  <CardDescription>Distribution by achievement type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.achievementAnalysis.categoryBreakdown.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.category}</span>
                          <span>{category.count} ({category.percentage}%)</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Avg Credits: {category.avgCredits}</span>
                          <span>{category.percentage}% of total</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Sharing Options</CardTitle>
            <CardDescription>Generate and share comprehensive reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <Icons.download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleExportExcel}
                disabled={isExporting}
              >
                <Icons.fileText className="h-4 w-4 mr-2" />
                Export {selectedTab === 'departments' || selectedTab === 'financial' || selectedTab === 'achievements' ? 'CSV' : 'JSON'} Data
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleShareReport}
                disabled={isSharing}
              >
                <Icons.share className="h-4 w-4 mr-2" />
                Share with Stakeholders
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  toast.info("This feature will be available soon!");
                }}
              >
                <Icons.calendar className="h-4 w-4 mr-2" />
                Schedule Auto Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
