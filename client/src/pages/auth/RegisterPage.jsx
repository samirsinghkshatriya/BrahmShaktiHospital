import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, Mail, Phone, Lock, UserPlus, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Name, email and password are required');
      return;
    }

    setSubmitting(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      role: 'patient'
    });
    setSubmitting(false);

    if (res?.success) {
      navigate('/patient/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-medical-coolgray py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-lg">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-secondary tracking-tight">
            Create Patient Portal Account
          </h2>
          <p className="text-xs text-medical-muted">
            Access appointment histories, digital prescriptions, and billing receipts
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-medical-border shadow-soft space-y-6">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3.5 text-medical-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-medical-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3.5 text-medical-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91-98XXXXXXXX"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                Choose Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-medical-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Creating Account...' : 'Register Account'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-medical-border text-center text-xs text-medical-muted">
            <span>Already have an existing profile?</span>{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Log in here ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
