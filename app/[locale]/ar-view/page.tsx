'use client';

import { useState } from 'react';
import ARCameraView from '@/components/ARCameraView';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ARViewPage() {
  const [arActive, setArActive] = useState(false);

  if (arActive) {
    return <ARCameraView onClose={() => setArActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">📱 AR View</CardTitle>
          <CardDescription>
            View infrastructure issues in augmented reality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <h4 className="font-semibold">Location-Based</h4>
                <p className="text-sm text-muted-foreground">
                  See all reported issues near your current location
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold">Historical Data</h4>
                <p className="text-sm text-muted-foreground">
                  View complete history, status, and resolution details
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📷</span>
              <div>
                <h4 className="font-semibold">Before/After Photos</h4>
                <p className="text-sm text-muted-foreground">
                  Compare issue reports with resolution images
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Camera access permission</li>
              <li>Location services enabled</li>
              <li>Stable internet connection</li>
            </ul>
          </div>

          <Button
            onClick={() => setArActive(true)}
            size="lg"
            className="w-full"
          >
            Launch AR View
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Point your camera at any location to see reported issues
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
