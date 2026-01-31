'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import {
  FileText,
  MapPin,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ThumbsUp,
  Building2,
  BarChart3,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Report {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  address: string;
  area?: string;
  images: string[];
  createdAt: string;
  viewCount: number;
  upvotes: number;
  reportedBy?: { name: string; email: string };
  assignedTo?: { name: string; email: string };
}

interface CityStats {
  city: string;
  area: string;
  totalCityIssues: number;
  statusBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  areaStats?: {
    totalAreaIssues: number;
    statusBreakdown: Record<string, number>;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-500', icon: FileText },
  under_review: { label: 'Under Review', color: 'bg-yellow-500', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-orange-500', icon: TrendingUp },
  resolved: { label: 'Resolved', color: 'bg-green-500', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-500', icon: XCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500', icon: AlertCircle },
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export default function MyReportsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [myReports, setMyReports] = useState<Report[]>([]);
  const [cityStats, setCityStats] = useState<CityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'submitted' | 'under_review' | 'in_progress' | 'resolved'>('all');
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's reports
      const reportsRes = await fetch(`/api/reports/my-reports?status=${activeTab}`);
      const reportsData = await reportsRes.json();
      
      if (reportsData.success) {
        setMyReports(reportsData.reports);
        setCounts(reportsData.counts);
      }
      
      // Fetch city statistics
      const cityRes = await fetch('/api/reports/city-stats');
      const cityData = await cityRes.json();
      
      if (cityData.success) {
        setCityStats(cityData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Reports & City Statistics
          </h1>
          <p className="text-muted-foreground">
            Track your reported issues and see statistics for your area
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - My Reports */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {['all', 'submitted', 'under_review', 'in_progress', 'resolved'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground'
                        }`}
                      >
                        {tab === 'all' ? 'All' : statusConfig[tab]?.label || tab}
                        {counts[tab] > 0 && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                            {counts[tab]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reports List */}
              {myReports.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No reports found</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        You haven't created any reports yet. Start reporting issues in your area.
                      </p>
                      <Link href={`/${locale}/reports/new`}>
                        <Button className="px-6 py-2">Create Your First Report</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myReports.map((report, index) => {
                    const StatusIcon = statusConfig[report.status]?.icon || FileText;
                    
                    return (
                      <motion.div
                        key={report._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-all cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                              {/* Image */}
                              {report.images && report.images.length > 0 && (
                                <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                                  <img
                                    src={report.images[0]}
                                    alt={report.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                                  <h3 className="text-lg font-semibold line-clamp-2 flex-1">
                                    {report.title}
                                  </h3>
                                  <div className="flex gap-2 flex-shrink-0">
                                    <Badge className={`${priorityColors[report.priority]} text-white text-xs px-2 py-1 flex items-center justify-center uppercase`}>
                                      {report.priority}
                                    </Badge>
                                    <Badge className={`${statusConfig[report.status]?.color} text-white px-2 py-1 flex items-center justify-center gap-1`}>
                                      <StatusIcon className="w-3 h-3" />
                                      <span className="text-xs">{statusConfig[report.status]?.label}</span>
                                    </Badge>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                  {report.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                    <span className="line-clamp-1">{report.address}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span>{formatDate(report.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 flex-shrink-0" />
                                    <span>{report.viewCount} views</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <ThumbsUp className="w-4 h-4 flex-shrink-0" />
                                    <span>{report.upvotes} upvotes</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center flex-wrap gap-2">
                                  <Badge variant="secondary" className="text-xs px-3 py-1">
                                    📁 {report.category}
                                  </Badge>
                                  {report.area && (
                                    <Badge variant="secondary" className="text-xs px-3 py-1">
                                      📍 {report.area}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t flex justify-end">
                              <Link href={`/${locale}/reports/${report._id}`}>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar - City Stats */}
            <div className="space-y-6">
              {/* City Overview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-3 bg-blue-500 rounded-lg flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-muted-foreground mb-1">Your City</h3>
                        <p className="text-2xl font-bold text-blue-600 truncate">
                          {cityStats?.city || 'Not Available'}
                        </p>
                      </div>
                    </div>
                    
                    {cityStats?.area && (
                      <div className="mt-4 p-3 bg-card/50 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Area/Ward</p>
                        <p className="font-semibold text-base truncate">{cityStats.area}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* City Issues Count */}
              {cityStats && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <h3 className="font-semibold text-base">City Statistics</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Total Issues in City</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {cityStats.totalCityIssues}
                          </p>
                        </div>
                        
                        {cityStats.areaStats && (
                          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Issues in Your Area</p>
                            <p className="text-3xl font-bold text-blue-600">
                              {cityStats.areaStats.totalAreaIssues}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Status Breakdown */}
              {cityStats && cityStats.statusBreakdown && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-base mb-4">Status Breakdown</h3>
                      <div className="space-y-4">
                        {Object.entries(cityStats.statusBreakdown).map(([status, count]) => {
                          const config = statusConfig[status];
                          if (!config) return null;
                          
                          const StatusIcon = config.icon;
                          const percentage = (count / cityStats.totalCityIssues) * 100;
                          
                          return (
                            <div key={status} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className="w-4 h-4 flex-shrink-0" />
                                  <span className="font-medium">{config.label}</span>
                                </div>
                                <span className="font-bold text-base">{count}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full overflow-hidden" style={{ height: '8px' }}>
                                <div
                                  className={`h-full ${config.color} transition-all duration-500 rounded-full`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Category Breakdown */}
              {cityStats && cityStats.categoryBreakdown && Object.keys(cityStats.categoryBreakdown).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-base mb-4">Top Categories</h3>
                      <div className="space-y-2">
                        {Object.entries(cityStats.categoryBreakdown)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([category, count], index) => (
                            <div
                              key={category}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-sm font-bold text-muted-foreground w-6 flex-shrink-0">
                                  #{index + 1}
                                </span>
                                <span className="text-sm font-medium truncate">{category}</span>
                              </div>
                              <Badge variant="secondary" className="flex-shrink-0 ml-2">{count}</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
