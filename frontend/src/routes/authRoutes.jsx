import LoginPage from '@/components/auth/Login';
import UserRegister from '@/components/auth/UserRegister';
import OfficialRegister from '@/components/auth/OfficialRegister';

export const authRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    children: [
      { path: 'citizen', element: <UserRegister /> },
      { path: 'official', element: <OfficialRegister /> },
    ],
  },
];
