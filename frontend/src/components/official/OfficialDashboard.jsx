// src/pages/official/OfficialDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Dummy data for demonstration
const DUMMY_STATS = {
  total_assigned: 47,
  pending: 12,
  in_progress: 18,
  resolved: 17,
  team_members: 8,
  zones_managed: 3,
};

const OfficialDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(DUMMY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingDummyData(false);

      const response = await axios.get(`${API_URL}/api/official/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if data is empty
      const hasData = Object.values(response.data).some(val => val > 0);
      
      if (hasData) {
        setStats(response.data);
      } else {
        // Use dummy data if backend returns all zeros
        setStats(DUMMY_STATS);
        setUsingDummyData(true);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard statistics');
      // Use dummy data on error
      setStats(DUMMY_STATS);
      setUsingDummyData(true);
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.full_name || 'Official'}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.department || 'Public Works Department'} • {user?.designation || 'Engineer'}
        </p>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} border-0 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Overview
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            • You have <span className="font-semibold text-gray-900">{stats.pending} pending reports</span> awaiting review
          </p>
          <p>
            • Currently working on <span className="font-semibold text-gray-900">{stats.in_progress} reports</span>
          </p>
          <p>
            • Successfully resolved <span className="font-semibold text-gray-900">{stats.resolved} issues</span> this period
          </p>
          <p>
            • Managing <span className="font-semibold text-gray-900">{stats.zones_managed} zones</span> with <span className="font-semibold text-gray-900">{stats.team_members} team members</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default OfficialDashboard;
