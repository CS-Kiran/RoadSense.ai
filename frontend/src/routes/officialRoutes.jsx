// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import OfficialLayout from '../components/official/OfficialLayout';
// import OfficialDashboard from '../pages/official/OfficialDashboard';
// import AssignedReportsPage from '../pages/official/AssignedReportsPage';
// import ReportDetailPage from '../pages/official/ReportDetailPage';
// import TeamManagementPage from '../pages/official/TeamManagementPage';
// import AnalyticsPage from '../pages/official/AnalyticsPage';
// import ZoneManagementPage from '../pages/official/ZoneManagementPage';
// import NotificationsPage from '../pages/official/NotificationsPage';
// import ProfilePage from '../pages/official/ProfilePage';

// export const officialRoutes = {
//   path: '/official',
//   element: <OfficialLayout />,
//   protected: true,
//   role: 'official',
//   children: [
//     {
//       path: '',
//       element: <Navigate to="/official/dashboard" replace />
//     },
//     {
//       path: 'dashboard',
//       element: <OfficialDashboard />
//     },
//     {
//       path: 'reports',
//       element: <AssignedReportsPage />
//     },
//     {
//       path: 'reports/:id',
//       element: <ReportDetailPage />
//     },
//     {
//       path: 'teams',
//       element: <TeamManagementPage />
//     },
//     {
//       path: 'analytics',
//       element: <AnalyticsPage />
//     },
//     {
//       path: 'zones',
//       element: <ZoneManagementPage />
//     },
//     {
//       path: 'notifications',
//       element: <NotificationsPage />
//     },
//     {
//       path: 'profile',
//       element: <ProfilePage />
//     }
//   ]
// };
