import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContactsPage  from './pages/ContactsPage';
import LeadsPage     from './pages/LeadsPage';
import TasksPage     from './pages/TasksPage';
import UsersPage     from './pages/UsersPage';
import AuditPage     from './pages/AuditPage';
import SettingsPage  from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected — all wrapped in DashboardLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/contacts"  element={<ContactsPage />} />
              <Route path="/leads"     element={<LeadsPage />} />
              <Route path="/tasks"     element={<TasksPage />} />
              <Route path="/users"     element={<UsersPage />} />
              <Route path="/audit"     element={<AuditPage />} />
              <Route path="/settings"  element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
