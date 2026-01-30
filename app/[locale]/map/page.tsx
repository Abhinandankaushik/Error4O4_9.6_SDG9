'use client';

import HeatMapView from '@/components/HeatMapView';
import AreaStatistics from '@/components/AreaStatistics';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Radar } from 'lucide-react';

interface AreaStat {
  area: string;
  totalReports: number;
  resolvedReports: number;
  resolutionRate: number;
}

export default function MapPage() {
  const router = useRouter();
  const [areaStats, setAreaStats] = useState<AreaStat[]>([]);

  useEffect(() => {
    fetchAreaStats();
  }, []);

  const fetchAreaStats = async () => {
    try {
      const response = await fetch('/api/analytics/resolution-rate');
      const data = await response.json();
      
      if (data.success && data.data.byArea) {
        setAreaStats(data.data.byArea);
      }
    } catch (error) {
      console.error('Error fetching area stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Infrastructure Issue Map</h1>
            <p className="text-muted-foreground mt-1">
              View heat map of reported issues with resolution rates
            </p>
          </div>
          
          {/* Find Nearby Issues Button */}
          <Button
            onClick={() => router.push('/en/nearby-issues')}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
          >
            <Radar className="w-5 h-5 mr-2" />
            Find Nearby Issues
          </Button>
        </div>

        {/* Heat Map */}
        <HeatMapView />

        {/* Area Statistics */}
        <AreaStatistics data={areaStats} />
      </div>
    </div>
  );
}
