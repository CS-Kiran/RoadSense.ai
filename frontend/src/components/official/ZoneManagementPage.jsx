// src/pages/official/ZoneManagementPage.jsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ZoneManagementPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MapPin className="w-8 h-8" />
          Zone Management
        </h1>
        <p className="text-gray-600 mt-1">Manage your assigned zones</p>
      </div>

      <Card className="p-8 text-center">
        <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Current Zone</h3>
        <p className="text-2xl font-bold text-blue-600 mb-4">{user?.zone || 'N/A'}</p>
        <p className="text-gray-600">Zone management features coming soon</p>
      </Card>
    </div>
  );
};

export default ZoneManagementPage;
