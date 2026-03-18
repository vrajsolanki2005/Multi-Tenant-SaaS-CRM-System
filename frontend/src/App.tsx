import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import { Spinner } from './components/common';
import { ROUTES } from './constants';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ContactsPage = lazy(() => import('./pages/ContactsPage'));
const LeadsPage = lazy(() => import('./pages/LeadsPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const AuditPage = lazy(() => import('./pages/AuditPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ServicesPage = lazy(() => import('./components/landing/services/page'));
const LegalPage = lazy(() => import('./components/landing/legal/page'));
const AboutPage = lazy(() => import('./components/landing/about/page'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={<Spinner fullScreen size={36} />}>
              <Routes>
                {/* Public */}
                <Route path={ROUTES.HOME} element={<LandingPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
                <Route path={ROUTES.LEGAL} element={<LegalPage />} />
                <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                <Route path="/oauth-callback" element={<OAuthCallbackPage />} />

                {/* Protected — all wrapped in DashboardLayout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                    <Route path={ROUTES.CONTACTS} element={<ContactsPage />} />
                    <Route path={ROUTES.LEADS} element={<LeadsPage />} />
                    <Route path={ROUTES.TASKS} element={<TasksPage />} />
                    <Route path={ROUTES.USERS} element={<UsersPage />} />
                    <Route path={ROUTES.AUDIT} element={<AuditPage />} />
                    <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
