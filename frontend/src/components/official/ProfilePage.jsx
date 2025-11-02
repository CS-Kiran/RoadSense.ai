// src/pages/official/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { User, Mail, Phone, Briefcase, MapPin, Shield, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ProfilePage = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/official/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data);
      setPhoneNumber(response.data.phone_number);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.detail || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        `${API_URL}/api/official/profile`,
        { phone_number: phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProfile();
      setEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.detail || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">{error || 'Profile not found'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <User className="w-8 h-8" />
          Profile
        </h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <Card className="p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-blue-600 rounded-full p-6">
            <User className="w-16 h-16 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
            <p className="text-gray-600">{profile.designation} • {profile.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-gray-900">{profile.email}</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {editing ? (
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-gray-900">{profile.phone_number || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <Briefcase className="w-4 h-4" />
                Employee ID
              </label>
              <p className="text-gray-900">{profile.employee_id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <Briefcase className="w-4 h-4" />
                Department
              </label>
              <p className="text-gray-900">{profile.department}</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <Shield className="w-4 h-4" />
                Designation
              </label>
              <p className="text-gray-900">{profile.designation}</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                Zone
              </label>
              <p className="text-gray-900">{profile.zone}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          {editing ? (
            <>
              <Button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
              <Button onClick={() => {
                setEditing(false);
                setPhoneNumber(profile.phone_number);
              }} variant="outline">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Account Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Account Status</h3>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-full ${
            profile.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {profile.account_status.toUpperCase()}
          </div>
          <p className="text-gray-600">
            Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
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
