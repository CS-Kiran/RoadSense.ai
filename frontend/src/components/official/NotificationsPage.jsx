// src/pages/official/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle,
  Info,
  AlertTriangle,
  Clock,
  BellOff,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Dummy notifications with Indian context
const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'report_assigned',
    title: 'New Report Assigned',
    description: 'Pothole issue on Connaught Place Road has been assigned to you',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_read: false,
    priority: 'high',
  },
  {
    id: 2,
    type: 'status_update',
    title: 'Report Status Changed',
    description: 'Report #1002 status updated to In Progress',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    is_read: false,
    priority: 'medium',
  },
  {
    id: 3,
    type: 'deadline_reminder',
    title: 'Deadline Approaching',
    description: 'Report #1001 deadline is tomorrow at 5:00 PM',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_read: true,
    priority: 'high',
  },
  {
    id: 4,
    type: 'resolved',
    title: 'Report Resolved',
    description: 'Street light issue on MG Road has been marked as resolved',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    is_read: true,
    priority: 'low',
  },
];

const NotificationsPage = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingDummyData(false);

      const response = await axios.get(`${API_URL}/api/official/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.notifications && response.data.notifications.length > 0) {
        setNotifications(response.data.notifications);
      } else {
        // Use dummy data if empty
        setNotifications(DUMMY_NOTIFICATIONS);
        setUsingDummyData(true);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      
      // Extract error message
      let errorMessage = 'Failed to load notifications';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }
      
      setError(errorMessage);
      
      // Use dummy data on error
      setNotifications(DUMMY_NOTIFICATIONS);
      setUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      report_assigned: FileText,
      status_update: Info,
      deadline_reminder: Clock,
      resolved: CheckCircle,
      alert: AlertTriangle,
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (priority) => {
    const colors = {
      high: 'border-l-4 border-l-red-500 bg-red-50',
      medium: 'border-l-4 border-l-yellow-500 bg-yellow-50',
      low: 'border-l-4 border-l-blue-500 bg-blue-50',
    };
    return colors[priority] || 'border-l-4 border-l-gray-300 bg-gray-50';
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return styles[priority] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Stay updated with your assignments</p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-500 text-white px-4 py-2 text-lg">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Error Banner */}
      {error && !usingDummyData && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && !loading && !usingDummyData ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            You're all caught up!
          </h3>
          <p className="text-gray-600">
            No new notifications at the moment. Check back later for updates.
          </p>
        </Card>
      ) : (
        /* Notifications List */
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <Card
                key={notification.id}
                className={`p-5 hover:shadow-md transition-all cursor-pointer ${
                  getNotificationColor(notification.priority)
                } ${!notification.is_read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.is_read ? 'bg-gray-200' : 'bg-blue-100'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        notification.is_read ? 'text-gray-500' : 'text-blue-600'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3
                        className={`font-semibold ${
                          notification.is_read ? 'text-gray-700' : 'text-gray-900'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <Badge
                        className={`${getPriorityBadge(notification.priority)} border flex-shrink-0`}
                      >
                        {notification.priority}
                      </Badge>
                    </div>

                    <p
                      className={`text-sm mb-3 ${
                        notification.is_read ? 'text-gray-600' : 'text-gray-700'
                      }`}
                    >
                      {notification.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(notification.created_at)}</span>
                      </div>

                      {!notification.is_read && (
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
