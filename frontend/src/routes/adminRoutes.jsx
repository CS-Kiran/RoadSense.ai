import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import OfficialVerification from '@/components/admin/OfficialVerification';
import UserDetails from '@/components/admin/UserDetails';
import AdminReports from '@/components/admin/AdminReports';
import path from 'path';

export const adminRoutes = {
  path: '/admin/*',
  element: <AdminLayout />,
  protected: true,
  role: 'admin',
  children: [
    {
      path: '',
      element: <AdminDashboard />,
    },
    {
      path: 'dashboard',
      element: <AdminDashboard />,
    },
    {
      path: 'users',
      element: <UserManagement />,
    },
    {
      path: 'users/:userId',
      element: <UserDetails />,
    },
    {
      path: 'officials/verify',
      element: <OfficialVerification />,
    },
    {
      path: 'reports',
      element: <AdminReports />,
    },
  ],
};
