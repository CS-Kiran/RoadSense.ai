import LoginPage from "@/components/auth/Login";
import UserRegister from "@/components/auth/UserRegister";
import OfficialRegister from "@/components/auth/OfficialRegister";
import AdminLogin from "@/components/auth/AdminLogin";

export const authRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    children: [
      { path: "citizen", element: <UserRegister /> },
      { path: "official", element: <OfficialRegister /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
    protected: false,
  },
];
