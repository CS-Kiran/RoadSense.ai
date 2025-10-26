// src/components/official/OfficialSidebar.jsx
import React from 'react';
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
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const OfficialSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      path: '/official/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & Stats',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      path: '/official/reports',
      icon: FileText,
      label: 'Assigned Reports',
      description: 'Manage Reports',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      path: '/official/teams',
      icon: Users,
      label: 'Team Management',
      description: 'Manage Teams',
      gradient: 'from-green-500 to-green-600',
    },
    {
      path: '/official/zones',
      icon: MapPin,
      label: 'Zone Management',
      description: 'Manage Zones',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      path: '/official/analytics',
      icon: BarChart3,
      label: 'Analytics',
      description: 'Reports & Stats',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      path: '/official/notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Updates & Alerts',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      path: '/official/profile',
      icon: User,
      label: 'Profile',
      description: 'Settings & Info',
      gradient: 'from-slate-500 to-slate-600',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col transition-all duration-300 shadow-xl`}
    >
      {/* Header */}
      <div className="p-4 border-b border-green-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">Official Portal</h1>
              <p className="text-xs text-green-200">RoadSense.ai</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 bg-green-800/50 border-b border-green-700">
          <p className="text-sm font-semibold truncate">{user?.full_name || 'Official'}</p>
          <p className="text-xs text-green-200 truncate">{user?.email}</p>
          <p className="text-xs text-green-300 mt-1">{user?.department || 'Government Official'}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                    ${
                      active
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-green-100 hover:bg-green-700 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.label}</p>
                      <p className="text-xs opacity-75 truncate">{item.description}</p>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-300 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full mt-2 flex items-center justify-center py-2 rounded-lg text-green-200 hover:bg-green-700 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default OfficialSidebar;
