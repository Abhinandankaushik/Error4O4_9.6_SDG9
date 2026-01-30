'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { Plus, Search, Filter, MapPin, Calendar, User } from 'lucide-react';

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
  reportedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  upvotes: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);

      const response = await fetch(`/api/reports?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        let filteredReports = data.data;
        
        // Client-side search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredReports = filteredReports.filter((report: Report) =>
            report.title.toLowerCase().includes(searchLower) ||
            report.description.toLowerCase().includes(searchLower) ||
            report.category.toLowerCase().includes(searchLower) ||
            report.address.toLowerCase().includes(searchLower)
          );
        }

        setReports(filteredReports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      submitted: 'bg-gray-500',
      under_review: 'bg-yellow-500',
      in_progress: 'bg-blue-500',
      resolved: 'bg-green-500',
      closed: 'bg-gray-700',
      rejected: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-gray-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground break-words">
              Infrastructure Reports
            </h1>
            <p className="text-muted-foreground mt-2 break-words">
              View and track all infrastructure issues reported in your area
            </p>
          </div>
          <Button
            onClick={() => router.push('/reports/new')}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Report
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Label>
                <Input
                  id="search"
                  placeholder="Search reports..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full"
                >
                  <option value="">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Filter by category..."
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No reports found</p>
              <Button onClick={() => router.push('/reports/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Report
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report._id}
                className="hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                onClick={() => router.push(`/reports/${report._id}`)}
              >
                {/* Image */}
                {report.images && report.images.length > 0 && (
                  <div className="w-full h-48 bg-muted relative overflow-hidden">
                    <img
                      src={report.images[0]}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg break-words overflow-wrap-anywhere flex-1">
                      {report.title}
                    </CardTitle>
                    <Badge className={`${getPriorityColor(report.priority)} shrink-0`}>
                      {report.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${getStatusColor(report.status)} text-white`}>
                      {report.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="break-words">
                      {report.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2 break-words overflow-wrap-anywhere">
                    {report.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground break-words overflow-wrap-anywhere flex-1">
                        {report.address}
                      </span>
                    </div>

                    {report.area && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground break-words">
                          Area: {report.area}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {report.reportedBy && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground break-words overflow-wrap-anywhere">
                          {report.reportedBy.name || report.reportedBy.email}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        👍 {report.upvotes} upvotes
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
