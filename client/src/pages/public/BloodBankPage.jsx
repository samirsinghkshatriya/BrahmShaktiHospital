import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, HeartHandshake, AlertTriangle, PhoneCall, ArrowRight,
  ShieldCheck, Activity, FileText, HelpCircle, Loader2
} from 'lucide-react';
import api from '../../services/api';

export const BloodBankPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/blood-bank/inventory');
      if (res.data.success) setInventory(res.data.data);
    } catch (err) {
      console.error('Error fetching blood inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  // Aggregate available (non-expired) units per blood group for a quick preview
  const byGroup = inventory.reduce((acc, i) => {
    if (i.isExpired || i.status === 'Expired') return acc;
    acc[i.bloodGroup] = (acc[i.bloodGroup] || 0) + (i.unitsAvailable || 0);
    return acc;
  }, {});
  const ORDER = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const WORKFLOWS = [
    { to: '/blood-bank/availability', icon: Activity, title: 'Live Availability', desc: 'Real-time, component-wise stock drawn from our blood bank inventory.', color: 'text-primary', bg: 'bg-primary/10' },
    { to: '/blood-bank/donate', icon: HeartHandshake, title: 'Donate Blood', desc: 'Register as a voluntary donor. Our team screens and schedules your donation.', color: 'text-status-success', bg: 'bg-green-100' },
    { to: '/blood-bank/request', icon: Droplets, title: 'Request Blood', desc: 'Raise a formal request that enters our verified review-and-issue lifecycle.', color: 'text-status-error', bg: 'bg-red-100' },
    { to: '/blood-bank/eligibility', icon: ShieldCheck, title: 'Eligibility', desc: 'Who can donate, what defers you, and how the screening decision works.', color: 'text-primary', bg: 'bg-primary/10' },
    { to: '/blood-bank/faq', icon: HelpCircle, title: 'FAQ', desc: 'Answers on donating, requesting, screening, and emergency steps.', color: 'text-secondary', bg: 'bg-medical-coolgray' },
  ];

  return (
    <div className="space-y-14 pb-20">
      {/* Top Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-bold uppercase tracking-wider">
              <Droplets className="w-3.5 h-3.5" />
              <span>24x7 Licensed Blood Bank</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Blood Bank & Component Separation</h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Serving emergency trauma, surgical suites, and patients across North-West Delhi with verified, infection-screened blood products.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/blood-bank/request" className="px-6 py-3.5 rounded-xl bg-status-error hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Request Blood
            </Link>
            <Link to="/blood-bank/donate" className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
              <HeartHandshake className="w-4 h-4" /> Donate Blood
            </Link>
            <a href="tel:7840089703" className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-accent" /> 24x7 Desk: 7840089703
            </a>
          </div>
        </div>
      </section>

      {/* Quick Availability Preview */}
      <section className="max-w-7xl mx-auto px-4 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight">Live Blood Group Snapshot</h2>
            <p className="text-xs text-medical-muted mt-1">Aggregated available units per group (excluding expired stock). Donor details are never shown publicly.</p>
          </div>
          <Link to="/blood-bank/availability" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-medical-border bg-white text-secondary text-xs font-bold hover:border-primary transition-colors">
            <FileText className="w-4 h-4 text-primary" /> View Full Component Stock <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-medical-muted text-sm"><Loader2 className="w-5 h-5 animate-spin" /> Loading live stock…</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {ORDER.map((g) => {
              const units = byGroup[g] || 0;
              const tone = units <= 3 ? 'text-status-error bg-red-50' : units <= 8 ? 'text-amber-700 bg-amber-50' : 'text-status-success bg-green-50';
              return (
                <Link key={g} to={`/blood-bank/availability?group=${encodeURIComponent(g)}`} className={`rounded-2xl border border-medical-border p-4 text-center hover:shadow-soft transition-shadow ${tone}`}>
                  <div className="text-lg font-black">{g}</div>
                  <div className="text-2xl font-black mt-1">{units}</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold opacity-70">units</div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Workflow Cards */}
      <section className="max-w-7xl mx-auto px-4 space-y-5">
        <h2 className="text-2xl font-bold text-secondary tracking-tight">Blood Bank Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKFLOWS.map((w) => (
            <Link key={w.to} to={w.to} className="group bg-white rounded-2xl border border-medical-border shadow-soft p-6 flex flex-col gap-3 hover:border-primary hover:shadow-md transition-all">
              <span className={`w-11 h-11 rounded-xl ${w.bg} ${w.color} flex items-center justify-center`}><w.icon className="w-5 h-5" /></span>
              <div className="text-base font-bold text-secondary">{w.title}</div>
              <div className="text-xs text-medical-muted leading-relaxed flex-1">{w.desc}</div>
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${w.color}`}>Open <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></div>
            </Link>
          ))}
          <div className="bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl shadow-lg p-6 flex flex-col gap-3 text-white">
            <span className="w-11 h-11 rounded-xl bg-white/10 text-accent flex items-center justify-center"><PhoneCall className="w-5 h-5" /></span>
            <div className="text-base font-bold text-white">Emergency Desk</div>
            <div className="text-xs text-slate-300 leading-relaxed flex-1">For immediate, life-saving requirements call our 24x7 blood bank desk alongside submitting a request.</div>
            <a href="tel:7840089703" className="inline-flex items-center gap-1.5 text-xs font-bold text-accent">Call 7840089703 <ArrowRight className="w-4 h-4" /></a>
          </div>
        </div>
      </section>

      {/* Safety strip */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <p className="text-xs text-medical-muted leading-relaxed">Every unit is infection-screened per licensed blood bank regulations. Eligibility and issue decisions are made only by qualified personnel — expired units are never released.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/blood-bank/eligibility" className="px-4 py-2.5 rounded-xl border border-medical-border text-secondary text-xs font-bold hover:border-primary transition-colors">Eligibility</Link>
            <Link to="/blood-bank/faq" className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors">Read FAQ</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BloodBankPage;
