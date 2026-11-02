import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import DepartmentsPage from './pages/public/DepartmentsPage';
import DepartmentDetailPage from './pages/public/DepartmentDetailPage';
import DoctorsPage from './pages/public/DoctorsPage';
import DoctorProfilePage from './pages/public/DoctorProfilePage';
import AppointmentsPage from './pages/public/AppointmentsPage';
import OpdServicesPage from './pages/public/OpdServicesPage';
import IpdServicesPage from './pages/public/IpdServicesPage';
import BloodBankPage from './pages/public/BloodBankPage';
import PharmacyPage from './pages/public/PharmacyPage';
import FacilitiesPage from './pages/public/FacilitiesPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages & Guards
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PatientManagementPage from './pages/admin/PatientManagementPage';
import DoctorManagementPage from './pages/admin/DoctorManagementPage';
import AppointmentManagementPage from './pages/admin/AppointmentManagementPage';
import DepartmentManagementPage from './pages/admin/DepartmentManagementPage';
import BloodBankManagementPage from './pages/admin/BloodBankManagementPage';
import PharmacyManagementPage from './pages/admin/PharmacyManagementPage';
import BillingManagementPage from './pages/admin/BillingManagementPage';
import ReportsPage from './pages/admin/ReportsPage';

// Specialized Role Dashboards
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import PharmacistDashboardPage from './pages/pharmacist/PharmacistDashboardPage';
import SupplierDashboardPage from './pages/supplier/SupplierDashboardPage';
import ReceptionistDashboardPage from './pages/receptionist/ReceptionistDashboardPage';
import PatientDashboardPage from './pages/patient/PatientDashboardPage';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#12304A',
            color: '#FFFFFF',
            fontSize: '13px',
            borderRadius: '12px'
          }
        }}
      />

      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorProfilePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/services/opd" element={<OpdServicesPage />} />
          <Route path="/services/ipd" element={<IpdServicesPage />} />
          <Route path="/blood-bank" element={<BloodBankPage />} />
          <Route path="/pharmacy" element={<PharmacyPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Admin & Clinical Dashboards */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin / Super Admin Core Modules */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'receptionist', 'doctor']}>
                <PatientManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <DoctorManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'receptionist', 'doctor']}>
                <AppointmentManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <DepartmentManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blood-bank"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <BloodBankManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'pharmacist']}>
                <PharmacyManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/billing"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'receptionist', 'pharmacist']}>
                <BillingManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Role-Specific Dashboards */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin', 'superadmin']}>
                <DoctorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['pharmacist', 'admin', 'superadmin']}>
                <PharmacistDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/dashboard"
            element={
              <ProtectedRoute allowedRoles={['supplier', 'admin', 'superadmin']}>
                <SupplierDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['receptionist', 'admin', 'superadmin']}>
                <ReceptionistDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin', 'superadmin']}>
                <PatientDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
