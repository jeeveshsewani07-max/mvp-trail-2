'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

// Mock student data
const studentData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+91 9876543210',
    location: 'Bangalore, Karnataka',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
    portfolioUrl: 'https://johndoe.dev',
  },
  education: {
    institution: 'Indian Institute of Technology, Delhi',
    degree: 'B.Tech Computer Science',
    year: '2021-2025',
    cgpa: 3.8,
    coursework: ['Data Structures', 'Algorithms', 'Database Systems', 'Web Development'],
  },
  achievements: [
    {
      title: 'React.js Full Stack Certification',
      category: 'Technical Certification',
      date: '2024-01-15',
      credits: 15,
      description: 'Completed comprehensive React.js course with project portfolio',
    },
    {
      title: 'National Hackathon Winner',
      category: 'Competition',
      date: '2024-01-10',
      credits: 22,
      description: 'First place in national level hackathon with 200+ participants',
    },
    {
      title: 'Google Cloud Professional Architect',
      category: 'Professional Certification',
      date: '2024-01-05',
      credits: 25,
      description: 'Achieved Google Cloud Professional Cloud Architect certification',
    },
  ],
  projects: [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application built with React and Node.js',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      githubUrl: 'https://github.com/johndoe/ecommerce',
      liveUrl: 'https://ecommerce-demo.johndoe.dev',
    },
    {
      title: 'Task Management App',
      description: 'Mobile-first task management application with real-time sync',
      technologies: ['React Native', 'Firebase', 'Redux'],
      githubUrl: 'https://github.com/johndoe/taskmanager',
      liveUrl: 'https://tasks.johndoe.dev',
    },
  ],
  skills: {
    programming: ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++'],
    frameworks: ['React', 'Node.js', 'Express', 'React Native', 'Django'],
    databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase'],
    tools: ['Git', 'Docker', 'AWS', 'VS Code', 'Figma'],
  },
  experience: [
    {
      title: 'Software Development Intern',
      company: 'TechStart India',
      duration: 'Jun 2023 - Aug 2023',
      location: 'Bangalore',
      description: 'Developed frontend components and implemented REST API integrations',
    },
  ],
};

const exportFormats = [
  { id: 'pdf-modern', name: 'PDF - Modern', description: 'Clean, professional PDF resume' },
  { id: 'pdf-classic', name: 'PDF - Classic', description: 'Traditional ATS-friendly format' },
  { id: 'pdf-creative', name: 'PDF - Creative', description: 'Designer-focused with visual elements' },
  { id: 'json', name: 'JSON Data', description: 'Raw data in JSON format' },
  { id: 'linkedin', name: 'LinkedIn Import', description: 'Format optimized for LinkedIn' },
];

const templates = [
  { id: 'minimal', name: 'Minimal', preview: '/templates/minimal.png' },
  { id: 'professional', name: 'Professional', preview: '/templates/professional.png' },
  { id: 'creative', name: 'Creative', preview: '/templates/creative.png' },
  { id: 'academic', name: 'Academic', preview: '/templates/academic.png' },
];

export default function PortfolioExportPage() {
  const [selectedFormat, setSelectedFormat] = useState('pdf-modern');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [selectedSections, setSelectedSections] = useState({
    personalInfo: true,
    education: true,
    achievements: true,
    projects: true,
    skills: true,
    experience: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [customizations, setCustomizations] = useState({
    includeQRCode: false,
    includeVerificationLinks: true,
    colorScheme: 'blue',
    fontSize: 'medium',
  });

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call for export generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate file download
      const filename = `${studentData.personalInfo.name.replace(' ', '_')}_Resume.${selectedFormat.includes('pdf') ? 'pdf' : 'json'}`;
      toast.success(`${filename} downloaded successfully!`);
      
    } catch (error) {
      toast.error('Failed to generate export');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSelectedSectionCount = () => {
    return Object.values(selectedSections).filter(Boolean).length;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Export Portfolio</h1>
            <p className="text-muted-foreground">
              Generate and download your professional resume and portfolio
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="/portfolio">
              <Icons.arrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Export Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="format">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="format">Format</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="customize">Customize</TabsTrigger>
              </TabsList>

              <TabsContent value="format" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Export Format</CardTitle>
                    <CardDescription>Choose how you want to export your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {exportFormats.map((format) => (
                        <div key={format.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={format.id}
                            checked={selectedFormat === format.id}
                            onCheckedChange={() => setSelectedFormat(format.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={format.id} className="text-sm font-medium">
                              {format.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{format.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="template" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Template Selection</CardTitle>
                    <CardDescription>Choose a design template for your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div 
                          key={template.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedTemplate === template.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="aspect-[3/4] bg-muted rounded mb-3 flex items-center justify-center">
                            <Icons.fileText className="h-12 w-12 text-muted-foreground" />
                          </div>
                          <h3 className="font-medium text-center">{template.name}</h3>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sections" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Sections</CardTitle>
                    <CardDescription>
                      Select which sections to include in your export ({getSelectedSectionCount()}/6 selected)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(selectedSections).map(([section, isSelected]) => (
                        <div key={section} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id={section}
                              checked={isSelected}
                              onCheckedChange={() => handleSectionToggle(section)}
                            />
                            <Label htmlFor={section} className="text-sm font-medium capitalize">
                              {section.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {section === 'achievements' && `${studentData.achievements.length} items`}
                            {section === 'projects' && `${studentData.projects.length} items`}
                            {section === 'skills' && `${Object.values(studentData.skills).flat().length} skills`}
                            {section === 'experience' && `${studentData.experience.length} items`}
                            {!['achievements', 'projects', 'skills', 'experience'].includes(section) && 'Required'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customize" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customization Options</CardTitle>
                    <CardDescription>Personalize your export settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Color Scheme</Label>
                        <Select value={customizations.colorScheme} onValueChange={(value) => 
                          setCustomizations(prev => ({...prev, colorScheme: value}))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="gray">Grayscale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Select value={customizations.fontSize} onValueChange={(value) => 
                          setCustomizations(prev => ({...prev, fontSize: value}))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="qrCode"
                          checked={customizations.includeQRCode}
                          onCheckedChange={(checked) => 
                            setCustomizations(prev => ({...prev, includeQRCode: !!checked}))
                          }
                        />
                        <Label htmlFor="qrCode" className="text-sm">
                          Include QR code for digital verification
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="verificationLinks"
                          checked={customizations.includeVerificationLinks}
                          onCheckedChange={(checked) => 
                            setCustomizations(prev => ({...prev, includeVerificationLinks: !!checked}))
                          }
                        />
                        <Label htmlFor="verificationLinks" className="text-sm">
                          Include verification links for achievements
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview & Export */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview of your resume export</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Icons.fileText className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Resume Preview</p>
                    <p className="text-xs text-muted-foreground">{selectedTemplate} Template</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  <Icons.eye className="h-4 w-4 mr-2" />
                  Full Preview (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{exportFormats.find(f => f.id === selectedFormat)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Template:</span>
                    <span className="font-medium">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sections:</span>
                    <span className="font-medium">{getSelectedSectionCount()}/6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>QR Code:</span>
                    <span className="font-medium">{customizations.includeQRCode ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleExport}
                  disabled={isGenerating || getSelectedSectionCount() === 0}
                >
                  {isGenerating ? (
                    <>
                      <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Icons.download className="h-4 w-4 mr-2" />
                      Export Resume
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="text-xs text-center text-muted-foreground">
                    This may take a few moments...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Icons.share className="h-4 w-4 mr-2" />
                  Share Portfolio Link
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icons.mail className="h-4 w-4 mr-2" />
                  Email to Recruiter
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icons.linkedin className="h-4 w-4 mr-2" />
                  Update LinkedIn
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
