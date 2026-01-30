'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

interface Report {
  _id: string;
  title: string;
  status: string;
  priority: string;
  address: string;
  area: string;
  createdAt: string;
  reportedBy: {
    name: string;
    email: string;
  };
  categoryId: {
    name: string;
    icon: string;
  };
  upvotes: number;
}

interface Analytics {
  totalReports: number;
  resolvedReports: number;
  inProgressReports: number;
  submittedReports: number;
  resolutionRate: number;
  avgResolutionTimeHours: number;
}

export default function ManagerDashboard() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter, areaFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch reports
      let reportsUrl = '/api/reports?limit=50';
      if (statusFilter !== 'all') {
        reportsUrl += `&status=${statusFilter}`;
      }
      if (areaFilter !== 'all') {
        reportsUrl += `&area=${areaFilter}`;
      }

      const reportsResponse = await fetch(reportsUrl);
      const reportsData = await reportsResponse.json();

      if (reportsData.success) {
        setReports(reportsData.data);
      }

      // Fetch analytics
      const analyticsResponse = await fetch('/api/analytics/resolution-rate');
      const analyticsData = await analyticsResponse.json();

      if (analyticsData.success) {
        setAnalytics(analyticsData.data.overall);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh data
        fetchDashboardData();
        alert('Status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, any> = {
      submitted: 'default',
      under_review: 'warning',
      in_progress: 'secondary',
      resolved: 'success',
      closed: 'outline',
      rejected: 'destructive',
    };
    return variants[status] || 'default';
  };

  const getPriorityBadgeVariant = (priority: string) => {
    const variants: Record<string, any> = {
      low: 'outline',
      medium: 'secondary',
      high: 'warning',
      urgent: 'destructive',
    };
    return variants[priority] || 'default';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-blue-950/20 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-blue-950/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                City Manager Dashboard
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Manage and track infrastructure repair reports
              </p>
            </div>
          </div>

          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all">
                <CardHeader className="pb-2">
                  <CardDescription className="text-gray-400">Total Reports</CardDescription>
                  <CardTitle className="text-4xl text-white flex items-center gap-2">
                    <span className="text-3xl">📊</span>
                    {analytics.totalReports}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-2 border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <CardHeader className="pb-2">
                  <CardDescription className="text-gray-400">Pending</CardDescription>
                  <CardTitle className="text-4xl text-yellow-400 flex items-center gap-2">
                    <span className="text-3xl">⏳</span>
                    {analytics.submittedReports}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardHeader className="pb-2">
                  <CardDescription className="text-gray-400">In Progress</CardDescription>
                  <CardTitle className="text-4xl text-purple-400 flex items-center gap-2">
                    <span className="text-3xl">⚙️</span>
                    {analytics.inProgressReports}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-2 border-green-500/20 hover:border-green-500/40 transition-all">
                <CardHeader className="pb-2">
                  <CardDescription className="text-gray-400">Resolution Rate</CardDescription>
                  <CardTitle className="text-4xl text-green-400 flex items-center gap-2">
                    <span className="text-3xl">✅</span>
                    {analytics.resolutionRate.toFixed(1)}%
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-2 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>
                <Button 
                  onClick={fetchDashboardData} 
                  variant="outline"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                >
                  🔄 Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-2 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Reports ({reports.length})
              </CardTitle>
              <CardDescription className="text-gray-400">
                Click on any report to view full details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-700">
                    <tr className="text-left text-sm text-gray-400">
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Priority</th>
                      <th className="pb-3 font-medium">Area</th>
                      <th className="pb-3 font-medium">Reported By</th>
                      <th className="pb-3 font-medium">Votes</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400">
                          <div className="flex flex-col items-center gap-3">
                            <span className="text-5xl">📭</span>
                            <p className="text-lg">No reports found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      reports.map((report) => (
                        <tr 
                          key={report._id} 
                          className="border-b border-gray-800 last:border-0 hover:bg-blue-500/5 transition-colors cursor-pointer"
                          onClick={() => router.push(`/${locale}/reports/${report._id}`)}
                        >
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-sm text-white hover:text-blue-400 transition-colors">
                                {report.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {report.address.substring(0, 50)}...
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="text-sm text-gray-300">
                              {report.categoryId?.icon} {report.categoryId?.name}
                            </span>
                          </td>
                          <td className="py-4">
                            <Badge variant={getStatusBadgeVariant(report.status)} className="font-semibold">
                              {report.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Badge variant={getPriorityBadgeVariant(report.priority)} className="font-semibold">
                              {report.priority}
                            </Badge>
                          </td>
                          <td className="py-4 text-sm text-gray-300">{report.area || 'N/A'}</td>
                          <td className="py-4 text-sm text-gray-300">{report.reportedBy?.name}</td>
                          <td className="py-4 text-sm text-cyan-400 font-semibold">
                            👍 {report.upvotes}
                          </td>
                          <td className="py-4">
                            <Select
                              value={report.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleStatusChange(report._id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-40 bg-gray-800 border-gray-700 text-white text-sm"
                            >
                              <option value="submitted">Submitted</option>
                              <option value="under_review">Under Review</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                              <option value="rejected">Rejected</option>
                            </Select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
