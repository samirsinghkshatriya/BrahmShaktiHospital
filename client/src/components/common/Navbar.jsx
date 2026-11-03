import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PhoneCall,
  Calendar,
  User,
  Menu,
  X,
  ChevronDown,
  Activity,
  Stethoscope,
  Building2,
  Search,
  FlaskConical,
  AlertTriangle,
  Zap,
  Droplets,
  Heart,
  FileText,
  Hospital
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { centersOfExcellence } from '../../data/hospitalData';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Dropdown menus (label -> items), styled like the reference header
  const menus = {
    'Speciality': {
      match: ['/departments', '/doctors'],
      items: [
        { label: 'All Departments', sub: 'Browse every clinical department', path: '/departments', icon: Building2 },
        { label: 'All Doctors', sub: 'Find a specialist by name', path: '/doctors', icon: Stethoscope },
        ...centersOfExcellence.slice(0, 4).map((c) => ({
          label: c.title,
          sub: c.tagline,
          path: `/departments/${c.id}`,
          icon: Activity
        }))
      ]
    },
    'About Us': {
      match: ['/about', '/facilities', '/services', '/lab-results', '/search'],
      items: [
        { label: 'About the Hospital', sub: 'Heritage, mission & leadership', path: '/about', icon: Hospital },
        { label: 'Facilities & Diagnostics', sub: 'Labs, CT Scan & infrastructure', path: '/facilities', icon: FlaskConical },
        { label: 'Lab Test Results', sub: 'Retrieve reports with UHID & mobile', path: '/lab-results', icon: FileText },
        { label: 'Quick Search', sub: 'Search doctors, departments & services', path: '/search', icon: Search },
        { label: 'OPD Clinical Services', sub: 'Outpatient clinics & schedules', path: '/services/opd', icon: Stethoscope },
        { label: 'IPD Inpatient Care', sub: 'Rooms, ICU & admissions', path: '/services/ipd', icon: Building2 }
      ]
    },
    'Blood Bank': {
      match: ['/blood-bank'],
      items: [
        { label: 'Blood Bank Home', sub: 'Inventory & camp announcements', path: '/blood-bank', icon: Droplets },
        { label: 'Check Availability', sub: 'Live blood stock by group', path: '/blood-bank/availability', icon: Search },
        { label: 'Donate Blood', sub: 'Voluntary donation application', path: '/blood-bank/donate', icon: Heart },
        { label: 'Request Blood', sub: 'Patient requirement raised by doctor', path: '/blood-bank/request', icon: FileText }
      ]
    }
  };

  const plainLinks = [
    { label: 'Pharmacy', path: '/pharmacy' },
    { label: 'Contact Us', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isMenuActive = (menu) => menu.match.some((m) => location.pathname.startsWith(m));

  // Quick-action strip below the main navbar (reference image row 2)
  const quickActions = [
    { label: 'Find a Doctor', path: '/doctors', icon: Search, external: false },
    { label: 'Search By Department', path: '/departments', icon: Stethoscope, external: false },
    { label: 'Lab Result', path: '/lab-results', icon: FlaskConical, external: false },
    { label: 'Emergency', path: 'tel:7840089703', icon: AlertTriangle, external: true },
    { label: 'Quick Search', path: '/search', icon: Zap, external: false }
  ];

  const navLinkClass = (active) =>
    `flex items-center gap-1 px-3.5 py-2 rounded-lg text-[15px] font-semibold transition-colors ${
      active ? 'text-primary' : 'text-secondary hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Main White Navbar */}
      <nav className="bg-medical-white px-3 sm:px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          {/* Hospital Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-secondary truncate">
                  BRAHM SHAKTI
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-accent text-accent-dark font-bold uppercase tracking-wider shrink-0">
                  HOSPITAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-primary tracking-wide -mt-0.5 hidden sm:block truncate">
                250-Bedded Tertiary Healthcare · Caring for you for Life
              </p>
            </div>
          </Link>

          {/* Centered Navigation With Dropdown Carets */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {Object.entries(menus).map(([label, menu]) => {
              const active = isMenuActive(menu);
              return (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    onClick={() => setOpenMenu(openMenu === label ? null : label)}
                    className={`${navLinkClass(active)} whitespace-nowrap`}
                  >
                    <span>{label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === label ? 'rotate-180' : ''}`} />
                  </button>

                  {openMenu === label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-medical-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {menu.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label + item.path}
                            to={item.path}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-primary-50 hover:text-primary transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold leading-tight truncate">{item.label}</div>
                              <div className="text-[11px] text-medical-muted truncate">{item.sub}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {plainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${navLinkClass(isActive(link.path))} whitespace-nowrap`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: Book Appointment Pill + Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0 lg:flex-1 lg:justify-end">
            <Link
              to="/consultation"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-secondary hover:bg-medical-coolgray"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-medical-border mt-3 pt-3 pb-6 space-y-1 max-h-[calc(100vh-90px)] overflow-y-auto animate-in fade-in duration-200">
            <div className="px-4 pb-1 text-[10px] font-black uppercase tracking-wider text-medical-muted">Departments & Care</div>
            <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Speciality & Departments</Link>
            <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Find a Doctor</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">About Us</Link>
            <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Facilities & Diagnostics</Link>
            <Link to="/lab-results" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Lab Test Results</Link>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Quick Search</Link>
            <Link to="/blood-bank" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Blood Bank</Link>
            <Link to="/pharmacy" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Pharmacy</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Contact Us</Link>

            <div className="pt-2 pb-1 border-t border-medical-border/60">
              <Link to="/services/opd" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-secondary hover:bg-medical-coolgray font-medium">OPD Clinical Services</Link>
              <Link to="/services/ipd" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-secondary hover:bg-medical-coolgray font-medium">IPD Inpatient Admissions</Link>
            </div>

            <div className="pt-3 px-2 flex flex-col gap-2.5">
              <Link
                to="/consultation"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-medical-muted hover:text-primary transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Staff & Patient Login</span>
                </Link>
              )}

              {/* Mobile Drawer Helpline Strip */}
              <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-status-error font-bold">
                  <PhoneCall className="w-4 h-4" />
                  <span>24x7 Emergency Line</span>
                </div>
                <a href="tel:7840089703" className="text-secondary font-black hover:underline">
                  7840089703
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Quick Access Strip (second row, like the reference) */}
      <div className="hidden lg:block bg-medical-white border-t border-medical-border/70 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-5">
            {quickActions.map((qa, idx) => {
              const Icon = qa.icon;
              const inner = (
                <>
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">{qa.label}</span>
                </>
              );
              const classes = `group flex items-center justify-center gap-2.5 py-3.5 transition-colors hover:bg-primary-50 ${
                idx > 0 ? 'border-l border-medical-border/70' : ''
              }`;
              return qa.external ? (
                <a key={qa.label} href={qa.path} className={classes}>{inner}</a>
              ) : (
                <Link key={qa.label} to={qa.path} className={classes}>{inner}</Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
