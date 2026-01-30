'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AreaStat {
  area: string;
  totalReports: number;
  resolvedReports: number;
  resolutionRate: number;
}

interface AreaStatisticsProps {
  data: AreaStat[];
  title?: string;
}

export default function AreaStatistics({ data, title = 'Statistics by Area' }: AreaStatisticsProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No area statistics available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getResolutionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getResolutionRateBadge = (rate: number): 'success' | 'warning' | 'destructive' => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold">{stat.area}</h4>
                  <Badge variant={getResolutionRateBadge(stat.resolutionRate)}>
                    {stat.resolutionRate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>
                    Total: <span className="font-medium text-foreground">{stat.totalReports}</span>
                  </span>
                  <span>
                    Resolved:{' '}
                    <span className="font-medium text-foreground">{stat.resolvedReports}</span>
                  </span>
                  <span>
                    Pending:{' '}
                    <span className="font-medium text-foreground">
                      {stat.totalReports - stat.resolvedReports}
                    </span>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-32 ml-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      stat.resolutionRate >= 80
                        ? 'bg-success'
                        : stat.resolutionRate >= 60
                        ? 'bg-warning'
                        : 'bg-destructive'
                    }`}
                    style={{ width: `${stat.resolutionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">
              {data.reduce((sum, stat) => sum + stat.totalReports, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {data.reduce((sum, stat) => sum + stat.resolvedReports, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {(
                (data.reduce((sum, stat) => sum + stat.resolvedReports, 0) /
                  data.reduce((sum, stat) => sum + stat.totalReports, 0)) *
                100
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-muted-foreground">Avg Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
