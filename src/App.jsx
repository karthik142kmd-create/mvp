import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import PublicVerifyPage from './pages/public/PublicVerifyPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import MyInstruments from './pages/business/MyInstruments';
import AddInstrument from './pages/business/AddInstrument';
import InstrumentDetails from './pages/business/InstrumentDetails';
import BusinessApplications from './pages/business/BusinessApplications';
import ApplyVerification from './pages/business/ApplyVerification';
import BusinessCertificates from './pages/business/BusinessCertificates';
import NotificationsPage from './pages/business/NotificationsPage';
import ProfilePage from './pages/business/ProfilePage';

// LMO Pages
import LmoDashboard from './pages/lmo/LmoDashboard';
import LmoQueue from './pages/lmo/LmoQueue';
import LmoSchedule from './pages/lmo/LmoSchedule';
import FieldVerificationPage from './pages/lmo/FieldVerificationPage';
import LmoHistory from './pages/lmo/LmoHistory';

// GATC Pages
import GatcDashboard from './pages/gatc/GatcDashboard';
import GatcAssignments from './pages/gatc/GatcAssignments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminInstruments from './pages/admin/AdminInstruments';
import AdminApplications from './pages/admin/AdminApplications';
import AdminSchedules from './pages/admin/AdminSchedules';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminReports from './pages/admin/AdminReports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Public Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/verify" element={<PublicVerifyPage />} />
            <Route path="/verify/:certNo" element={<PublicVerifyPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Direct Mobile Field Verification Route */}
          <Route path="/field-verification/:id" element={<FieldVerificationPage />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Navigate to="/business/dashboard" replace />} />

            {/* Business Routes */}
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
            <Route path="/business/instruments" element={<MyInstruments />} />
            <Route path="/business/instruments/new" element={<AddInstrument />} />
            <Route path="/business/instruments/:id" element={<InstrumentDetails />} />
            <Route path="/business/applications" element={<BusinessApplications />} />
            <Route path="/business/applications/new" element={<ApplyVerification />} />
            <Route path="/business/certificates" element={<BusinessCertificates />} />
            <Route path="/business/notifications" element={<NotificationsPage />} />
            <Route path="/business/profile" element={<ProfilePage />} />

            {/* LMO Routes */}
            <Route path="/lmo/dashboard" element={<LmoDashboard />} />
            <Route path="/lmo/queue" element={<LmoQueue />} />
            <Route path="/lmo/schedule" element={<LmoSchedule />} />
            <Route path="/lmo/verification/:id" element={<FieldVerificationPage />} />
            <Route path="/lmo/history" element={<LmoHistory />} />

            {/* GATC Routes */}
            <Route path="/gatc/dashboard" element={<GatcDashboard />} />
            <Route path="/gatc/assignments" element={<GatcAssignments />} />
            <Route path="/gatc/verification/:id" element={<FieldVerificationPage />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/instruments" element={<AdminInstruments />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/schedules" element={<AdminSchedules />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
