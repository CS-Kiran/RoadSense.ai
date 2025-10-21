import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {routes.map((route) => {
          if (route.children) {
            return (
              <Route key={route.path} path={route.path}>
                {route.children.map((child) => (
                  <Route
                    key={`${route.path}/${child.path}`}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            );
          }
          return (
            <Route key={route.path} path={route.path} element={route.element} />
          );
        })}

        {/* 404 Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
