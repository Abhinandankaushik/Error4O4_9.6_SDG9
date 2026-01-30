'use client';

import HeatMapView from '@/components/HeatMapView';
import AreaStatistics from '@/components/AreaStatistics';
import { useEffect, useState } from 'react';

interface AreaStat {
  area: string;
  totalReports: number;
  resolvedReports: number;
  resolutionRate: number;
}

export default function MapPage() {
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
        <div>
          <h1 className="text-3xl font-bold">Infrastructure Issue Map</h1>
          <p className="text-muted-foreground mt-1">
            View heat map of reported issues with resolution rates
          </p>
        </div>

        {/* Heat Map */}
        <HeatMapView />

        {/* Area Statistics */}
        <AreaStatistics data={areaStats} />
      </div>
    </div>
  );
}
