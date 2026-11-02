import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  User,
  Menu,
  X,
  ChevronDown,
  Activity,
  Heart,
  Droplets,
  Pill,
  Building2,
  Stethoscope,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, role, logout } = useAuth();

  const getDashboardRoute = () => {
    switch (role) {
      case 'superadmin':
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'pharmacist':
        return '/pharmacist/dashboard';
      case 'supplier':
        return '/supplier/dashboard';
      case 'receptionist':
        return '/receptionist/dashboard';
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/admin/dashboard';
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Departments', path: '/departments' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Blood Bank', path: '/blood-bank' },
    { label: 'Pharmacy', path: '/pharmacy' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Top Emergency & Trust Information Bar */}
      <div className="bg-secondary text-white py-2 px-4 text-xs font-medium border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-accent">
              <span className="w-2 h-2 rounded-full bg-status-error animate-ping"></span>
              <span className="font-semibold text-white">24x7 Emergency Casualty:</span>
              <a href="tel:7840089703" className="text-accent hover:underline font-bold tracking-wide">
                7840089703
              </a>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-primary-light" />
              <span>Pocket C, Budh Vihar Phase I, New Delhi - 110085</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-light" />
              <span>NABH & NABL Accredited | Brahm Shakti Trust (Regd.)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary-light" />
              <span>OPD: 09:00 AM - 05:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-medical-white border-b border-medical-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Hospital Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-secondary">
                  BRAHM SHAKTI
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-accent text-accent-dark font-bold uppercase tracking-wider">
                  HOSPITAL
                </span>
              </div>
              <p className="text-[11px] font-medium text-medical-muted tracking-wide -mt-0.5">
                250-Bedded Tertiary Healthcare · Caring for you for Life
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-primary bg-primary-50 font-bold'
                    : 'text-medical-slate hover:text-primary hover:bg-medical-coolgray'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative" onMouseLeave={() => setServicesDropdownOpen(false)}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/services')
                    ? 'text-primary bg-primary-50 font-bold'
                    : 'text-medical-slate hover:text-primary hover:bg-medical-coolgray'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-elevated border border-medical-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/services/opd"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">OPD Services</div>
                      <div className="text-[11px] text-medical-muted">Outpatient Clinics & Schedules</div>
                    </div>
                  </Link>
                  <Link
                    to="/services/ipd"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:bg-primary-50 hover:text-primary transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-semibold">IPD Inpatient Care</div>
                      <div className="text-[11px] text-medical-muted">Rooms, ICU & Admissions</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {navLinks.slice(4).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-primary bg-primary-50 font-bold'
                    : 'text-medical-slate hover:text-primary hover:bg-medical-coolgray'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/appointments"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardRoute()}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary-light text-sm font-semibold shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary-light" />
                  <span className="capitalize">{role} Portal</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 text-medical-muted hover:text-status-error hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-medical-border text-secondary hover:border-primary hover:text-primary text-sm font-semibold transition-all"
              >
                <User className="w-4 h-4 text-primary" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-secondary hover:bg-medical-coolgray"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-medical-border mt-3 pt-3 pb-4 space-y-1 animate-in fade-in duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                  isActive(link.path)
                    ? 'text-primary bg-primary-50'
                    : 'text-secondary hover:bg-medical-coolgray'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 pb-1 border-t border-medical-border/60">
              <Link
                to="/services/opd"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-secondary hover:bg-medical-coolgray"
              >
                OPD Clinical Services
              </Link>
              <Link
                to="/services/ipd"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm text-secondary hover:bg-medical-coolgray"
              >
                IPD Inpatient Admissions
              </Link>
            </div>

            <div className="pt-3 px-2 flex flex-col gap-2">
              <Link
                to="/appointments"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>

              {isAuthenticated ? (
                <div className="flex gap-2">
                  <Link
                    to={getDashboardRoute()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{role.toUpperCase()} Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-50 text-status-error text-sm font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-secondary text-secondary font-semibold"
                >
                  <User className="w-4 h-4" />
                  <span>Staff & Patient Portal Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
