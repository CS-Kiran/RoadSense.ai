// src/pages/admin/AdminReports.jsx
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Loader2,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  User,
  Calendar,
  TrendingUp,
  RefreshCw,
  EyeOff,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReportDetailsModal from '@/components/admin/ReportDetailsModal';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [issueTypeFilter, setIssueTypeFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Modal state
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [statusFilter, priorityFilter, issueTypeFilter, search]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (issueTypeFilter) params.append('issue_type', issueTypeFilter);
      if (search) params.append('search', search);
      params.append('limit', '100');

      const response = await fetch(
        `http://localhost:8000/api/admin/reports?${params.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
        setTotal(data.total || 0);
      } else {
        setError('Failed to load reports');
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Unable to load reports. Please try again.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(reportId);
      const response = await fetch(
        `http://localhost:8000/api/admin/reports/${reportId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setReports(reports.filter(r => r.id !== reportId));
        setTotal(total - 1);
        alert('Report deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete report: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (reportId) => {
    setSelectedReportId(reportId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReportId(null);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return Clock;
      case 'under_review':
        return Eye;
      case 'in_progress':
        return TrendingUp;
      case 'resolved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'closed':
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-600" />
            All Reports
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor all citizen reports</p>
        </div>
        <Button
          onClick={fetchReports}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={issueTypeFilter}
            onChange={(e) => setIssueTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="">All Issue Types</option>
            <option value="pothole">Pothole</option>
            <option value="crack">Crack</option>
            <option value="debris">Debris</option>
            <option value="faded_marking">Faded Marking</option>
            <option value="street_light">Street Light</option>
            <option value="traffic_sign">Traffic Sign</option>
            <option value="drainage">Drainage</option>
            <option value="other">Other</option>
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Total</p>
          <p className="text-3xl font-bold text-blue-900 mt-1">{total}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <p className="text-sm text-yellow-700 font-medium">Pending</p>
          <p className="text-3xl font-bold text-yellow-900 mt-1">
            {reports.filter((r) => r.status?.toLowerCase() === 'pending').length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <p className="text-sm text-indigo-700 font-medium">In Progress</p>
          <p className="text-3xl font-bold text-indigo-900 mt-1">
            {reports.filter((r) => r.status?.toLowerCase() === 'in_progress').length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm text-green-700 font-medium">Resolved</p>
          <p className="text-3xl font-bold text-green-900 mt-1">
            {reports.filter((r) => r.status?.toLowerCase() === 'resolved').length}
          </p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <p className="text-sm text-red-700 font-medium">Critical</p>
          <p className="text-3xl font-bold text-red-900 mt-1">
            {reports.filter((r) => r.priority?.toLowerCase() === 'critical').length}
          </p>
        </Card>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : reports.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No reports found</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => {
            const StatusIcon = getStatusIcon(report.status);
            return (
              <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                      <Badge className={`${getStatusColor(report.status)} border`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {report.status?.replace('_', ' ')}
                      </Badge>
                      {report.is_anonymous && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-600">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {report.description}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{report.address || 'No address'}</span>
                  </div>
                  {report.user && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span>{report.user.full_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Issue Type & Stats */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {report.issue_type?.replace('_', ' ')}
                  </Badge>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {report.upvotes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {report.views || 0}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(report.id)}
                    className="flex-1 flex items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteReport(report.id)}
                    disabled={deletingId === report.id}
                    className="text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    {deletingId === report.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Report Details Modal */}
      <ReportDetailsModal
        reportId={selectedReportId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={fetchReports}
      />
    </div>
  );
};

export default AdminReports;
