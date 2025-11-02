// src/pages/official/OfficialDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, TrendingUp, Users, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const OfficialDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    total_assigned: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    team_members: 0,
    zones_managed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/official/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Assigned',
      value: stats.total_assigned,
      icon: FileText,
      gradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-700',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-amber-50 to-amber-100',
      iconBg: 'bg-amber-500',
      textColor: 'text-amber-700',
    },
    {
      title: 'In Progress',
      value: stats.in_progress,
      icon: TrendingUp,
      gradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-700',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      gradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500',
      textColor: 'text-green-700',
    },
    {
      title: 'Team Members',
      value: stats.team_members,
      icon: Users,
      gradient: 'from-indigo-50 to-indigo-100',
      iconBg: 'bg-indigo-500',
      textColor: 'text-indigo-700',
    },
    {
      title: 'Zones Managed',
      value: stats.zones_managed,
      icon: MapPin,
      gradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-700',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.department || 'Government Official'} • {user?.designation || 'Officer'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`p-6 bg-gradient-to-br ${stat.gradient} border-0 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">View Reports</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">Update Status</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">View Analytics</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default OfficialDashboard;
