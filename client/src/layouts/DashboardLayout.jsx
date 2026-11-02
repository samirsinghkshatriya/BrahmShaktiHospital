import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Building2,
  Droplets,
  Pill,
  Receipt,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  ExternalLink,
  Truck,
  ClipboardList,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const { user, role, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleRoleChange = async (newRole) => {
    setRoleSwitcherOpen(false);
    toast.loading(`Switching to ${newRole.toUpperCase()} mode...`, { id: 'role-switch' });
    const res = await switchDemoRole(newRole);
    if (res?.success) {
      toast.success(`Switched role to ${newRole.toUpperCase()}`, { id: 'role-switch' });
      // Navigate to corresponding dashboard
      if (newRole === 'superadmin' || newRole === 'admin') navigate('/admin/dashboard');
      else if (newRole === 'doctor') navigate('/doctor/dashboard');
      else if (newRole === 'pharmacist') navigate('/pharmacist/dashboard');
      else if (newRole === 'supplier') navigate('/supplier/dashboard');
      else if (newRole === 'receptionist') navigate('/receptionist/dashboard');
      else if (newRole === 'patient') navigate('/patient/dashboard');
    } else {
      toast.error('Failed to switch role', { id: 'role-switch' });
    }
  };

  // Build role-tailored sidebar navigation
  const getNavItems = () => {
    if (role === 'superadmin' || role === 'admin') {
      return [
        { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Patient Management', path: '/admin/patients', icon: Users },
        { label: 'Doctor Management', path: '/admin/doctors', icon: UserCheck },
        { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
        { label: 'Departments', path: '/admin/departments', icon: Building2 },
        { label: 'Blood Bank', path: '/admin/blood-bank', icon: Droplets },
        { label: 'Pharmacy Store', path: '/admin/pharmacy', icon: Pill },
        { label: 'Billing & Invoices', path: '/admin/billing', icon: Receipt },
        { label: 'Hospital Reports', path: '/admin/reports', icon: BarChart3 }
      ];
    }

    if (role === 'doctor') {
      return [
        { label: 'Doctor Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
        { label: 'My Appointments', path: '/admin/appointments', icon: Calendar },
        { label: 'Patient Records', path: '/admin/patients', icon: Users },
        { label: 'Hospital Pharmacy', path: '/pharmacy', icon: Pill },
        { label: 'Blood Bank', path: '/blood-bank', icon: Droplets }
      ];
    }

    if (role === 'pharmacist') {
      return [
        { label: 'Pharmacy Dashboard', path: '/pharmacist/dashboard', icon: LayoutDashboard },
        { label: 'Drug Catalog & Stock', path: '/admin/pharmacy', icon: Pill },
        { label: 'Hospital Billing', path: '/admin/billing', icon: Receipt },
        { label: 'Purchase Orders', path: '/supplier/dashboard', icon: Truck }
      ];
    }

    if (role === 'supplier') {
      return [
        { label: 'Supplier Dashboard', path: '/supplier/dashboard', icon: LayoutDashboard },
        { label: 'Assigned Purchase Orders', path: '/supplier/dashboard', icon: Truck },
        { label: 'Hospital Pharmacy', path: '/pharmacy', icon: Pill }
      ];
    }

    if (role === 'receptionist') {
      return [
        { label: 'Reception Dashboard', path: '/receptionist/dashboard', icon: LayoutDashboard },
        { label: 'Register Patients', path: '/admin/patients', icon: Users },
        { label: 'Book Appointments', path: '/admin/appointments', icon: Calendar },
        { label: 'Quick Billing Desk', path: '/admin/billing', icon: Receipt },
        { label: 'Doctors On Duty', path: '/doctors', icon: UserCheck }
      ];
    }

    // Patient role
    return [
      { label: 'Patient Portal', path: '/patient/dashboard', icon: LayoutDashboard },
      { label: 'Book Appointment', path: '/appointments', icon: Calendar },
      { label: 'Doctor Directory', path: '/doctors', icon: UserCheck },
      { label: 'Blood Bank Status', path: '/blood-bank', icon: Droplets },
      { label: 'Hospital Pharmacy', path: '/pharmacy', icon: Pill }
    ];
  };

  const navItems = getNavItems();

  const isCurrentActive = (path) => {
    if (path === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
    if (path !== '/admin/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-medical-coolgray flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-secondary text-white border-r border-secondary-light/20 shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-md">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight leading-tight">BRAHM SHAKTI</div>
              <div className="text-[10px] text-accent tracking-wider font-bold uppercase">Hospital Management</div>
            </div>
          </Link>
        </div>

        {/* User Identity Pill */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm border-2 border-accent">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-bold text-white truncate">{user?.name || 'Authorized User'}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-status-success"></span>
                <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">
                  {role || 'Staff'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-primary-light'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Website & Logout */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 hover:text-white hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-medical-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-secondary hover:bg-medical-coolgray"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black text-secondary tracking-tight capitalize">
                {role} Control Dashboard
              </h1>
              <p className="text-xs text-medical-muted">
                Brahm Shakti Hospital · Budh Vihar, New Delhi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent text-accent-dark font-bold text-xs hover:bg-accent-hover transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Role: <strong className="uppercase">{role}</strong></span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-medical-border py-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-medical-muted border-b border-medical-border">
                    Switch Test Account Role
                  </div>
                  {[
                    { id: 'superadmin', label: 'Super Admin' },
                    { id: 'admin', label: 'Hospital Admin' },
                    { id: 'doctor', label: 'Doctor' },
                    { id: 'pharmacist', label: 'Pharmacist' },
                    { id: 'supplier', label: 'Supplier' },
                    { id: 'receptionist', label: 'Receptionist' },
                    { id: 'patient', label: 'Patient' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-primary-50 ${
                        role === r.id ? 'text-primary font-bold bg-primary-50/50' : 'text-secondary'
                      }`}
                    >
                      <span>{r.label}</span>
                      {role === r.id && <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded">Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-medical-border hidden sm:block"></div>

            {/* Notification Bell */}
            <button
              onClick={() => toast('No unread urgent alerts at this time.', { icon: '🔔' })}
              className="p-2 rounded-xl text-secondary hover:bg-medical-coolgray relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-error"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-medical-border">
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-secondary leading-tight truncate max-w-[120px]">{user?.name}</div>
                <div className="text-[10px] text-primary capitalize font-medium">{role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative w-64 bg-secondary text-white flex flex-col z-10">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="font-bold text-white text-base">BRAHM SHAKTI</div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-white/70 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10"
                    >
                      <Icon className="w-4 h-4 text-primary-light" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-red-300 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
