// src/pages/official/ZoneManagementPage.jsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const ZoneManagementPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <MapPin className="w-8 h-8" />
        Zone Management
      </h1>
      <Card className="p-12 text-center">
        <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">Zone management features coming soon</p>
        <p className="text-sm text-slate-500 mt-2">Connect API to manage zones</p>
      </Card>
    </div>
  );
};

export default ZoneManagementPage;
