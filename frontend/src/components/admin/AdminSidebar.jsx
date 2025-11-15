// src/components/admin/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  BarChart3,
  FileText,
  AlertTriangle,
  Activity,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    // Fetch pending officials count (mock data for now)
    setPendingCount(3);
  }, []);

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & Stats',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'User Management',
      description: 'Manage All Users',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      path: '/admin/officials/verify',
      icon: UserCheck,
      label: 'Verify Officials',
      description: 'Approve Pending',
      badge: pendingCount,
      highlight: pendingCount > 0,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      path: '/admin/reports',
      icon: BarChart3,
      label: 'All Reports',
      description: 'View Reports',
      gradient: 'from-green-500 to-emerald-600'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-xl transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section with Admin Gradient */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Shield className="text-purple-600 w-6 h-6" />
              </div>
              <div>
                <span className="text-white font-bold text-lg block leading-tight">
                  RoadSense.ai
                </span>
                <span className="text-purple-200 text-xs">Admin Panel</span>
              </div>
            </Link>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${item.highlight && !active ? 'ring-2 ring-purple-500/30 bg-purple-50' : ''}`}
                >
                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}

                  {/* Icon with badge */}
                  <div className={`relative flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                    <Icon
                      size={20}
                      className={active ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}
                    />
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm ${active ? 'text-white' : 'text-gray-900 group-hover:text-purple-600'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs ${active ? 'text-purple-100' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}

                  {!isCollapsed && item.highlight && !active && (
                    <AlertTriangle size={14} className="text-orange-600 animate-pulse" />
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-300">{item.description}</div>
                      {item.badge > 0 && (
                        <div className="mt-1 text-xs text-orange-300">
                          {item.badge} pending
                        </div>
                      )}
                      {/* Arrow */}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Stats Section */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-700">System Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700">Active</span>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              All systems operational
            </div>
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center ring-2 ring-purple-200">
              <Shield className="text-white w-5 h-5" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.full_name || 'Administrator'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@roadsense.ai'}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield size={10} className="text-purple-600" />
                <span className="text-xs text-purple-600 font-semibold">Admin Access</span>
              </div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={logout}
            className="flex items-center justify-center space-x-2 w-full mt-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={logout}
            className="flex items-center justify-center w-full mt-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
