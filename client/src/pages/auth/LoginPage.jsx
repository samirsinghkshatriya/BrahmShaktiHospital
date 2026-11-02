import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const getDashboardForRole = (role) => {
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res?.success) {
      const dest = from || getDashboardForRole(res.user.role);
      navigate(dest, { replace: true });
    }
  };

  const quickFillAndLogin = async (roleName) => {
    const creds = {
      superadmin: { email: 'superadmin@brahmshaktihospital.com', password: 'SuperAdmin@123' },
      admin: { email: 'admin@brahmshaktihospital.com', password: 'Admin@123' },
      doctor: { email: 'doctor@brahmshaktihospital.com', password: 'Doctor@123' },
      pharmacist: { email: 'pharmacist@brahmshaktihospital.com', password: 'Pharmacist@123' },
      supplier: { email: 'supplier@brahmshaktihospital.com', password: 'Supplier@123' },
      receptionist: { email: 'receptionist@brahmshaktihospital.com', password: 'Receptionist@123' },
      patient: { email: 'patient@brahmshaktihospital.com', password: 'Patient@123' }
    };

    const target = creds[roleName];
    if (target) {
      setEmail(target.email);
      setPassword(target.password);
      setSubmitting(true);
      const res = await login(target.email, target.password);
      setSubmitting(false);
      if (res?.success) {
        navigate(getDashboardForRole(roleName), { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-medical-coolgray py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
            Hospital Management System Login
          </h2>
          <p className="text-xs sm:text-sm text-medical-muted">
            Secure Role-Based Portal for Staff, Clinicians, Suppliers & Patients
          </p>
        </div>

        {/* 1-Click Demo Accounts Selector */}
        <div className="bg-white p-5 rounded-2xl border border-primary/20 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Instant 1-Click Demo Role Accounts</span>
          </div>
          <p className="text-[11px] text-medical-muted">
            Click any role badge below to immediately authenticate and view that role's interface:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                type="button"
                onClick={() => quickFillAndLogin(r.id)}
                className="px-2.5 py-2 rounded-xl text-left border border-medical-border hover:border-primary hover:bg-primary-50 transition-all text-xs font-semibold text-secondary"
              >
                <div className="font-bold text-primary">{r.label}</div>
                <div className="text-[10px] text-medical-muted mt-0.5">Click to Login ↗</div>
              </button>
            ))}
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-white p-8 rounded-3xl border border-medical-border shadow-soft space-y-6">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                Official Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3.5 text-medical-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@brahmshaktihospital.com"
                  required
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-primary font-semibold">Protected with bcrypt</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-medical-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{submitting ? 'Verifying Credentials...' : 'Sign In to Hospital Portal'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-medical-border flex items-center justify-between text-xs text-medical-muted">
            <span>New patient seeking care?</span>
            <Link to="/register" className="text-primary font-bold hover:underline">
              Register New Account ↗
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-medical-muted">
          <Link to="/" className="text-secondary font-semibold hover:underline">
            ← Return to Brahm Shakti Hospital Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
