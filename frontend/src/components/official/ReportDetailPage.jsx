// src/pages/official/ReportDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, User, Camera, Loader2, CheckCircle, TrendingUp, AlertCircle, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [comment, setComment] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/official/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReport(response.data);
    } catch (err) {
      console.error('Error fetching report details:', err);
      setError(err.response?.data?.detail || 'Failed to load report details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);

      await axios.put(
        `${API_URL}/api/official/reports/${id}/status`,
        {
          status: newStatus,
          comment: statusComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatusComment('');
      await fetchReportDetails();
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.detail || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      await axios.post(
        `${API_URL}/api/official/reports/${id}/comments`,
        {
          comment: comment,
          is_internal: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment('');
      await fetchReportDetails();
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.detail || 'Failed to add comment');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">{error || 'Report not found'}</p>
          <Button onClick={() => navigate('/official/reports')} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/official/reports')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
          <p className="text-gray-600 mt-1">Report #{report.id}</p>
        </div>
        <Badge className={`text-lg px-4 py-2 ${
          report.priority === 'critical' ? 'bg-red-100 text-red-700' :
          report.priority === 'high' ? 'bg-orange-100 text-orange-700' :
          report.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {report.priority.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>

            {report.images && report.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Images ({report.images.length})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {report.images.map((image) => (
                    <img
                      key={image.id}
                      src={`${API_URL}/${image.file_path}`}
                      alt={image.filename}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Status Update */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Update Status</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="Add a comment about the status update (optional)"
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
                rows={3}
              />
              <div className="flex flex-wrap gap-2">
                {['under_review', 'in_progress', 'resolved', 'rejected'].map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating || report.status === status}
                    className={
                      status === 'under_review' ? 'bg-blue-600' :
                      status === 'in_progress' ? 'bg-purple-600' :
                      status === 'resolved' ? 'bg-green-600' :
                      'bg-red-600'
                    }
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Mark as {status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Comments */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments ({report.comments?.length || 0})
            </h2>
            
            <div className="space-y-4 mb-4">
              {report.comments?.map((c) => (
                <div key={c.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {c.user_role} User
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-gray-700">{c.comment}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={!comment.trim()}>
                Add Comment
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Report Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Report ID</p>
                <p className="font-medium">#{report.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <Badge className={`${
                  report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  report.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                  report.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {report.status.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600">Issue Type</p>
                <p className="font-medium capitalize">{report.issue_type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-600">Created</p>
                <p className="font-medium">{formatDate(report.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-600">Views</p>
                <p className="font-medium">{report.views}</p>
              </div>
              <div>
                <p className="text-gray-600">Upvotes</p>
                <p className="font-medium">{report.upvotes}</p>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">{report.address}</p>
              <p className="text-gray-600">
                Coordinates: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
              </p>
            </div>
          </Card>

          {/* Citizen Info */}
          {!report.is_anonymous && report.citizen && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Reporter
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{report.citizen.name}</p>
                <p className="text-gray-600">{report.citizen.email}</p>
              </div>
            </Card>
          )}

          {/* Status History */}
          {report.status_history && report.status_history.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Status History</h3>
              <div className="space-y-3">
                {report.status_history.map((history) => (
                  <div key={history.id} className="text-sm">
                    <p className="font-medium">
                      {history.old_status ? `${history.old_status} → ` : ''}
                      {history.new_status}
                    </p>
                    <p className="text-gray-600">{formatDate(history.created_at)}</p>
                    {history.comment && (
                      <p className="text-gray-700 mt-1">{history.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
