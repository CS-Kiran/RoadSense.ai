// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  FileText,
  UserCheck,
  TrendingUp,
  Loader2,
  Activity,
  AlertCircle,
  BarChart3,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: {
      citizens: 0,
      active_officials: 0,
      pending_officials: 0,
    },
    reports: {
      total: 0,
      pending: 0,
      in_progress: 0,
      resolved: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/admin/statistics"
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        setError("Unable to load statistics");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Unable to load statistics. Displaying default values.");
    } finally {
      setLoading(false);
    }
  };

  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userInfo.full_name || "Administrator"}!
        </h1>
        <p className="text-purple-100">
          Here's what's happening with your platform today
        </p>
      </div>

      {error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="p-2 bg-blue-200 rounded-lg">
              <TrendingUp className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <p className="text-sm text-blue-700 font-medium mb-1">
            Total Citizens
          </p>
          <p className="text-3xl font-bold text-blue-900">
            {stats?.users?.citizens || 0}
          </p>
          <p className="text-xs text-blue-600 mt-2">Active users on platform</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div className="p-2 bg-green-200 rounded-lg">
              <Activity className="w-4 h-4 text-green-700" />
            </div>
          </div>
          <p className="text-sm text-green-700 font-medium mb-1">
            Active Officials
          </p>
          <p className="text-3xl font-bold text-green-900">
            {stats?.users?.active_officials || 0}
          </p>
          <p className="text-xs text-green-600 mt-2">Verified and active</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
            <div className="p-2 bg-yellow-200 rounded-lg">
              <TrendingUp className="w-4 h-4 text-yellow-700" />
            </div>
          </div>
          <p className="text-sm text-yellow-700 font-medium mb-1">
            Pending Officials
          </p>
          <p className="text-3xl font-bold text-yellow-900">
            {stats?.users?.pending_officials || 0}
          </p>
          <p className="text-xs text-yellow-600 mt-2">Awaiting verification</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
            <div className="p-2 bg-purple-200 rounded-lg">
              <BarChart3 className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <p className="text-sm text-purple-700 font-medium mb-1">
            Total Reports
          </p>
          <p className="text-3xl font-bold text-purple-900">
            {stats?.reports?.total || 0}
          </p>
          <p className="text-xs text-purple-600 mt-2">All time submissions</p>
        </Card>
      </div>

      {/* Reports Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          Report Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-700 font-medium mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-900">
              {stats?.reports?.pending || 0}
            </p>
            <p className="text-xs text-amber-600 mt-1">Needs attention</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-1">
              In Progress
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {stats?.reports?.in_progress || 0}
            </p>
            <p className="text-xs text-blue-600 mt-1">Being handled</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-900">
              {stats?.reports?.resolved || 0}
            </p>
            <p className="text-xs text-green-600 mt-1">Successfully closed</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
