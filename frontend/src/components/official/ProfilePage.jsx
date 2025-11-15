// src/pages/official/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Shield,
  Loader2,
  AlertCircle,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Dummy profile data
const DUMMY_PROFILE = {
  id: 1,
  full_name: 'Kiran Kumar',
  email: 'kiran@gov.in',
  phone_number: '+91 98765 43210',
  employee_id: 'EMP001',
  department: 'Public Works Department',
  designation: 'Junior Engineer',
  zone: 'Zone A - Central Delhi',
  account_status: 'active',
  is_active: true,
  created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
};

const ProfilePage = () => {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
  });
  const [error, setError] = useState(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingDummyData(false);

      // Try fetching from user profile endpoint first
      const response = await axios.get(`${API_URL}/api/users/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setProfile(response.data);
        setFormData({
          full_name: response.data.full_name || '',
          phone_number: response.data.phone_number || '',
        });
      } else {
        // Use dummy data if no response
        setProfile(DUMMY_PROFILE);
        setFormData({
          full_name: DUMMY_PROFILE.full_name,
          phone_number: DUMMY_PROFILE.phone_number,
        });
        setUsingDummyData(true);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      
      // Extract error message
      let errorMessage = 'Failed to load profile';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }
      
      setError(errorMessage);
      
      // Use dummy data on error
      setProfile(DUMMY_PROFILE);
      setFormData({
        full_name: DUMMY_PROFILE.full_name,
        phone_number: DUMMY_PROFILE.phone_number,
      });
      setUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      
      const response = await axios.put(
        `${API_URL}/api/users/me/profile`,
        {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);
      setEditing(false);
      setError(null);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      
      let errorMessage = 'Failed to update profile';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData({
      full_name: profile.full_name || '',
      phone_number: profile.phone_number || '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{error || 'Profile not found'}</p>
        <Button onClick={fetchProfile} className="mt-4">
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>
        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>


      {/* Error Banner */}
      {error && !usingDummyData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-900">Notice</h3>
            <p className="text-sm text-yellow-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <Card className="p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {profile.full_name}
            </h2>
            <p className="text-gray-600 mb-4">
              {profile.designation} • {profile.department}
            </p>
            <div className="flex items-center gap-2">
              {profile.account_status === 'active' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Active
                </span>
              )}
              {profile.is_active && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Email Address
            </label>
            <Input
              type="email"
              value={profile.email}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              Phone Number
            </label>
            <Input
              type="tel"
              value={editing ? formData.phone_number : profile.phone_number || 'N/A'}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              disabled={!editing}
              className={editing ? '' : 'bg-gray-50'}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Full Name
            </label>
            <Input
              type="text"
              value={editing ? formData.full_name : profile.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              disabled={!editing}
              className={editing ? '' : 'bg-gray-50'}
            />
          </div>

          {/* Employee ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              Employee ID
            </label>
            <Input
              type="text"
              value={profile.employee_id}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              Department
            </label>
            <Input
              type="text"
              value={profile.department}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              Designation
            </label>
            <Input
              type="text"
              value={profile.designation}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Zone */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Zone Assignment
            </label>
            <Input
              type="text"
              value={profile.zone}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Action Buttons */}
        {editing && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              onClick={handleCancelEdit}
              disabled={saving}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}

        {/* Account Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>
            Member since{' '}
            {new Date(profile.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
