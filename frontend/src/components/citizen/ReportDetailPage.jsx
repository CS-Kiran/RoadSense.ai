import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Camera,
  Star,
  Loader2,
  User,
  Calendar,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from '@/api/axios';

const ReportDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      const response = await axios.get(`/reports/${id}`);
      setReport(response.data.data);
      
      if (response.data.data.status === 'resolved' && !response.data.data.userrating) {
        setShowRating(true);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await axios.post(`/reports/${id}/comments`, { content: comment });
      setComment('');
      fetchReportDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleRating = async (value) => {
    try {
      await axios.post(`/reports/${id}/rate`, { rating: value });
      setRating(value);
      setShowRating(false);
      fetchReportDetails();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        gradient: 'from-amber-500 to-orange-600',
        icon: Clock
      },
      acknowledged: { 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        gradient: 'from-blue-500 to-blue-600',
        icon: AlertCircle
      },
      inprogress: { 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        gradient: 'from-purple-500 to-purple-600',
        icon: TrendingUp
      },
      resolved: { 
        color: 'bg-green-100 text-green-700 border-green-200',
        gradient: 'from-green-500 to-green-600',
        icon: CheckCircle
      },
      rejected: { 
        color: 'bg-red-100 text-red-700 border-red-200',
        gradient: 'from-red-500 to-red-600',
        icon: AlertCircle
      }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading report details...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="text-gray-400" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report not found</h2>
        <p className="text-gray-600 mb-6">The report you're looking for doesn't exist.</p>
        <Link to="/citizen/reports">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
            Back to Reports
          </Button>
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6 pb-8">
      {/* Back Button */}
      <Link 
        to="/citizen/reports" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Reports
      </Link>

      {/* Header with Status */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${statusConfig.gradient} p-8 text-white shadow-xl`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <StatusIcon size={24} />
                <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                  {report.status.toUpperCase()}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                  {report.categoryname}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
              <p className="text-white/90">Report #{report.reportnumber}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Calendar className="mb-2" size={20} />
              <p className="text-sm opacity-90">Submitted</p>
              <p className="font-semibold">{new Date(report.createdat).toLocaleDateString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Eye className="mb-2" size={20} />
              <p className="text-sm opacity-90">Views</p>
              <p className="font-semibold">{report.viewcount || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <TrendingUp className="mb-2" size={20} />
              <p className="text-sm opacity-90">Severity</p>
              <p className="font-semibold">{report.severity}/10</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          {report.reportmedia && report.reportmedia.length > 0 && (
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Camera className="mr-2 text-blue-600" size={24} />
                Evidence Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {report.reportmedia.map((media, index) => (
                  <div key={media.id} className="group relative">
                    <img
                      src={media.fileurl}
                      alt={`Report photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl cursor-pointer group-hover:scale-105 transition-transform shadow-md"
                      onClick={() => window.open(media.fileurl, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all flex items-center justify-center">
                      <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Description */}
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{report.description}</p>
            
            {report.landmark && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <MapPin className="inline text-blue-600 mr-2" size={16} />
                <span className="font-semibold text-blue-900">Nearby Landmark:</span>
                <span className="text-blue-800 ml-2">{report.landmark}</span>
              </div>
            )}
          </Card>

          {/* Comments */}
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="mr-2 text-blue-600" size={24} />
              Comments & Updates
            </h2>
            
            <div className="space-y-4 mb-6">
              {report.comments && report.comments.length > 0 ? (
                report.comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 flex items-center">
                        {comment.isofficial ? (
                          <>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-2">
                              Official
                            </span>
                            Official Response
                          </>
                        ) : (
                          <>
                            <User size={14} className="mr-1" />
                            You
                          </>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdat).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-xl">
                  No comments yet. Be the first to add one!
                </p>
              )}
            </div>

            {/* Add Comment */}
            <div className="border-t pt-4">
              <Textarea
                placeholder="Add a comment or question..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-3 min-h-[100px]"
                rows={3}
              />
              <Button 
                onClick={handleAddComment} 
                disabled={!comment.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <MessageSquare size={16} className="mr-2" />
                Post Comment
              </Button>
            </div>
          </Card>

          {/* Rating */}
          {showRating && (
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Rate This Resolution</h2>
              <p className="text-gray-700 mb-4">
                How satisfied are you with how this issue was resolved?
              </p>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRating(value)}
                    className="focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      size={40}
                      className={`${
                        value <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Info */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Report Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <Badge className={statusConfig.color}>
                  {report.categoryname}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Severity Level</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        report.severity >= 7 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        report.severity >= 4 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${(report.severity / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{report.severity}/10</span>
                </div>
              </div>

              {report.assignedtoname && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned To</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <p className="text-gray-900 font-medium">{report.assignedtoname}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900">
              <MapPin className="mr-2 text-blue-600" size={20} />
              Location
            </h3>
            <p className="text-gray-700 mb-4 text-sm">{report.address}</p>
            
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-3">
              <MapPin className="text-blue-600" size={48} />
            </div>
            
            <Button variant="outline" className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500">
              View on Map
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;