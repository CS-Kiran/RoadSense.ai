// src/pages/official/NotificationsPage.jsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <Bell className="w-8 h-8" />
        Notifications
      </h1>
      <Card className="p-12 text-center">
        <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">No new notifications</p>
        <p className="text-sm text-slate-500 mt-2">You're all caught up!</p>
      </Card>
    </div>
  );
};

export default NotificationsPage;
