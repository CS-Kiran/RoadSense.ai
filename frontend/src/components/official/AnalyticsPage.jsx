// src/pages/official/AnalyticsPage.jsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <BarChart3 className="w-8 h-8" />
        Analytics & Reports
      </h1>
      <Card className="p-12 text-center">
        <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">Analytics dashboard coming soon</p>
        <p className="text-sm text-slate-500 mt-2">Connect API to view detailed analytics</p>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
