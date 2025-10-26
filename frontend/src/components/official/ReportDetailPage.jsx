// src/pages/official/ReportDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Camera,
  Loader2,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // TODO: Fetch report details from API
    setTimeout(() => {
      setReport({
        id: id,
        title: 'Large pothole on Main Street',
        description: 'There is a dangerous pothole causing issues...',
        status: 'pending',
        priority: 'high',
        address: '123 Main St, Downtown',
        latitude: 40.7128,
        longitude: -74.0060,
        created_at: new Date().toISOString(),
        citizen: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        images: [],
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    // TODO: Update report status via API
    setTimeout(() => {
      setReport({ ...report, status: newStatus });
      setUpdating(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!report) {
    return <div>Report not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Button onClick={() => navigate(-1)} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">{report.title}</h1>

            <div className="flex gap-2 mb-4">
              <Badge className={report.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}>
                {report.status}
              </Badge>
              <Badge className="bg-red-100 text-red-700">{report.priority} priority</Badge>
            </div>

            <p className="text-slate-700 mb-6">{report.description}</p>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                <span>{report.address}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-slate-500" />
                <span>{new Date(report.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-slate-500" />
                <span>{report.citizen.name} ({report.citizen.email})</span>
              </div>
            </div>
          </Card>

          {/* Status Update */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Update Status</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={updating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Mark In Progress
              </Button>
              <Button
                onClick={() => handleStatusUpdate('resolved')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Resolved
              </Button>
            </div>
          </Card>

          {/* Comments */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Add Comment</h3>
            <Textarea
              placeholder="Add a comment or update..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <Button className="mt-4">Post Comment</Button>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Report Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">Report ID</p>
                <p className="font-medium">#{report.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Coordinates</p>
                <p className="font-medium">
                  {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
