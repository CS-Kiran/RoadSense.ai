import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Trash2,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReportDetails();
    fetchReportHistory();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast({
        title: "Error",
        description: "Failed to load report details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReportHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reports/${id}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleCloseReport = async () => {
    if (!window.confirm("Are you sure you want to close this report?")) return;

    try {
      await axios.patch(`http://localhost:8000/api/reports/${id}/close`, {
        comment: "Report closed by user",
      });
      toast({
        title: "Success",
        description: "Report closed successfully",
      });
      fetchReportDetails();
      fetchReportHistory();
    } catch (error) {
      console.error("Error closing report:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to close report",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReport = async () => {
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:8000/api/reports/${id}`);
      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
      navigate("/citizen/my-reports");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.detail ||
          "Failed to delete report. You can only delete reports within 24 hours of creation.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
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

  const canDeleteReport = () => {
    if (!report) return false;
    const createdAt = new Date(report.created_at);
    const now = new Date();
    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
    return hoursSinceCreation < 24;
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
        <div className="mb-6 flex items-center justify-between">
          <Link to="/citizen/reports">
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={18} />
              Back to Reports
            </Button>
          </Link>
          <div className="flex gap-2">
            {report.status !== "closed" && (
              <Button variant="outline" onClick={handleCloseReport}>
                <XCircle className="mr-2" size={18} />
                Close Report
              </Button>
            )}
            {canDeleteReport() && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2" size={18} />
                Delete
              </Button>
            )}
          </div>
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
                        onClick={() => setSelectedImage(image)}
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

            {/* Status History */}
            {history.length > 0 && (
              <Card className="p-6 shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                  <Clock className="mr-2 text-blue-600" size={20} />
                  Status History
                </h3>
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start space-x-3 pb-4 border-b last:border-b-0"
                    >
                      <div className="bg-blue-100 rounded-full p-2 mt-1">
                        <Clock className="text-blue-600" size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-800">
                            {entry.old_status && (
                              <>
                                {entry.old_status.replace(/_/g, " ")} →{" "}
                              </>
                            )}
                            {entry.new_status.replace(/_/g, " ").toUpperCase()}
                          </p>
                          <Badge className="bg-blue-600 text-white text-xs">
                            {entry.changed_by_role}
                          </Badge>
                        </div>
                        {entry.comment && (
                          <p className="text-sm text-gray-600 mb-1">{entry.comment}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(entry.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
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
                <div>
                  <p className="text-sm text-gray-500 mb-1">Anonymous Report</p>
                  <p className="font-medium text-gray-800">
                    {report.is_anonymous ? "Yes" : "No"}
                  </p>
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
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Report Image</DialogTitle>
            </DialogHeader>
            <img
              src={`${axios.defaults.baseURL}/api/reports/images/${selectedImage.filename}`}
              alt="Report"
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
              Reports can only be deleted within 24 hours of creation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReport}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2" size={16} />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDetailPage;