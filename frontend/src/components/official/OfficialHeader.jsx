// src/components/official/OfficialHeader.jsx
import React, { useState, useEffect } from 'react';
import { Bell, Search, HelpCircle, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const OfficialHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Mock notifications - replace with API call
    setNotifications([
      { id: 1, title: 'New report assigned', isread: false },
      { id: 2, title: 'Report #1002 updated', isread: false },
      { id: 3, title: 'Team meeting at 3 PM', isread: true },
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/official/reports?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 backdrop-blur-xl bg-white/95">
      <div className="flex items-center justify-between gap-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search reports, teams, or zones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl transition-all"
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Help Button */}
          <Link
            to="/official/help"
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative group"
          >
            <HelpCircle className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </Link>

          {/* Settings Button */}
          <Link
            to="/official/settings"
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative group"
          >
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative group"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            !notification.isread ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              !notification.isread
                                ? 'font-semibold text-gray-900'
                                : 'text-gray-600'
                            }`}
                          >
                            {notification.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/official/notifications"
                  className="block p-3 text-center text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                  onClick={() => setShowNotifications(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          {/* User Profile */}
          <Link
            to="/official/profile"
            className="flex items-center gap-3 pl-4 pr-2 py-2 hover:bg-gray-100 rounded-xl transition-all group"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 text-right">
                {user?.full_name || user?.email || 'Official User'}
              </p>
              <p className="text-xs text-gray-600 text-right">
                {user?.designation || 'Government Official'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl transition-all">
              {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default OfficialHeader;
