// src/pages/official/ProfilePage.jsx (reuse citizen ProfilePage or create new)
import React from 'react';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Profile Settings</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-lg">{user?.full_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Department</label>
            <p className="text-lg">{user?.department || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Designation</label>
            <p className="text-lg">{user?.designation || 'N/A'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
