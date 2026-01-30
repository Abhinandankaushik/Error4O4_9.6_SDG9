'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, FileText, CheckCircle, Clock, BarChart3,
  Eye, Construction, Lightbulb, Droplet, Droplets, 
  Trash2, Milestone, Trees, Bus, Wrench, Calendar, 
  ThumbsUp, X, Mail, Building
} from 'lucide-react';

interface AreaStat {
  area: string;
  totalReports: number;
  resolvedReports: number;
  resolutionRate: number;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  address: string;
  area: string;
  createdAt: string;
  upvotes: number;
}

interface AreaStatisticsProps {
  data: AreaStat[];
  title?: string;
}

export default function AreaStatistics({ data, title = 'Statistics by Area' }: AreaStatisticsProps) {
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [areaReports, setAreaReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const fetchAreaReports = async (area: string) => {
    setLoadingReports(true);
    try {
      const response = await fetch(`/api/reports?area=${encodeURIComponent(area)}`);
      const result = await response.json();
      
      if (result.success) {
        setAreaReports(result.data);
        setSelectedArea(area);
      }
    } catch (error) {
      console.error('Error fetching area reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const closeModal = () => {
    setSelectedArea(null);
    setAreaReports([]);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      under_review: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      in_progress: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[priority] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      potholes: Construction,
      'street lights': Lightbulb,
      'water supply': Droplet,
      drainage: Droplets,
      'garbage collection': Trash2,
      'roads & pavements': Milestone,
      'parks & gardens': Trees,
      'public transport': Bus,
      roads: Milestone,
      water: Droplet,
      electricity: Lightbulb,
      streetlight: Lightbulb,
      waste: Trash2,
    };
    const Icon = icons[category.toLowerCase()] || Wrench;
    return <Icon className="w-5 h-5" />;
  };
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((stat, index) => (
              <div
                key={index}
                onClick={() => fetchAreaReports(stat.area)}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-accent transition-all cursor-pointer border-2 border-transparent hover:border-blue-500/30 hover:shadow-lg group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-lg group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{stat.area}</span>
                    </h4>
                    <Badge variant={getResolutionRateBadge(stat.resolutionRate)}>
                      {stat.resolutionRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Total: <span className="font-medium text-foreground">{stat.totalReports}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Resolved:{' '}
                      <span className="font-medium text-foreground">{stat.resolvedReports}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Pending:{' '}
                      <span className="font-medium text-foreground">
                        {stat.totalReports - stat.resolvedReports}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 group-hover:text-blue-400 transition-colors">
                    Click to view all reports in this area
                  </p>
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

      {/* Modal for Area Reports */}
      {selectedArea && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 border-2 border-blue-500/30 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-blue-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b-2 border-blue-500/30 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedArea}</span>
                </h2>
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>All Reports in this Area</span>
                </p>
              </div>
              <Button
                onClick={closeModal}
                variant="outline"
                className="border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400"
              >
                <X className="w-5 h-5 mr-2" />
                Close
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {loadingReports ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="text-gray-400 mt-4">Loading reports...</p>
                </div>
              ) : areaReports.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400 flex items-center justify-center gap-2">
                    <Mail className="w-8 h-8" />
                    No reports found in this area
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {areaReports.map((report) => (
                    <div
                      key={report._id}
                      onClick={() => router.push(`/en/reports/${report._id}`)}
                      className="bg-gray-800/50 border-2 border-gray-700/50 hover:border-blue-500/50 rounded-xl p-6 cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-500/10 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {getCategoryIcon(report.category)}
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                              {report.title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-400 mb-4 line-clamp-2">
                            {report.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={`${getStatusColor(report.status)} px-3 py-1 text-xs font-semibold border`}>
                              {report.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={`${getPriorityColor(report.priority)} px-3 py-1 text-xs font-semibold border`}>
                              {report.priority.toUpperCase()}
                            </Badge>
                            <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 text-xs font-semibold">
                              {report.category}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {report.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {report.upvotes} upvotes
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          >
                            <Eye className="w-5 h-5 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
