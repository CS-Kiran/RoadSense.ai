// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {routes.map((route, index) => {
          // Handle routes with children (nested routes)
          if (route.children) {
            const ParentElement = route.protected ? (
              <ProtectedRoute allowedRoles={[route.role]}>
                {route.element}
              </ProtectedRoute>
            ) : (
              route.element
            );

            return (
              <Route key={index} path={route.path} element={ParentElement}>
                {route.children.map((child, childIndex) => (
                  <Route
                    key={childIndex}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            );
          }

          // Handle simple routes without children
          const RouteElement = route.protected ? (
            <ProtectedRoute allowedRoles={[route.role]}>
              {route.element}
            </ProtectedRoute>
          ) : (
            route.element
          );

          return (
            <Route
              key={index}
              path={route.path}
              element={RouteElement}
            />
          );
        })}

        {/* 404 Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
