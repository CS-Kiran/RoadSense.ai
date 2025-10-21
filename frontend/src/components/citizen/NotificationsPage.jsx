import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '@/api/axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(filter !== 'all' && { isRead: filter === 'read' })
      });
      const response = await axios.get(`/notifications?${params}`);
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const configs = {
      status_update: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
      resolved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
      comment: { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
      system: { icon: Info, color: 'text-gray-600', bg: 'bg-gray-100' },
      default: { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-100' }
    };
    const config = configs[type] || configs.default;
    const Icon = config.icon;
    return { Icon, ...config };
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isread;
    if (filter === 'read') return n.isread;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isread).length;

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 via-rose-700 to-red-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Bell size={32} />
              <h1 className="text-3xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-1">
                  {unreadCount} New
                </Badge>
              )}
            </div>
            <p className="text-pink-100 text-lg">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : "You're all caught up! 🎉"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              className="bg-white text-pink-600 hover:bg-pink-50 shadow-lg"
            >
              <CheckCheck size={20} className="mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center space-x-3">
          <Filter className="text-blue-600" size={20} />
          <div className="flex space-x-2 flex-1">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
              className={filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              size="sm"
              className={filter === 'unread' ? 'bg-gradient-to-r from-amber-600 to-orange-700' : ''}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              onClick={() => setFilter('read')}
              size="sm"
              className={filter === 'read' ? 'bg-gradient-to-r from-green-600 to-green-700' : ''}
            >
              Read ({notifications.length - unreadCount})
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 font-medium">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-16 text-center border-0 shadow-lg">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <BellOff className="text-gray-400" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">
            {filter === 'unread' 
              ? "You're all caught up! Great job staying on top of things." 
              : "You don't have any notifications yet."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const { Icon, color, bg } = getNotificationIcon(notification.type);
            
            return (
              <Card
                key={notification.id}
                className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all ${
                  !notification.isread ? 'bg-gradient-to-r from-blue-50 to-indigo-50 ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`${bg} p-3 rounded-xl flex-shrink-0`}>
                    <Icon className={color} size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 flex items-center">
                        {notification.title}
                        {!notification.isread && (
                          <Sparkles className="ml-2 text-blue-600 animate-pulse" size={16} />
                        )}
                      </h3>
                      {!notification.isread && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          New
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdat).toLocaleString()}
                      </p>

                      <div className="flex items-center space-x-2">
                        {notification.actionurl && (
                          <Link to={notification.actionurl}>
                            <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600">
                              View Details
                            </Button>
                          </Link>
                        )}

                        {!notification.isread && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <CheckCheck size={16} />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
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
