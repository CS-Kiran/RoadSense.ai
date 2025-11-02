// src/pages/official/TeamManagementPage.jsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

const TeamManagementPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-8 h-8" />
          Team Management
        </h1>
        <p className="text-gray-600 mt-1">Manage your team members</p>
      </div>

      <Card className="p-12 text-center">
        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Team management features coming soon</h3>
        <p className="text-gray-600">Collaborate with your team members</p>
      </Card>
    </div>
  );
};

export default TeamManagementPage;
