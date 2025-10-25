import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Eye, 
  Plus,
  Loader2,
  FileText,
  TrendingUp,
  AlertCircle,
  X,
  Camera, // Added Camera icon
  CheckCircle // Added for Resolved/Closed
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from '@/api/axios';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0 // This will be estimated
  });

  useEffect(() => {
    fetchReports();
  }, [filters, pagination.page]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const skip = (pagination.page - 1) * pagination.limit;
      
      const params = new URLSearchParams({
        skip: skip,
        limit: pagination.limit,
        ...(filters.status !== 'all' && { status_filter: filters.status }),
        ...(filters.category !== 'all' && { issue_type: filters.category }),
        // 'search' is not supported by the /api/reports endpoint in main.py, so it's omitted
      });
      const response = await axios.get(`/api/reports?${params}`);
      
      // FIX 3: Handle list response (response.data is the list)
      setReports(response.data || []);

      // FIX 4: Hack to make pagination work without a 'total' count from API
      let totalCount = 0;
      if (response.data.length < pagination.limit) {
        // This is the last page
        totalCount = skip + response.data.length;
      } else {
        // There might be more pages, enable the "Next" button
        totalCount = skip + response.data.length + 1;
      }
      setPagination(prev => ({ ...prev, total: totalCount }));

    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    // FIX 5: Updated to match main.py ReportStatus enum
    const configs = {
      pending: {
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        icon: Clock
      },
      under_review: {
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        icon: AlertCircle
      },
      in_progress: {
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        icon: TrendingUp
      },
      resolved: {
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-500',
        icon: CheckCircle
      },
      closed: {
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        dot: 'bg-gray-500',
        icon: CheckCircle
      },
      rejected: {
        color: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500',
        icon: X
      }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const clearFilters = () => {
    setFilters({ status: 'all', category: 'all', search: '' });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.category !== 'all' || filters.search !== '';

  // Helper for text formatting
  const formatLabel = (label) => {
    if (!label) return '';
    return label.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FileText size={32} />
              <h1 className="text-3xl font-bold">My Reports</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Track and manage all your submissions
            </p>
          </div>
          <Link to="/citizen/report-issue">
            <Button className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              <Plus size={20} className="mr-2" />
              New Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search (Note: Not supported by backend endpoint) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search (not implemented in API)"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={true} // Disabled as backend doesn't support it
            />
          </div>

          {/* Status Filter - FIX 6: Updated options */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Category Filter - FIX 7: Updated options */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Categories</option>
            <option value="POTHOLE">Pothole</option>
            <option value="CRACK">Crack</option>
            <option value="DEBRIS">Debris</option>
            <option value="FADED_MARKING">Faded Marking</option>
            <option value="STREET_LIGHT">Street Light</option>
            <option value="TRAFFIC_SIGN">Traffic Sign</option>
            <option value="DRAINAGE">Drainage</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </Card>

      {/* Reports List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 font-medium">Loading your reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <Card className="p-16 text-center border-0 shadow-lg">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-blue-600" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 mb-6">
            {hasActiveFilters 
              ? "Try adjusting your filters" 
              : "Start making a difference in your community"}
          </p>
          <Link to="/citizen/report-issue">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl">
              <Plus size={18} className="mr-2" />
              Submit Your First Report
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* FIX 8: Updated report card to use correct data fields */}
          {reports.map((report) => {
            const statusConfig = getStatusConfig(report.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Link key={report.id} to={`/citizen/reports/${report.id}`}>
                <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          Report #{report.id}
                        </span>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                          <span className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}></span>
                          {formatLabel(report.status)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {formatLabel(report.issue_type)}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>

                      {/* Description (Not available in list view from main.py) */}
                      {/* <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {report.description}
                      </p> */}

                      {/* Meta Info */}
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-sm text-gray-500 space-y-2 md:space-y-0">
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1 text-blue-600" />
                          {report.address?.substring(0, 50)}...
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1 text-purple-600" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        {/* 'viewcount' is not in the list response, so it's removed */}
                      </div>
                    </div>

                    {/* Image Count (replaces thumbnail) */}
                    <div className="ml-6 flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-xl shadow-inner group-hover:shadow-md transition-all">
                      {report.image_count > 0 ? (
                        <>
                          <Camera size={32} className="text-gray-500 mb-2" />
                          <span className="font-bold text-gray-700">{report.image_count}</span>
                          <span className="text-xs text-gray-500">
                            {report.image_count > 1 ? 'images' : 'image'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Camera size={32} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">No images</span>
                        </>
                      )}
                    </div>

                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {/* Show pagination controls if on page > 1 OR if total is more than limit */}
      {(pagination.page > 1 || pagination.total > pagination.limit) && (
        <Card className="p-4 border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pagination.page}
              {/* Showing 1 to 10 of {pagination.total} reports */}
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500"
              >
                Previous
              </Button>
              <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg">
                Page {pagination.page}
                {/* {pagination.total > 0 && ` of ${Math.ceil(pagination.total / pagination.limit)}`} */}
              </div>
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.total <= (pagination.page * pagination.limit)} // Disable if total is reached
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyReportsPage;