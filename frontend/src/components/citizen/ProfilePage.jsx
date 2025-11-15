import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/api/axios';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [personalInfo, setPersonalInfo] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    profile_image_url: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/me/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('👤 Profile data:', response.data);

      setPersonalInfo({
        full_name: response.data.full_name || '',
        email: response.data.email || '',
        phone_number: response.data.phone_number || '',
        profile_image_url: response.data.profile_image_url || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handlePersonalInfoUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('/api/users/me/profile', personalInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (updateUser) {
        updateUser(response.data.data);
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 5000);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/users/change-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Upload image
      const uploadResponse = await axios.post('/api/upload/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const imageUrl = uploadResponse.data.data.url;
      console.log('📸 Uploaded image URL:', imageUrl);

      // Update profile with new image URL
      await axios.patch(
        '/api/users/me/profile',
        { profile_image_url: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setPersonalInfo({ ...personalInfo, profile_image_url: imageUrl });

      // Update auth context
      if (updateUser) {
        updateUser({ profile_image_url: imageUrl });
      }

      setSuccess('Profile image updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (url) => {
    if (!url) return null;
    
    // If already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If relative URL, prepend backend base URL
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseURL}${url}`;
  };

  const profileImageUrl = getImageUrl(personalInfo.profile_image_url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="p-6 shadow-xl border-0">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ Image failed to load:', profileImageUrl);
                        e.target.style.display = 'none';
                      }}
                      onLoad={() => console.log('✅ Image loaded successfully:', profileImageUrl)}
                    />
                  ) : (
                    <User className="w-12 h-12" />
                  )}
                </div>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="profile-image"
                  className={`absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{personalInfo.full_name || 'User'}</h3>
                <p className="text-sm text-slate-600">{personalInfo.email}</p>
                <p className="text-xs text-slate-500 mt-2">JPG, PNG or WEBP (max 10MB)</p>
                {profileImageUrl && (
                  <p className="text-xs text-slate-400 mt-1">
                    Current: {personalInfo.profile_image_url}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6 shadow-xl border-0">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h2>
            <form onSubmit={handlePersonalInfoUpdate} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={personalInfo.full_name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, full_name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  disabled
                  className="bg-slate-100 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number (Optional)</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={personalInfo.phone_number}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, phone_number: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="p-6 shadow-xl border-0">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                Change Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
