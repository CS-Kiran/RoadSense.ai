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
          if (route.children) {
            const RouteElement = route.protected ? (
              <ProtectedRoute role={route.role}>
                {route.element}
              </ProtectedRoute>
            ) : (
              route.element
            );

            return (
              <Route key={route.path || index} path={route.path} element={RouteElement}>
                {route.children.map((child, childIndex) => (
                  <Route
                    key={child.path || childIndex}
                    path={child.path}
                    element={child.element}
                    index={child.path === ''}
                  />
                ))}
              </Route>
            );
          }

          const RouteElement = route.protected ? (
            <ProtectedRoute role={route.role}>
              {route.element}
            </ProtectedRoute>
          ) : (
            route.element
          );

          return (
            <Route
              key={route.path || index}
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