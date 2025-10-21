import React from 'react';
import { Navigate } from 'react-router-dom';
import CitizenLayout from '../components/citizen/CitizenLayout';
import CitizenDashboard from '@/components/citizen/CitizenDashboard';
import ReportIssuePage from '@/components/citizen/ReportIssuePage';
import MyReportsPage from '@/components/citizen/MyReportsPage';
import ReportDetailPage from '@/components/citizen/ReportDetailPage';
import InteractiveMapPage from '@/components/citizen/InteractiveMapPage';
import NotificationsPage from '@/components/citizen/NotificationsPage';
import ProfilePage from '@/components/citizen/ProfilePage';
import HelpCenterPage from '@/components/citizen/HelpCenterPage';

export const citizenRoutes = {
  path: '/citizen/*',
  element: <CitizenLayout />,
  protected: true,
  role: 'citizen',
  children: [
    {
      path: '',
      element: <Navigate to="/citizen/dashboard" replace />
    },
    {
      path: 'dashboard',
      element: <CitizenDashboard />
    },
    {
      path: 'report-issue',
      element: <ReportIssuePage />
    },
    {
      path: 'reports',
      element: <MyReportsPage />
    },
    {
      path: 'reports/:id',
      element: <ReportDetailPage />
    },
    {
      path: 'map',
      element: <InteractiveMapPage />
    },
    {
      path: 'notifications',
      element: <NotificationsPage />
    },
    {
      path: 'profile',
      element: <ProfilePage />
    },
    {
      path: 'help',
      element: <HelpCenterPage />
    }
  ]
};