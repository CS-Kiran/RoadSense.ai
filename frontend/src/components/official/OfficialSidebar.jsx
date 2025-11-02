// src/components/official/OfficialSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  MapPin,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const OfficialSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Fetch unread notifications count
    setNotifications(user?.unreadNotifications || 5);
  }, [user]);

  const menuItems = [
    {
      path: '/official/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & Stats',
      gradient: 'from-blue-500 to-blue-600',
      color: 'blue',
    },
    {
      path: '/official/reports',
      icon: FileText,
      label: 'Assigned Reports',
      description: 'Manage Issues',
      gradient: 'from-purple-500 to-purple-600',
      color: 'purple',
    },
    {
      path: '/official/teams',
      icon: Users,
      label: 'Team Management',
      description: 'Staff & Members',
      gradient: 'from-green-500 to-emerald-600',
      color: 'green',
    },
    {
      path: '/official/zones',
      icon: MapPin,
      label: 'Zone Management',
      description: 'Area Overview',
      gradient: 'from-orange-500 to-amber-600',
      color: 'orange',
    },
    {
      path: '/official/analytics',
      icon: BarChart3,
      label: 'Analytics',
      description: 'Insights & Reports',
      gradient: 'from-indigo-500 to-indigo-600',
      color: 'indigo',
    },
    {
      path: '/official/notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Updates & Alerts',
      badge: notifications,
      gradient: 'from-pink-500 to-rose-600',
      color: 'pink',
    },
    {
      path: '/official/profile',
      icon: User,
      label: 'My Profile',
      description: 'Account Settings',
      gradient: 'from-cyan-500 to-blue-600',
      color: 'cyan',
    },
  ];

  const isActive = (path) => location.pathname === path;

  const getColorClasses = (color, active) => {
    const colors = {
      blue: active
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
        : 'text-gray-700 hover:bg-blue-50',
      purple: active
        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20'
        : 'text-gray-700 hover:bg-purple-50',
      green: active
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20'
        : 'text-gray-700 hover:bg-green-50',
      orange: active
        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
        : 'text-gray-700 hover:bg-orange-50',
      indigo: active
        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
        : 'text-gray-700 hover:bg-indigo-50',
      pink: active
        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20'
        : 'text-gray-700 hover:bg-pink-50',
      cyan: active
        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
        : 'text-gray-700 hover:bg-cyan-50',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-white min-h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-gray-200 shadow-lg relative`}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900 font-bold text-lg">Official Portal</h2>
                <p className="text-gray-600 text-xs">PWD Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`${
              isCollapsed ? 'mx-auto' : ''
            } p-2 hover:bg-white/80 rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-semibold text-sm truncate">
                {user?.full_name || user?.email || 'Official User'}
              </p>
              <p className="text-gray-600 text-xs truncate">
                {user?.designation || 'Government Official'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group relative flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-200 ease-in-out
                ${getColorClasses(item.color, active)}
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              {/* Icon with gradient background for active state */}
              <div
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-lg
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-white/20 shadow-inner'
                      : 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label and Description */}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <span className={`text-xs block truncate ${active ? 'text-white/80' : 'text-gray-500'}`}>
                    {item.description}
                  </span>
                </div>
              )}

              {/* Active Indicator */}
              {active && !isCollapsed && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="w-1.5 h-8 bg-white/30 rounded-full" />
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats Section */}
      {!isCollapsed && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Efficiency</span>
              </div>
              <span className="text-gray-900 font-bold text-sm">92%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 text-sm font-medium">Active Cases</span>
              </div>
              <span className="text-gray-900 font-bold text-sm">24</span>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={logout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl
            bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700
            transition-all duration-200 border border-red-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default OfficialSidebar;
