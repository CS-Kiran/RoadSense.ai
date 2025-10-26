// src/pages/official/TeamManagementPage.jsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

const TeamManagementPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <Users className="w-8 h-8" />
        Team Management
      </h1>
      <Card className="p-12 text-center">
        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">Team management features coming soon</p>
        <p className="text-sm text-slate-500 mt-2">Connect API to manage team members</p>
      </Card>
    </div>
  );
};

export default TeamManagementPage;
