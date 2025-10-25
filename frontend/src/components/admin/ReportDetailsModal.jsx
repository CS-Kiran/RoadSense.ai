// src/components/admin/ReportDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Clock,
  TrendingUp,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ReportDetailsModal = ({ reportId, isOpen, onClose, onUpdate }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // details, images, comments, history

  useEffect(() => {
    if (isOpen && reportId) {
      fetchReportDetails();
    }
  }, [isOpen, reportId]);

  const fetchReportDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/admin/reports/${reportId}`);

      if (response.ok) {
        const data = await response.json();
        setReport(data);
        setSelectedStatus(data.status);
        setSelectedPriority(data.priority);
      } else {
        setError('Failed to load report details');
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      setError('Unable to load report details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === report?.status) return;

    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/reports/${reportId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: selectedStatus }),
        }
      );

      if (response.ok) {
        await fetchReportDetails();
        if (onUpdate) onUpdate();
        alert('Status updated successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePriority = async () => {
    if (!selectedPriority || selectedPriority === report?.priority) return;

    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/reports/${reportId}/priority`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority: selectedPriority }),
        }
      );

      if (response.ok) {
        await fetchReportDetails();
        if (onUpdate) onUpdate();
        alert('Priority updated successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to update priority: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Failed to update priority');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Report Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : error ? (
                <div className="p-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              ) : report ? (
                <>
                  {/* Report Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {report.title}
                        </h3>
                        <p className="text-gray-600">{report.description}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={`${getStatusColor(report.status)} border`}>
                        {report.status?.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {report.issue_type?.replace('_', ' ')}
                      </Badge>
                      {report.is_anonymous && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-600">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Anonymous
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {report.upvotes || 0} upvotes
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {report.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {report.comments_count || 0} comments
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <div className="flex px-6">
                      {['details', 'images', 'comments', 'history'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-3 font-medium text-sm capitalize transition-colors border-b-2 ${
                            activeTab === tab
                              ? 'border-purple-600 text-purple-600'
                              : 'border-transparent text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {tab}
                          {tab === 'images' && report.images?.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                              {report.images.length}
                            </span>
                          )}
                          {tab === 'comments' && report.comments?.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {report.comments.length}
                            </span>
                          )}
                          {tab === 'history' && report.status_history?.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {report.status_history.length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'details' && (
                      <div className="space-y-6">
                        {/* Location */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-purple-600" />
                            Location
                          </h4>
                          <p className="text-gray-700">{report.address}</p>
                          {report.latitude && report.longitude && (
                            <p className="text-sm text-gray-500 mt-1">
                              Coordinates: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                            </p>
                          )}
                        </div>

                        {/* Reporter */}
                        {report.user && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <User className="w-5 h-5 text-purple-600" />
                              Reported By
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="font-medium text-gray-900">{report.user.full_name}</p>
                              <p className="text-sm text-gray-600">{report.user.email}</p>
                              {report.user.phone_number && (
                                <p className="text-sm text-gray-600">{report.user.phone_number}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Assigned Official */}
                        {report.assigned_official && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-purple-600" />
                              Assigned To
                            </h4>
                            <div className="bg-blue-50 rounded-lg p-4">
                              <p className="font-medium text-gray-900">{report.assigned_official.full_name}</p>
                              <p className="text-sm text-gray-600">{report.assigned_official.email}</p>
                              <p className="text-sm text-gray-600">{report.assigned_official.department}</p>
                              {report.assigned_official.designation && (
                                <p className="text-sm text-gray-600">{report.assigned_official.designation}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Timestamps */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            Timeline
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Created:</span>
                              <span className="font-medium text-gray-900">
                                {new Date(report.created_at).toLocaleString()}
                              </span>
                            </div>
                            {report.updated_at && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Updated:</span>
                                <span className="font-medium text-gray-900">
                                  {new Date(report.updated_at).toLocaleString()}
                                </span>
                              </div>
                            )}
                            {report.resolved_at && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Resolved:</span>
                                <span className="font-medium text-green-700">
                                  {new Date(report.resolved_at).toLocaleString()}
                                </span>
                              </div>
                            )}
                            {report.closed_at && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Closed:</span>
                                <span className="font-medium text-gray-900">
                                  {new Date(report.closed_at).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-4">Update Status & Priority</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                              </label>
                              <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                                <option value="closed">Closed</option>
                              </select>
                              <Button
                                onClick={handleUpdateStatus}
                                disabled={updating || selectedStatus === report.status}
                                className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                              >
                                {updating ? 'Updating...' : 'Update Status'}
                              </Button>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                              </label>
                              <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                              </select>
                              <Button
                                onClick={handleUpdatePriority}
                                disabled={updating || selectedPriority === report.priority}
                                className="w-full mt-2 bg-orange-600 hover:bg-orange-700"
                              >
                                {updating ? 'Updating...' : 'Update Priority'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'images' && (
                      <div>
                        {report.images && report.images.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {report.images.map((image, index) => (
                              <div key={image.id} className="relative group">
                                <img
                                  src={`http://localhost:8000${image.file_path}`}
                                  alt={`Report image ${index + 1}`}
                                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                                  <a
                                    href={`http://localhost:8000${image.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Button variant="outline" size="sm" className="bg-white">
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Full
                                    </Button>
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No images attached</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'comments' && (
                      <div>
                        {report.comments && report.comments.length > 0 ? (
                          <div className="space-y-4">
                            {report.comments.map((comment) => (
                              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {comment.user_role}
                                    </Badge>
                                    {comment.is_internal && (
                                      <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                        Internal
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-gray-700">{comment.comment}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No comments yet</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'history' && (
                      <div>
                        {report.status_history && report.status_history.length > 0 ? (
                          <div className="space-y-4">
                            {report.status_history.map((history, index) => (
                              <div key={history.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                  </div>
                                  {index < report.status_history.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                                  )}
                                </div>
                                <div className="flex-1 pb-8">
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      {history.old_status && (
                                        <>
                                          <Badge className={getStatusColor(history.old_status)}>
                                            {history.old_status}
                                          </Badge>
                                          <span className="text-gray-400">→</span>
                                        </>
                                      )}
                                      <Badge className={getStatusColor(history.new_status)}>
                                        {history.new_status}
                                      </Badge>
                                    </div>
                                    {history.comment && (
                                      <p className="text-sm text-gray-700 mb-2">{history.comment}</p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>Changed by {history.changed_by_role}</span>
                                      <span>•</span>
                                      <span>{new Date(history.created_at).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No status history</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
