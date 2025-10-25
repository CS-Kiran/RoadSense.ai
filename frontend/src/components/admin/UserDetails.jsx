// src/pages/admin/UserDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Shield, CheckCircle, XCircle } from 'lucide-react';

const UserDetails = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userType = searchParams.get('type') || 'user';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}?user_type=${userType}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setError(null);
      } else {
        setError('Failed to load user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Unable to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/status?user_type=${userType}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ account_status: newStatus }),
        }
      );

      if (response.ok) {
        await fetchUserDetails();
        alert(`User status updated to ${newStatus}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-600">User not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </Button>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.full_name}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
          <Badge className="text-lg px-4 py-2 bg-purple-100 text-purple-700">
            {user.role}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 font-medium">Phone</p>
            <p className="text-gray-900 mt-1">{user.phone_number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Status</p>
            <Badge className={`mt-1 ${
              user.account_status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' :
              user.account_status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {user.account_status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Active Status</p>
            <p className="text-gray-900 mt-1">{user.is_active ? '✅ Active' : '❌ Inactive'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Joined</p>
            <p className="text-gray-900 mt-1">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Official-specific fields */}
        {userType === 'official' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 font-medium">Employee ID</p>
              <p className="text-gray-900 mt-1">{user.employee_id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Department</p>
              <p className="text-gray-900 mt-1">{user.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Designation</p>
              <p className="text-gray-900 mt-1">{user.designation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Zone</p>
              <p className="text-gray-900 mt-1">{user.zone || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Statistics */}
        {user.statistics && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Total Reports</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {user.statistics.total_reports || 0}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {user.statistics.pending_reports || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Resolved</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {user.statistics.resolved_reports || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
          <Button 
            onClick={() => handleStatusChange('active')} 
            disabled={updating || user.account_status?.toLowerCase() === 'active'}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {updating ? 'Updating...' : 'Activate'}
          </Button>
          <Button 
            onClick={() => handleStatusChange('suspended')} 
            disabled={updating || user.account_status?.toLowerCase() === 'suspended'}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            {updating ? 'Updating...' : 'Suspend'}
          </Button>
          <Button 
            onClick={() => handleStatusChange('blocked')} 
            disabled={updating || user.account_status?.toLowerCase() === 'blocked'}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {updating ? 'Updating...' : 'Block'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserDetails;
