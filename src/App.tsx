// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { lazy, Suspense, useEffect } from "react";
import { useAuth } from "./store/auth";
import { ProtectedRoute } from "./components/auth/protected-route";
import { AdminLayout } from "./components/layouts/admin-layout";
import LoginPage from "./pages/login";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

// Lazy load admin pages for better performance
const DashboardPage = lazy(() => import("./pages/admin/dashboard"));
const CouponsPage = lazy(() => import("./pages/admin/coupons"));
const ReportsPage = lazy(() => import("./pages/admin/reports"));
const UsersPage = lazy(() => import("./pages/admin/users"));

export function App() {
  const { checkAuth } = useAuth();

  // Check auth status when app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<DashboardPage />} />
                <Route path="/admin/coupons" element={<CouponsPage />} />
                <Route path="/admin/reports" element={<ReportsPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
              </Route>
            </Route>

            {/* Redirect root to admin dashboard if authenticated, otherwise to login */}
            <Route path="/" element={<Navigate to="/admin" replace />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </QueryClientProvider>
    </Router>
  );
}
export default App;
