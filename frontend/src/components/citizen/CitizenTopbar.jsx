import React, { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from '@/api/axios';

const CitizenTopbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/notifications?limit=5');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isread).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/citizen/reports?search=${searchQuery}`;
    }
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by ID, location, or category..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center space-x-3 ml-6">
          {/* Help Button */}
          <Link
            to="/citizen/help"
            className="p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group"
            title="Help Center"
          >
            <HelpCircle size={22} className="group-hover:scale-110 transition-transform" />
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group"
            >
              <Bell size={22} className="group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full px-1.5 shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[32rem] overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <Bell size={18} className="mr-2 text-blue-600" />
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-96">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 font-medium">No notifications</p>
                        <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <Link
                            key={notification.id}
                            to={notification.actionurl || '/citizen/notifications'}
                            className={`block p-4 hover:bg-gray-50 transition-colors ${
                              !notification.isread ? 'bg-blue-50/50' : ''
                            }`}
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                !notification.isread ? 'bg-blue-600' : 'bg-gray-300'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(notification.createdat).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/citizen/notifications"
                    className="block p-3 text-center text-sm text-blue-600 hover:bg-blue-50 font-semibold border-t border-gray-100 transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All Notifications →
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* User Avatar */}
          <Link to="/citizen/profile" className="group">
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-all">
              {user?.profileimageurl ? (
                <img
                  src={user.profileimageurl}
                  alt={user?.fullname}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-500 transition-all"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center ring-2 ring-gray-200 group-hover:ring-blue-500 transition-all">
                  <span className="text-white font-semibold text-sm">
                    {user?.fullname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CitizenTopbar;
