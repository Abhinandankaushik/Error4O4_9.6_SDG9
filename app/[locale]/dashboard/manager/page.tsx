'use client';

import { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">City Manager Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track infrastructure repair reports
            </p>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Reports</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalReports}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-3xl text-warning">
                  {analytics.submittedReports}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>In Progress</CardDescription>
                <CardTitle className="text-3xl text-info">
                  {analytics.inProgressReports}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Resolution Rate</CardDescription>
                <CardTitle className="text-3xl text-success">
                  {analytics.resolutionRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
              <Button onClick={fetchDashboardData} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reports ({reports.length})</CardTitle>
            <CardDescription>Manage infrastructure repair reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-muted-foreground">
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
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report._id} className="border-b last:border-0">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-sm">{report.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {report.address.substring(0, 50)}...
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm">
                            {report.categoryId?.icon} {report.categoryId?.name}
                          </span>
                        </td>
                        <td className="py-4">
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {report.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge variant={getPriorityBadgeVariant(report.priority)}>
                            {report.priority}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm">{report.area || 'N/A'}</td>
                        <td className="py-4 text-sm">{report.reportedBy?.name}</td>
                        <td className="py-4 text-sm">👍 {report.upvotes}</td>
                        <td className="py-4">
                          <Select
                            value={report.status}
                            onChange={(e) => handleStatusChange(report._id, e.target.value)}
                            className="w-40"
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
  );
}
