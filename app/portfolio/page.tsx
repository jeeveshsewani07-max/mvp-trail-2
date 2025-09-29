'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { formatDate } from '@/lib/utils';

// Mock portfolio data
const mockPortfolioData = {
  profileCompletion: 85,
  totalViews: 1247,
  thisMonthViews: 89,
  achievements: [
    {
      id: '1',
      title: 'Web Development Certificate',
      category: 'Technical',
      dateAchieved: '2024-01-15',
      status: 'approved',
      credits: 10,
      verificationHash: 'abc123...',
    },
    {
      id: '2',
      title: 'Hackathon Winner - TechFest 2024',
      category: 'Competition',
      dateAchieved: '2024-01-10',
      status: 'approved',
      credits: 15,
    },
    {
      id: '3',
      title: 'Research Paper Publication',
      category: 'Research',
      dateAchieved: '2023-12-01',
      status: 'approved',
      credits: 20,
    },
  ],
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'JWT'],
      githubUrl: 'https://github.com/johndoe/ecommerce-platform',
      liveUrl: 'https://ecommerce-demo.vercel.app',
      imageUrl: '/projects/ecommerce-preview.png',
      featured: true,
      completedAt: '2024-01-20',
    },
    {
      id: '2',
      title: 'AI Chat Application',
      description: 'Real-time chat application with AI bot integration. Includes features like message encryption, file sharing, and smart reply suggestions powered by OpenAI.',
      technologies: ['Next.js', 'Socket.io', 'OpenAI API', 'Prisma', 'PostgreSQL'],
      githubUrl: 'https://github.com/johndoe/ai-chat-app',
      liveUrl: 'https://ai-chat-demo.netlify.app',
      imageUrl: '/projects/chat-app-preview.png',
      featured: true,
      completedAt: '2023-12-15',
    },
    {
      id: '3',
      title: 'Task Management Dashboard',
      description: 'Kanban-style task management application with team collaboration features. Built with Vue.js and Firebase for real-time updates.',
      technologies: ['Vue.js', 'Firebase', 'Vuetify', 'Chart.js'],
      githubUrl: 'https://github.com/johndoe/task-manager',
      liveUrl: 'https://task-manager-vue.web.app',
      imageUrl: '/projects/task-manager-preview.png',
      featured: false,
      completedAt: '2023-11-10',
    },
  ],
  skills: {
    technical: [
      { name: 'JavaScript', level: 90 },
      { name: 'React', level: 85 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'TypeScript', level: 85 },
      { name: 'MongoDB', level: 70 },
      { name: 'PostgreSQL', level: 65 },
      { name: 'Git', level: 80 },
    ],
    soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management'],
  },
  education: {
    institution: 'University of Technology',
    degree: 'Bachelor of Science in Computer Science',
    year: '2022 - 2026',
    gpa: '3.85',
    relevantCoursework: ['Data Structures', 'Algorithms', 'Database Systems', 'Web Development', 'Machine Learning'],
  },
  experience: [
    {
      title: 'Software Engineering Intern',
      company: 'TechCorp Inc.',
      duration: 'Jun 2024 - Present',
      description: 'Developing web applications using React and Node.js. Collaborating with senior developers on feature implementation and code reviews.',
      technologies: ['React', 'Node.js', 'TypeScript', 'AWS'],
    },
    {
      title: 'Frontend Developer Intern',
      company: 'StartupXYZ',
      duration: 'Jun 2023 - Aug 2023',
      description: 'Built responsive web interfaces and improved application performance by 30%. Worked closely with design team to implement pixel-perfect UI components.',
      technologies: ['React', 'SCSS', 'JavaScript', 'Figma'],
    },
  ],
  contact: {
    email: 'john.doe@university.edu',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    website: 'https://johndoe.dev',
  },
};

export default function PortfolioPage() {
  const { dbUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPublic, setIsPublic] = useState(true);

  const getSkillColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Portfolio</h1>
            <p className="text-muted-foreground">
              Showcase your achievements, projects, and skills to the world
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Icons.eye className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Icons.share className="h-4 w-4" />
              Share Portfolio
            </Button>
            <Button className="flex items-center gap-2">
              <Icons.download className="h-4 w-4" />
              Export as PDF
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icons.user className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockPortfolioData.profileCompletion}%</div>
                  <div className="text-sm text-muted-foreground">Profile Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Icons.eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockPortfolioData.totalViews.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icons.trendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">+{mockPortfolioData.thisMonthViews}</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <Icons.award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{mockPortfolioData.achievements.length}</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Summary */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {dbUser?.fullName?.split(' ').map(n => n[0]).join('') || 'JD'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{dbUser?.fullName || 'John Doe'}</h3>
                        <p className="text-muted-foreground mb-2">{mockPortfolioData.education.degree}</p>
                        <p className="text-sm leading-relaxed">
                          Computer Science student passionate about AI and web development. Always eager to learn new technologies and work on innovative projects. Currently seeking internship opportunities in software development.
                        </p>
                        <div className="flex gap-4 mt-4">
                          <a href={mockPortfolioData.contact.linkedin} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                            <Icons.linkedin className="h-4 w-4" />
                            LinkedIn
                          </a>
                          <a href={mockPortfolioData.contact.github} className="flex items-center gap-2 text-sm text-gray-600 hover:underline">
                            <Icons.github className="h-4 w-4" />
                            GitHub
                          </a>
                          <a href={mockPortfolioData.contact.website} className="flex items-center gap-2 text-sm text-green-600 hover:underline">
                            <Icons.globe className="h-4 w-4" />
                            Website
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Projects</CardTitle>
                    <CardDescription>My best work and recent projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {mockPortfolioData.projects.filter(p => p.featured).map((project) => (
                        <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{project.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Icons.github className="h-4 w-4 mr-1" />
                                Code
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <Icons.externalLink className="h-4 w-4 mr-1" />
                                Live Demo
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Projects</span>
                      <span className="font-semibold">{mockPortfolioData.projects.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Achievements</span>
                      <span className="font-semibold">{mockPortfolioData.achievements.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Credits</span>
                      <span className="font-semibold">
                        {mockPortfolioData.achievements.reduce((sum, a) => sum + a.credits, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GPA</span>
                      <span className="font-semibold">{mockPortfolioData.education.gpa}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockPortfolioData.skills.technical.slice(0, 5).map((skill) => (
                        <div key={skill.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{skill.name}</span>
                            <span>{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockPortfolioData.achievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icons.award className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{achievement.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(achievement.dateAchieved)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Projects</h2>
              <Button>
                <Icons.plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPortfolioData.projects.map((project) => (
                <Card key={project.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {project.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Icons.github className="h-4 w-4 mr-1" />
                          Code
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Icons.externalLink className="h-4 w-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Completed {formatDate(project.completedAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Achievements</h2>
              <Button>
                <Icons.plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            </div>

            <div className="grid gap-4">
              {mockPortfolioData.achievements.map((achievement) => (
                <Card key={achievement.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icons.award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.category} • {formatDate(achievement.dateAchieved)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(achievement.status)}>
                          {achievement.status}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium">{achievement.credits} credits</div>
                          {achievement.verificationHash && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Icons.shield className="h-3 w-3" />
                              Verified
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                  <CardDescription>Programming languages, frameworks, and technologies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPortfolioData.skills.technical.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Soft Skills</CardTitle>
                  <CardDescription>Leadership, communication, and interpersonal skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockPortfolioData.skills.soft.map((skill) => (
                      <Badge key={skill} variant="outline" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Work Experience</h2>
              <Button>
                <Icons.plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>

            <div className="space-y-6">
              {mockPortfolioData.experience.map((exp, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Icons.edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Icons.trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-4 leading-relaxed">{exp.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Settings</CardTitle>
                <CardDescription>Manage your portfolio visibility and sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Portfolio</p>
                    <p className="text-sm text-muted-foreground">Make your portfolio visible to everyone</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Portfolio URL</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="smartstudenthub.com/portfolio/johndoe"
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-md bg-muted"
                    />
                    <Button variant="outline">
                      <Icons.copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button>
                    <Icons.check className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button variant="outline">
                    <Icons.refresh className="h-4 w-4 mr-2" />
                    Reset
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
