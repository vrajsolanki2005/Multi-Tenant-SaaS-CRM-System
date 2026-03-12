import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage   from './pages/LandingPage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContactsPage  from './pages/ContactsPage';
import LeadsPage     from './pages/LeadsPage';
import TasksPage     from './pages/TasksPage';
import UsersPage     from './pages/UsersPage';
import AuditPage     from './pages/AuditPage';
import SettingsPage  from './pages/SettingsPage';

import ServicesPage  from './components/landing/services/page';
import LegalPage     from './components/landing/legal/page';
import AboutPage     from './components/landing/about/page';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/legal"    element={<LegalPage />} />
          <Route path="/about"    element={<AboutPage />} />

          {/* Protected — all wrapped in DashboardLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
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
