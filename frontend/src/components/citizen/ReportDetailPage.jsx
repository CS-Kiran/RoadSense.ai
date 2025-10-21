// src/components/citizen/ReportDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/api/axios";

const ReportDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      const response = await axios.get(`/api/reports/${id}`);
      setReport(response.data);
      
      // Show rating if report is resolved
      if (response.data.status === "resolved" && !response.data.user_rating) {
        setShowRating(true);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      await axios.post(`/api/reports/${id}/comments`, {
        comment: comment,
        is_internal: false,
      });
      setComment("");
      fetchReportDetails();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleRating = async (value) => {
    try {
      await axios.post(`/api/reports/${id}/rate`, {
        rating: value,
      });
      setRating(value);
      setShowRating(false);
      fetchReportDetails();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        gradient: "from-amber-500 to-orange-600",
        icon: Clock,
      },
      under_review: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        gradient: "from-blue-500 to-blue-600",
        icon: AlertCircle,
      },
      in_progress: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        gradient: "from-purple-500 to-purple-600",
        icon: TrendingUp,
      },
      resolved: {
        color: "bg-green-100 text-green-700 border-green-200",
        gradient: "from-green-500 to-green-600",
        icon: CheckCircle,
      },
      closed: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        gradient: "from-gray-500 to-gray-600",
        icon: CheckCircle,
      },
      rejected: {
        color: "bg-red-100 text-red-700 border-red-200",
        gradient: "from-red-500 to-red-600",
        icon: XCircle,
      },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const getIssueTypeLabel = (issueType) => {
    const labels = {
      pothole: "Pothole",
      crack: "Road Crack",
      debris: "Debris",
      faded_marking: "Faded Marking",
      street_light: "Street Light",
      traffic_sign: "Traffic Sign",
      drainage: "Drainage",
      other: "Other",
    };
    return labels[issueType] || issueType;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      high: "bg-orange-100 text-orange-700 border-orange-200",
      critical: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[priority] || colors.medium;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">
            The report you're looking for doesn't exist.
          </p>
          <Link to="/citizen/my-reports">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2" size={18} />
              Back to Reports
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(report.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/citizen/my-reports">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2" size={18} />
              Back to Reports
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Report Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge
                      className={`${statusConfig.color} border px-3 py-1 text-sm font-semibold`}
                    >
                      <StatusIcon className="mr-1" size={16} />
                      {report.status.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                    <Badge
                      className={`${getPriorityColor(report.priority)} border px-3 py-1 text-sm font-semibold`}
                    >
                      {getPriorityLabel(report.priority)}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {report.title}
                  </h1>
                </div>
              </div>

              {/* Report Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="text-gray-400" size={18} />
                  <div>
                    <p className="text-gray-500 text-xs">Submitted</p>
                    <p className="font-medium text-gray-700">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Eye className="text-gray-400" size={18} />
                  <div>
                    <p className="text-gray-500 text-xs">Views</p>
                    <p className="font-medium text-gray-700">{report.views || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <AlertCircle className="text-gray-400" size={18} />
                  <div>
                    <p className="text-gray-500 text-xs">Report ID</p>
                    <p className="font-medium text-gray-700">#{report.id}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{report.description}</p>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 text-lg flex items-center">
                  <MapPin className="mr-2 text-blue-600" size={20} />
                  Location
                </h3>
                <p className="text-gray-700">{report.address}</p>
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Coordinates:</span> {report.latitude.toFixed(6)},{" "}
                  {report.longitude.toFixed(6)}
                </div>
              </div>

              {/* Images */}
              {report.images && report.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg flex items-center">
                    <Camera className="mr-2 text-blue-600" size={20} />
                    Photos ({report.images.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {report.images.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all"
                      >
                        <img
                          src={`${axios.defaults.baseURL}/api/reports/images/${image.filename}`}
                          alt={`Report image ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <Camera
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            size={32}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Comments Section */}
            <Card className="p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                <MessageSquare className="mr-2 text-blue-600" size={20} />
                Comments & Updates
              </h3>

              {/* Comment List */}
              <div className="space-y-4 mb-6">
                {report.comments && report.comments.length > 0 ? (
                  report.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-4 rounded-lg border-2 ${
                        comment.is_internal || comment.user_role === "official"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="text-gray-500" size={16} />
                          <span className="font-medium text-gray-800">
                            {comment.user_role === "official" ? (
                              <>
                                <Badge className="bg-blue-600 text-white text-xs mr-2">
                                  Official
                                </Badge>
                                Official Response
                              </>
                            ) : (
                              "User"
                            )}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to add one!
                  </p>
                )}
              </div>

              {/* Add Comment */}
              <div className="border-t pt-4">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or update..."
                  rows={3}
                  className="w-full mb-3"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageSquare className="mr-2" size={18} />
                  Add Comment
                </Button>
              </div>
            </Card>

            {/* Rating Section */}
            {showRating && (
              <Card className="p-6 shadow-lg bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                  How satisfied are you with how this issue was resolved?
                </h3>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleRating(value)}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={32}
                        className={
                          value <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card className="p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                Report Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-gray-800">
                    {getIssueTypeLabel(report.issue_type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Priority Level</p>
                  <Badge className={`${getPriorityColor(report.priority)} border`}>
                    {getPriorityLabel(report.priority)}
                  </Badge>
                </div>
                {report.assigned_to && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium text-gray-800">
                      Official #{report.assigned_to}
                    </p>
                  </div>
                )}
                {report.assigned_zone && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Zone</p>
                    <p className="font-medium text-gray-800">{report.assigned_zone}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Timeline Card */}
            <Card className="p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Clock className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Created</p>
                    <p className="text-xs text-gray-600">
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {report.updated_at && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <TrendingUp className="text-purple-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Last Updated</p>
                      <p className="text-xs text-gray-600">
                        {new Date(report.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {report.resolved_at && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <CheckCircle className="text-green-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Resolved</p>
                      <p className="text-xs text-gray-600">
                        {new Date(report.resolved_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {report.closed_at && (
                  <div className="flex items-start space-x-3">
                    <div className="bg-gray-100 rounded-full p-2">
                      <CheckCircle className="text-gray-600" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Closed</p>
                      <p className="text-xs text-gray-600">
                        {new Date(report.closed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Map Preview */}
            <Card className="p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                Location Map
              </h3>
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <MapPin className="text-gray-400" size={48} />
              </div>
              <p className="text-xs text-gray-600 mt-2">{report.address}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
