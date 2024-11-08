// src/routes/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import { ProtectedRoute } from './components/auth/protected-route';
import { AdminLayout } from './components/layouts/admin-layout';
import {UsersPage, DashboardPage,ReportsPage,CouponsPage} from './pages/admin/index';



export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        
          <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};