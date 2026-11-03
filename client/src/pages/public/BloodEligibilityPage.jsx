import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, CheckCircle2, XCircle, HeartHandshake, ArrowRight,
  Scale, Activity, Calendar, AlertTriangle
} from 'lucide-react';

const CAN_DONATE = [
  'You are between 18 and 65 years of age',
  'You weigh at least 45 kg (100 lbs)',
  'Your haemoglobin is ≥ 12.5 g/dL (checked free on site)',
  'You are in good general health with no active infection',
  'At least 90 days have passed since your last whole-blood donation',
  'At least 7 days since any vaccination, with no fever',
  'You are not pregnant or breastfeeding (or ≥ 1 year post-delivery)'
];

const CANNOT_DONATE = [
  'You had a fever, infection, or antibiotics in the last 2 weeks',
  'Major surgery or blood transfusion within the last 6 months',
  'History of HIV, Hepatitis B/C, syphilis, or malaria (recent)',
  'Uncontrolled high blood pressure, heart disease, epilepsy, or cancer',
  'Recent tattoo or body piercing (within 6 months)',
  'Significant unexplained weight loss or fainting episodes'
];

const STEPS = [
  { icon: HeartHandshake, title: 'Register', text: 'Submit your donation application online with basic details and a health self-declaration.' },
  { icon: Calendar, title: 'Screening Call', text: 'Our blood bank counselor contacts you to schedule a convenient donation slot.' },
  { icon: Activity, title: 'On-site Check', text: 'Vitals and a free haemoglobin test are performed by qualified personnel.' },
  { icon: ShieldCheck, title: 'Decision', text: 'Only our medical team confirms eligibility. A "yes" here means you are cleared to donate.' },
];

export const BloodEligibilityPage = () => {
  return (
    <div className="space-y-12 pb-20">
      <section className="bg-secondary text-white py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider"><ShieldCheck className="w-3.5 h-3.5" /> Donor Eligibility</div>
          <h1 className="text-4xl font-black tracking-tight">Who Can Donate Blood?</h1>
          <p className="text-sm text-slate-300 max-w-2xl">Understanding eligibility keeps every unit safe for recipients. The guidelines below are indicative — your final eligibility is always decided by our qualified medical team in person.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
            <h2 className="text-base font-bold text-status-success flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> You can likely donate if…</h2>
            <div className="space-y-2.5">
              {CAN_DONATE.map((c, i) => <div key={i} className="flex items-start gap-2.5 text-xs text-secondary"><CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" /><span>{c}</span></div>)}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
            <h2 className="text-base font-bold text-status-error flex items-center gap-2"><XCircle className="w-5 h-5" /> Please defer if…</h2>
            <div className="space-y-2.5">
              {CANNOT_DONATE.map((c, i) => <div key={i} className="flex items-start gap-2.5 text-xs text-secondary"><XCircle className="w-4 h-4 text-status-error shrink-0 mt-0.5" /><span>{c}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-100">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Submitting the online form does <strong>not</strong> confirm your eligibility. It only starts the process — a qualified professional makes the final medical decision after on-site screening.</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-secondary mb-1 flex items-center gap-2"><Scale className="w-5 h-5 text-primary" /> What happens after you apply</h2>
          <p className="text-xs text-medical-muted mb-6">A clear, four-stage path from registration to a safe donation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-medical-border shadow-soft p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><s.icon className="w-5 h-5" /></span>
                  <span className="text-2xl font-black text-medical-border">{i + 1}</span>
                </div>
                <div className="text-sm font-bold text-secondary">{s.title}</div>
                <div className="text-[11px] text-medical-muted leading-relaxed">{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-secondary">Ready to register as a donor?</h3>
            <p className="text-xs text-medical-muted mt-1">It takes about two minutes. Our team will take it from there.</p>
          </div>
          <Link to="/blood-bank/donate" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold inline-flex items-center gap-2 shrink-0">Register to Donate <ArrowRight className="w-4 h-4" /></Link>
        </div>

        <div className="flex flex-wrap gap-3 justify-center text-xs pt-2">
          <Link to="/blood-bank/faq" className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline">Read the donation FAQ</Link>
          <Link to="/blood-bank/availability" className="inline-flex items-center gap-1.5 font-bold text-secondary hover:underline">View live availability</Link>
        </div>
      </section>
    </div>
  );
};

export default BloodEligibilityPage;
