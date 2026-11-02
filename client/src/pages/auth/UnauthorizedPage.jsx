import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Sparkles, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage = () => {
  const { role, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleElevateToAdmin = async () => {
    await switchDemoRole('superadmin');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-medical-coolgray py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-medical-border shadow-elevated text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 text-status-error flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-secondary tracking-tight">
            Restricted Module Access
          </h2>
          <p className="text-xs text-medical-muted leading-relaxed">
            Your current logged-in role (<strong className="text-secondary uppercase">{role || 'Guest'}</strong>) is not authorized to view this clinical or operational administrative module.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-primary-50 border border-primary/20 space-y-2 text-xs text-secondary">
          <div className="font-bold text-primary flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Developer / Demonstration Access</span>
          </div>
          <p className="text-[11px] text-medical-slate">
            To evaluate all modules in this test deployment, you can immediately switch your session to Super Admin with one click:
          </p>
          <button
            onClick={handleElevateToAdmin}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-xs transition-all"
          >
            Switch to Super Admin Privileges
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-4 text-xs">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-secondary font-bold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
          <span className="text-medical-border">|</span>
          <Link to="/" className="flex items-center gap-1 text-primary font-bold hover:underline">
            <Home className="w-3.5 h-3.5" />
            <span>Hospital Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
