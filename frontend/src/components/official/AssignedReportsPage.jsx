// src/pages/official/AssignedReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Clock,
  CheckCircle,
  TrendingUp,
  MapPin,
  Loader2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Dummy reports data with Indian locations
const DUMMY_REPORTS = [
  {
    id: 1001,
    title: 'Large Pothole on Connaught Place Road',
    description: 'Deep pothole causing traffic disruption near Janpath crossing',
    status: 'pending',
    priority: 'high',
    address: 'Connaught Place, New Delhi, Delhi 110001',
    latitude: 28.6315,
    longitude: 77.2167,
    issue_type: 'pothole',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    citizen_name: 'Rajesh Kumar',
    views: 45,
    upvotes: 23,
  },
  {
    id: 1002,
    title: 'Street Light Not Working - MG Road',
    description: 'Multiple street lights not functioning on MG Road near Brigade Road junction',
    status: 'in_progress',
    priority: 'medium',
    address: 'MG Road, Bangalore, Karnataka 560001',
    latitude: 12.9759,
    longitude: 77.6061,
    issue_type: 'street_light',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    citizen_name: 'Priya Sharma',
    views: 67,
    upvotes: 34,
  },
  {
    id: 1003,
    title: 'Damaged Road Surface on Marine Drive',
    description: 'Road surface deteriorated near Nariman Point, needs urgent repair',
    status: 'pending',
    priority: 'critical',
    address: 'Marine Drive, Mumbai, Maharashtra 400020',
    latitude: 18.9432,
    longitude: 72.8236,
    issue_type: 'damaged_road',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    citizen_name: 'Amit Patel',
    views: 89,
    upvotes: 56,
  },
  {
    id: 1004,
    title: 'Drainage Blockage on Park Street',
    description: 'Water logging during monsoon due to blocked drainage system',
    status: 'resolved',
    priority: 'high',
    address: 'Park Street, Kolkata, West Bengal 700016',
    latitude: 22.5548,
    longitude: 88.3514,
    issue_type: 'drainage',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    citizen_name: 'Sunita Das',
    views: 34,
    upvotes: 18,
  },
  {
    id: 1005,
    title: 'Traffic Sign Missing at Anna Salai Junction',
    description: 'Important traffic signage missing at busy intersection',
    status: 'in_progress',
    priority: 'medium',
    address: 'Anna Salai, Chennai, Tamil Nadu 600002',
    latitude: 13.0569,
    longitude: 80.2425,
    issue_type: 'traffic_sign',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    citizen_name: 'Venkat Subramanian',
    views: 52,
    upvotes: 29,
  },
];

const AssignedReportsPage = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [usingDummyData, setUsingDummyData] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  });

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingDummyData(false);

      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_URL}/api/official/reports?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.reports && response.data.reports.length > 0) {
        setReports(response.data.reports);
        setTotal(response.data.total);
      } else {
        // Use dummy data if no reports
        setReports(DUMMY_REPORTS);
        setTotal(DUMMY_REPORTS.length);
        setUsingDummyData(true);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.response?.data?.detail || 'Failed to load reports');
      // Use dummy data on error
      setReports(DUMMY_REPORTS);
      setTotal(DUMMY_REPORTS.length);
      setUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
      under_review: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye },
      in_progress: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: TrendingUp },
      resolved: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      closed: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700',
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assigned Reports</h1>
        <p className="text-gray-600 mt-2">
          Manage and resolve assigned reports
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Found <span className="font-semibold text-gray-900">{total}</span> report
          {total !== 1 ? 's' : ''}
        </div>
      </Card>

      {/* Reports List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error && !usingDummyData ? (
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </Card>
      ) : reports.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Reports assigned to you will appear here</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => {
            const StatusIcon = getStatusConfig(report.status).icon;
            return (
              <Card
                key={report.id}
                className="p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        className={`${getStatusConfig(report.status).color} border`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {report.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                      <Badge variant="outline" className="text-gray-600">
                        {report.issue_type.replace('_', ' ')}
                      </Badge>
                    </div>

                    <Link
                      to={`/official/reports/${report.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {report.title}
                    </Link>

                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {report.description}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{report.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(report.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{report.views} views</span>
                      </div>
                    </div>

                    {report.citizen_name && (
                      <p className="text-sm text-gray-500 mt-2">
                        Reported by: <span className="font-medium">{report.citizen_name}</span>
                      </p>
                    )}
                  </div>

                  <Link to={`/official/reports/${report.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedReportsPage;
