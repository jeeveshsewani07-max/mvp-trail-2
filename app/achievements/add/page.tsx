'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AddAchievementForm } from '@/components/achievements/add-achievement-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AddAchievementPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/achievements">
              <Icons.arrowLeft className="h-4 w-4 mr-2" />
              Back to Achievements
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Achievement</h1>
            <p className="text-muted-foreground">
              Add a new achievement to your portfolio for faculty approval
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Main Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.award className="h-5 w-5" />
                  Achievement Details
                </CardTitle>
                <CardDescription>
                  Fill out the form below to add your achievement. Make sure to provide accurate information and supporting documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddAchievementForm />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icons.helpCircle className="h-5 w-5" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">📋 Required Information</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Clear, descriptive title</li>
                    <li>• Detailed description</li>
                    <li>• Accurate achievement date</li>
                    <li>• Relevant skill tags</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">📄 Supporting Documents</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Upload official certificate (PDF)</li>
                    <li>• Add evidence images/screenshots</li>
                    <li>• Max file size: 10MB each</li>
                    <li>• Supported formats: PDF, JPG, PNG</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">✅ Approval Process</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Faculty review within 3-5 days</li>
                    <li>• Email notification on decision</li>
                    <li>• Credits awarded upon approval</li>
                    <li>• Can resubmit if rejected</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-900 dark:text-blue-100">
                  <Icons.lightbulb className="h-5 w-5" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Be Specific:</strong> Include details like duration, tools used, and outcomes achieved.
                  </p>
                  
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Tag Skills:</strong> Add relevant skills to help with job matching and recommendations.
                  </p>
                  
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Quality Documents:</strong> Clear, high-resolution certificates get approved faster.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icons.messageCircle className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Having trouble with your submission? Our support team is here to help.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Icons.mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

