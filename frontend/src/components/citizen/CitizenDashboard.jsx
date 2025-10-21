import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  Plus,
  Bell,
  HelpCircle,
  Loader2,
  ArrowUpRight,
  Activity,
  BarChart3,
  Calendar,
  Users,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import axios from '@/api/axios';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    weeklyChange: 0,
    avgResponseTime: '0'
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        axios.get('/reports/stats'),
        axios.get('/reports?limit=5&sort=-createdat')
      ]);
      
      setStats(statsRes.data.data);
      setRecentReports(reportsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.total,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
      link: '/citizen/reports',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-100',
      iconBg: 'bg-amber-500',
      link: '/citizen/reports?status=pending',
      change: '-5%',
      changeType: 'decrease'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      link: '/citizen/reports?status=inprogress',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500',
      link: '/citizen/reports?status=resolved',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        variant: 'secondary', 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-500'
      },
      acknowledged: { 
        variant: 'secondary', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dot: 'bg-blue-500'
      },
      inprogress: { 
        variant: 'default', 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        dot: 'bg-purple-500'
      },
      resolved: { 
        variant: 'success', 
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-500'
      },
      rejected: { 
        variant: 'destructive', 
        color: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500'
      }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const quickActions = [
    {
      title: 'Report New Issue',
      description: 'Submit a new road problem',
      icon: Plus,
      link: '/citizen/report-issue',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      primary: true
    },
    {
      title: 'View Map',
      description: 'Explore nearby issues',
      icon: MapPin,
      link: '/citizen/map',
      color: 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg'
    },
    {
      title: 'Notifications',
      description: 'Check updates',
      icon: Bell,
      link: '/citizen/notifications',
      color: 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg',
      badge: 3
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Welcome back,</p>
              <h1 className="text-3xl font-bold">{user?.fullname || 'Citizen'}</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-blue-200">Today</p>
                <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
          <p className="text-blue-100 text-lg mb-6">
            Help us build better roads for our community
          </p>
          
          {/* Quick Stats in Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Activity className="text-blue-200 mb-2" size={20} />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-blue-200">Total Reports</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Zap className="text-yellow-300 mb-2" size={20} />
              <p className="text-2xl font-bold">{stats.resolved}</p>
              <p className="text-xs text-blue-200">Resolved</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Calendar className="text-green-300 mb-2" size={20} />
              <p className="text-2xl font-bold">{stats.avgResponseTime || '24h'}</p>
              <p className="text-xs text-blue-200">Avg Response</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Users className="text-purple-300 mb-2" size={20} />
              <p className="text-2xl font-bold">95%</p>
              <p className="text-xs text-blue-200">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} to={action.link}>
              <Card className={`${action.color} transition-all duration-300 transform hover:scale-105 cursor-pointer group relative overflow-hidden`}>
                <div className="p-6">
                  {action.badge && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {action.badge}
                    </div>
                  )}
                  <div className={`${action.primary ? 'bg-white/20' : 'bg-blue-50'} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={action.primary ? 'text-white' : 'text-blue-600'} size={24} />
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${action.primary ? 'text-white' : 'text-gray-900'}`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm ${action.primary ? 'text-blue-100' : 'text-gray-600'}`}>
                    {action.description}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link} className="group">
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <ArrowUpRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                  </div>
                  
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                    <div className={`flex items-center text-xs font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp size={14} className="mr-1" />
                      {stat.change}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Reports Section */}
      <Card className="border-0 shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="mr-2 text-blue-600" size={24} />
                Recent Activity
              </h2>
              <p className="text-gray-600 text-sm mt-1">Your latest report submissions</p>
            </div>
            <Link to="/citizen/reports">
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center group">
                View All
                <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {recentReports.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600 font-medium mb-2">No reports yet</p>
              <p className="text-gray-500 text-sm mb-4">Start making a difference in your community</p>
              <Link to="/citizen/report-issue">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center">
                  <Plus size={18} className="mr-2" />
                  Submit Your First Report
                </button>
              </Link>
            </div>
          ) : (
            recentReports.map((report) => {
              const statusConfig = getStatusConfig(report.status);
              return (
                <Link
                  key={report.id}
                  to={`/citizen/reports/${report.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {report.reportnumber}
                        </span>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                          <span className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}></span>
                          {report.status.toUpperCase()}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.categoryname}
                        </Badge>
                      </div>
                      
                      <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {report.address?.substring(0, 50)}...
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {new Date(report.createdat).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {report.reportmedia && report.reportmedia[0] && (
                      <img
                        src={report.reportmedia[0].thumbnailurl || report.reportmedia[0].fileurl}
                        alt="Report"
                        className="w-20 h-20 object-cover rounded-xl ml-4 group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Card>

      {/* Help & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50">
          <Link to="/citizen/map">
            <MapPin className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Interactive Map</h3>
            <p className="text-sm text-gray-600">
              View and explore nearby issues on our interactive map
            </p>
          </Link>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50">
          <Link to="/citizen/notifications">
            <Bell className="text-purple-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Notifications</h3>
            <p className="text-sm text-gray-600">
              Stay updated with responses from officials
            </p>
          </Link>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50">
          <Link to="/citizen/help">
            <HelpCircle className="text-green-600 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Help Center</h3>
            <p className="text-sm text-gray-600">
              FAQs, guides, and support resources
            </p>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;