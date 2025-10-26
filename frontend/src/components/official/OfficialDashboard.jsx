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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const OfficialDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_assigned: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    team_members: 0,
    zones_managed: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    setStats({
      total_assigned: 45,
      pending: 12,
      in_progress: 18,
      resolved: 15,
      team_members: 8,
      zones_managed: 3,
    });
  }, []);

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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {user?.full_name || 'Official'}!
        </h1>
        <p className="text-slate-600 mt-1">
          {user?.department || 'Government Official'} • {user?.designation || 'Officer'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className={`p-6 bg-gradient-to-br ${stat.gradient} border-0 shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className={`text-sm font-medium ${stat.textColor} mb-1`}>{stat.title}</h3>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Recent activity will appear here</p>
          <p className="text-sm text-slate-500 mt-2">Connect API to view real-time updates</p>
        </div>
      </Card>
    </div>
  );
};

export default OfficialDashboard;
