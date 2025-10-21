import LoginPage from "@/components/auth/Login";
import UserRegister from "@/components/auth/UserRegister";
import OfficialRegister from "@/components/auth/OfficialRegister";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

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
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
];
