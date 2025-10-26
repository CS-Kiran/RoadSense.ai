import React from 'react';
import { Navigate } from 'react-router-dom';
import OfficialLayout from '@/components/official/OfficialLayout';
import OfficialDashboard from '@/components/official/OfficialDashboard';
import AssignedReportsPage from '@/components/official/AssignedReportsPage';
import ReportDetailPage from '@/components/official/ReportDetailPage';
import TeamManagementPage from '@/components/official/TeamManagementPage';
import AnalyticsPage from '@/components/official/AnalyticsPage';
import ZoneManagementPage from '@/components/official/ZoneManagementPage';
import NotificationsPage from '@/components/official/NotificationsPage';
import ProfilePage from '@/components/official/ProfilePage';

export const officialRoutes = {
  path: '/official',
  element: <OfficialLayout />,
  protected: true,
  role: 'official',
  children: [
    {
      path: '',
      element: <Navigate to="/official/dashboard" replace />
    },
    {
      path: 'dashboard',
      element: <OfficialDashboard />
    },
    {
      path: 'reports',
      element: <AssignedReportsPage />
    },
    {
      path: 'reports/:id',
      element: <ReportDetailPage />
    },
    {
      path: 'teams',
      element: <TeamManagementPage />
    },
    {
      path: 'analytics',
      element: <AnalyticsPage />
    },
    {
      path: 'zones',
      element: <ZoneManagementPage />
    },
    {
      path: 'notifications',
      element: <NotificationsPage />
    },
    {
      path: 'profile',
      element: <ProfilePage />
    }
  ]
};
