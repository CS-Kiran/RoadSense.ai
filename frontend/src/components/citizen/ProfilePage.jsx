import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell,
  Save, 
  Camera, 
  CheckCircle,
  Shield,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/api/axios';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [personalInfo, setPersonalInfo] = useState({
    fullname: '',
    email: '',
    phonenumber: '',
    profileimageurl: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    statusUpdates: true,
    comments: true,
    systemAnnouncements: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullname: user.fullname || '',
        email: user.email || '',
        phonenumber: user.phonenumber || '',
        profileimageurl: user.profileimageurl || ''
      });
    }
  }, [user]);

  const handlePersonalInfoUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.patch('/users/me', personalInfo);
      updateUser(response.data.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.patch('/users/notification-preferences', notifications);
      setSuccess('Notification preferences updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const response = await axios.post('/upload/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = response.data.data.url;
      setPersonalInfo({ ...personalInfo, profileimageurl: imageUrl });
      
      await axios.patch('/users/me', { profileimageurl: imageUrl });
      updateUser({ profileimageurl: imageUrl });
      
      setSuccess('Profile image updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <Settings size={32} />
            <h1 className="text-3xl font-bold">Profile & Settings</h1>
          </div>
          <p className="text-indigo-100 text-lg">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
          <div className="flex items-center text-green-700">
            <CheckCircle className="mr-2" size={20} />
            <span className="font-medium">{success}</span>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 shadow-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </Card>
      )}

      {/* Personal Information */}
      <Card className="p-8 border-0 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-3">
            <User className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        </div>

        <form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            <div className="relative group">
              {personalInfo.profileimageurl ? (
                <img
                  src={personalInfo.profileimageurl}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-200"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-4 ring-blue-200">
                  <span className="text-white font-bold text-4xl">
                    {personalInfo.fullname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg group-hover:scale-110"
              >
                <Camera size={18} />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="font-bold text-xl text-gray-900">{personalInfo.fullname}</p>
              <p className="text-gray-600">{personalInfo.email}</p>
              <p className="text-sm text-gray-500 mt-2">Click the camera icon to change your photo</p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-gray-900 font-semibold">Full Name</Label>
              <Input
                id="fullname"
                value={personalInfo.fullname}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullname: e.target.value })}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 font-semibold">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={personalInfo.phonenumber}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phonenumber: e.target.value })}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Save className="mr-2" size={18} />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-8 border-0 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl mr-3">
            <Bell className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive updates via SMS' },
            { key: 'statusUpdates', label: 'Status Updates', desc: 'Notify me about report status changes' },
            { key: 'comments', label: 'Comments & Replies', desc: 'Notify me about new comments' },
            { key: 'systemAnnouncements', label: 'System Announcements', desc: 'Important platform updates' }
          ].map((item, index) => (
            <div key={item.key}>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {index < 4 && <Separator className="my-4" />}
            </div>
          ))}
        </div>

        <Button 
          onClick={handleNotificationUpdate} 
          disabled={loading}
          className="mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          <Save className="mr-2" size={18} />
          Save Preferences
        </Button>
      </Card>

      {/* Change Password */}
      <Card className="p-8 border-0 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl mr-3">
            <Shield className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Security & Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-gray-900 font-semibold">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="border-gray-300 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-gray-900 font-semibold">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="border-gray-300 focus:ring-2 focus:ring-red-500"
                required
              />
              <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-900 font-semibold">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="border-gray-300 focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            <Lock className="mr-2" size={18} />
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;