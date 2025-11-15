import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  MapPin,
  Plus,
  Bell,
  Loader2,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import axios from '@/api/axios';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    weekly_change: 0,
    avg_response_time: '24h',
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      // Fetch ALL user reports using the reports endpoint
      const reportsResponse = await axios.get('/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: 100, // Get enough reports to calculate stats
        },
      });

      const allReports = reportsResponse.data;
      console.log('📊 Total reports fetched:', allReports.length);
      console.log('📝 Sample report:', allReports[0]);

      // Calculate stats from reports (FRONTEND LOGIC)
      const total = allReports.length;

      const pending = allReports.filter((report) => {
        const status = report.status?.toLowerCase();
        return status === 'pending';
      }).length;

      const inProgress = allReports.filter((report) => {
        const status = report.status?.toLowerCase();
        return status === 'in_progress' || status === 'in progress' || status === 'acknowledged';
      }).length;

      const resolved = allReports.filter((report) => {
        const status = report.status?.toLowerCase();
        return status === 'resolved' || status === 'closed';
      }).length;

      // Calculate weekly change
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const prevWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const thisWeekReports = allReports.filter((report) => {
        const createdAt = new Date(report.created_at);
        return createdAt >= lastWeek;
      }).length;

      const prevWeekReports = allReports.filter((report) => {
        const createdAt = new Date(report.created_at);
        return createdAt >= prevWeek && createdAt < lastWeek;
      }).length;

      let weeklyChange = 0;
      if (prevWeekReports > 0) {
        weeklyChange = Math.round(((thisWeekReports - prevWeekReports) / prevWeekReports) * 100);
      } else if (thisWeekReports > 0) {
        weeklyChange = 100;
      }

      // Calculate average response time for resolved reports
      const resolvedReports = allReports.filter((report) => {
        const status = report.status?.toLowerCase();
        return (
          (status === 'resolved' || status === 'closed') &&
          report.created_at &&
          report.updated_at
        );
      });

      let avgResponseTime = '24h';
      if (resolvedReports.length > 0) {
        const totalResponseTime = resolvedReports.reduce((sum, report) => {
          const created = new Date(report.created_at);
          const resolved = new Date(report.updated_at);
          const diffHours = (resolved - created) / (1000 * 60 * 60);
          return sum + diffHours;
        }, 0);

        const avgHours = Math.round(totalResponseTime / resolvedReports.length);

        if (avgHours < 1) {
          avgResponseTime = '< 1h';
        } else if (avgHours < 24) {
          avgResponseTime = `${avgHours}h`;
        } else {
          const avgDays = Math.round(avgHours / 24);
          avgResponseTime = `${avgDays}d`;
        }
      }

      // Update stats
      const calculatedStats = {
        total,
        pending,
        in_progress: inProgress,
        resolved,
        weekly_change: weeklyChange,
        avg_response_time: avgResponseTime,
      };

      console.log('✅ Calculated stats:', calculatedStats);

      setStats(calculatedStats);

      // Get recent 5 reports
      const sortedReports = [...allReports].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setRecentReports(sortedReports.slice(0, 5));
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.total,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
      link: '/citizen/reports',
      change: stats.weekly_change !== 0 ? `${stats.weekly_change > 0 ? '+' : ''}${stats.weekly_change}%` : null,
      changeType: stats.weekly_change >= 0 ? 'increase' : 'decrease',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-100',
      iconBg: 'bg-amber-500',
      link: '/citizen/reports?status=pending',
    },
    {
      title: 'In Progress',
      value: stats.in_progress,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      link: '/citizen/reports?status=in_progress',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500',
      link: '/citizen/reports?status=resolved',
    },
  ];

  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    const configs = {
      pending: {
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      },
      acknowledged: {
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      },
      in_progress: {
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
      },
      'in progress': {
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
      },
      resolved: {
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-500',
      },
      closed: {
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-500',
      },
      rejected: {
        color: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500',
      },
    };
    return configs[statusLower] || configs.pending;
  };

  const quickActions = [
    {
      title: 'Report New Issue',
      description: 'Submit a new road problem',
      icon: Plus,
      link: '/citizen/report-issue',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      primary: true,
    },
    {
      title: 'View Map',
      description: 'Explore nearby issues',
      icon: MapPin,
      link: '/citizen/map',
      color: 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg',
    },
    {
      title: 'Notifications',
      description: 'Check updates',
      icon: Bell,
      link: '/citizen/notifications',
      color: 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Welcome back, {user?.full_name || 'Citizen'}!
              </h1>
              <p className="text-slate-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Avg Response</p>
                <p className="text-2xl font-bold text-slate-800">{stats.avg_response_time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card
                className={`p-6 ${action.color} transition-all duration-300 hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <action.icon
                      className={`w-8 h-8 mb-3 ${action.primary ? 'text-white' : 'text-blue-600'}`}
                    />
                    <h3
                      className={`font-semibold text-lg mb-1 ${
                        action.primary ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {action.title}
                    </h3>
                    <p className={`text-sm ${action.primary ? 'text-blue-100' : 'text-slate-600'}`}>
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className={`w-5 h-5 ${action.primary ? 'text-white' : 'text-slate-400'}`}
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card
                className={`p-6 bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change && (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        stat.changeType === 'increase'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Reports */}
        <Card className="p-6 shadow-xl border-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Recent Reports</h2>
            <Link to="/citizen/reports">
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No reports yet</p>
              <p className="text-sm text-slate-500 mb-6">
                Start making a difference in your community
              </p>
              <Link to="/citizen/report-issue">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Report Your First Issue
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report) => {
                const statusConfig = getStatusConfig(report.status);
                return (
                  <Link key={report.id} to={`/citizen/reports/${report.id}`}>
                    <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{report.title}</h3>
                          <p className="text-sm text-slate-600 line-clamp-1">
                            {report.address || 'No address'}
                          </p>
                        </div>
                        <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                          <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                          {report.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        <span>👍 {report.upvotes || 0}</span>
                        {report.images && report.images.length > 0 && (
                          <span>📷 {report.images.length}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
