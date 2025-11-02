// src/pages/official/AnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Dummy analytics data
const DUMMY_ANALYTICS = {
  reports_by_status: {
    pending: 32,
    in_progress: 45,
    under_review: 18,
    resolved: 79,
    closed: 12,
  },
  reports_by_priority: {
    critical: 15,
    high: 42,
    medium: 67,
    low: 34,
  },
  reports_by_issue: {
    pothole: 45,
    damaged_road: 38,
    street_light: 28,
    drainage: 22,
    traffic_sign: 15,
    debris: 10,
  },
  monthly_trends: [
    { month: 'Jan', reports: 45, resolved: 38 },
    { month: 'Feb', reports: 52, resolved: 44 },
    { month: 'Mar', reports: 48, resolved: 41 },
    { month: 'Apr', reports: 61, resolved: 52 },
    { month: 'May', reports: 58, resolved: 49 },
    { month: 'Jun', reports: 65, resolved: 56 },
  ],
  zone_performance: [
    { zone: 'Zone A', reports: 156, resolved: 79, percentage: 50.6 },
    { zone: 'Zone B', reports: 189, resolved: 109, percentage: 57.7 },
    { zone: 'Zone C', reports: 134, resolved: 77, percentage: 57.5 },
    { zone: 'Zone D', reports: 142, resolved: 77, percentage: 54.2 },
    { zone: 'Zone E', reports: 98, resolved: 54, percentage: 55.1 },
  ],
  avg_resolution_time_hours: 18.5,
  total_resolved: 396,
};

const COLORS = {
  pending: '#F59E0B',
  in_progress: '#8B5CF6',
  under_review: '#3B82F6',
  resolved: '#10B981',
  closed: '#6B7280',
  critical: '#EF4444',
  high: '#F97316',
  medium: '#FBBF24',
  low: '#3B82F6',
};

const AnalyticsPage = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(DUMMY_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingDummyData(false);

      const response = await axios.get(`${API_URL}/api/official/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const hasData = Object.values(response.data.reports_by_status || {}).some(
        (val) => val > 0
      );

      if (hasData) {
        setAnalytics(response.data);
      } else {
        setAnalytics(DUMMY_ANALYTICS);
        setUsingDummyData(true);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.detail || 'Failed to load analytics');
      setAnalytics(DUMMY_ANALYTICS);
      setUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  // Transform data for charts
  const statusData = Object.entries(analytics.reports_by_status).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value,
    color: COLORS[key],
  }));

  const priorityData = Object.entries(analytics.reports_by_priority).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: COLORS[key],
  }));

  const issueData = Object.entries(analytics.reports_by_issue).map(([key, value]) => ({
    name: key.replace('_', ' '),
    count: value,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-2">Performance metrics and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-blue-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Total Reports</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">
            {Object.values(analytics.reports_by_status).reduce((a, b) => a + b, 0)}
          </p>
          <p className="text-xs text-green-600 mt-2">↑ 12% vs last month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-0">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-3xl font-bold text-green-700 mt-1">
            {analytics.total_resolved}
          </p>
          <p className="text-xs text-green-600 mt-2">↑ 8% vs last month</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-0">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-amber-500" />
            <TrendingDown className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Avg Resolution Time</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">
            {analytics.avg_resolution_time_hours}h
          </p>
          <p className="text-xs text-green-600 mt-2">↓ 15% improvement</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-purple-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Resolution Rate</p>
          <p className="text-3xl font-bold text-purple-700 mt-1">
            {(
              (analytics.total_resolved /
                Object.values(analytics.reports_by_status).reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(1)}
            %
          </p>
          <p className="text-xs text-green-600 mt-2">↑ 5% vs last month</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Reports by Priority */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthly_trends || DUMMY_ANALYTICS.monthly_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reports" stroke="#8B5CF6" strokeWidth={2} name="Reports" />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Reports by Issue Type */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Issue Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Zone Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Zone</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Reports</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Resolved</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Resolution Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {(analytics.zone_performance || DUMMY_ANALYTICS.zone_performance).map((zone, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{zone.zone}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{zone.reports}</td>
                  <td className="py-3 px-4 text-right text-green-600 font-semibold">
                    {zone.resolved}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">{zone.percentage}%</td>
                  <td className="py-3 px-4 text-right">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${zone.percentage}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
