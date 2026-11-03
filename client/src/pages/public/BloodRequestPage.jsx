import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Loader2, CheckCircle2, AlertTriangle, PhoneCall,
  FileText, ArrowRight, Stethoscope, ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = ['Packed Red Blood Cells', 'Whole Blood', 'Platelets', 'Fresh Frozen Plasma', 'Cryoprecipitate'];
const URGENCY = [
  { value: 'Normal', label: 'Normal (Elective / Scheduled)' },
  { value: 'Urgent', label: 'Urgent (Within a few hours)' },
  { value: 'Emergency', label: 'Emergency (Immediate, life-saving)' }
];

export const BloodRequestPage = () => {
  const [form, setForm] = useState({
    patientName: '', patientAge: '', patientGender: 'Male',
    hospitalName: 'Brahm Shakti Hospital', wardOrDepartment: '', prescribingDoctor: '',
    bloodGroup: 'B+', component: 'Packed Red Blood Cells', unitsNeeded: 1,
    urgency: 'Urgent', contactPhone: '', prescriptionDocUrl: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName.trim() || !form.contactPhone.trim()) {
      toast.error('Patient name and contact phone are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, patientAge: form.patientAge ? Number(form.patientAge) : undefined, unitsNeeded: Number(form.unitsNeeded) || 1 };
      const res = await api.post('/blood-bank/requests', payload);
      if (res.data.success) {
        setResult(res.data.data);
        toast.success('Blood request submitted for review');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit blood request');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-10 pb-20">
        <section className="max-w-3xl mx-auto px-4 pt-16">
          <div className="bg-white rounded-3xl border border-medical-border shadow-soft p-8 sm:p-12 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-status-success flex items-center justify-center mx-auto"><CheckCircle2 className="w-9 h-9" /></div>
            <h1 className="text-2xl font-black text-secondary">Blood Request Submitted</h1>
            <p className="text-sm text-medical-muted leading-relaxed max-w-md mx-auto">
              Your request reference is <span className="font-mono font-bold text-primary">{result.requestId}</span> and is now
              <span className="font-bold text-secondary"> {result.status}</span>. Our blood bank team reviews requests and will call
              <strong className="text-secondary"> {result.contactPhone}</strong> with availability and next steps.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-100 max-w-md mx-auto">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="text-left">For emergencies, also call our 24x7 blood desk. Submitting this form starts the review — units are only released after verification by qualified staff.</span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <a href="tel:7840089703" className="px-5 py-2.5 rounded-xl bg-status-error text-white text-xs font-bold inline-flex items-center gap-1.5"><PhoneCall className="w-4 h-4" /> Call 24x7 Desk</a>
              <button onClick={() => setResult(null)} className="px-5 py-2.5 rounded-xl border border-medical-border text-secondary text-xs font-bold">Submit Another Request</button>
              <Link to="/blood-bank/availability" className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold inline-flex items-center gap-1.5">Check Live Stock <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <section className="bg-secondary text-white py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider"><Droplets className="w-3.5 h-3.5" /> Request Blood</div>
          <h1 className="text-4xl font-black tracking-tight">Blood & Component Request</h1>
          <p className="text-sm text-slate-300">Raise a formal request for blood components. Requests enter a reviewed lifecycle: Submitted → Under Review → Approved → Issued/Completed.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {URGENCY.map((u) => (
            <button key={u.value} type="button" onClick={() => setForm((f) => ({ ...f, urgency: u.value }))} className={`p-3 rounded-xl border text-left transition-colors ${form.urgency === u.value ? 'border-primary bg-primary/5' : 'border-medical-border bg-white hover:border-primary'}`}>
              <div className="text-xs font-bold text-secondary">{u.value}</div>
              <div className="text-[10px] text-medical-muted mt-0.5">{u.label.split('(')[1]?.replace(')', '')}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-secondary flex items-center gap-2"><Stethoscope className="w-5 h-5 text-primary" /> Patient & Prescription Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Patient Full Name *"><input required value={form.patientName} onChange={update('patientName')} className={inputCls} placeholder="Patient name" /></Field>
            <Field label="Contact Mobile *"><input required value={form.contactPhone} onChange={update('contactPhone')} className={inputCls} placeholder="+91-98XXXXXXXX" /></Field>
            <Field label="Patient Age"><input type="number" min="0" value={form.patientAge} onChange={update('patientAge')} className={inputCls} placeholder="Years" /></Field>
            <Field label="Patient Gender"><select value={form.patientGender} onChange={update('patientGender')} className={inputCls}><option>Male</option><option>Female</option><option>Other</option></select></Field>
            <Field label="Blood Group *"><select value={form.bloodGroup} onChange={update('bloodGroup')} className={inputCls}>{BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}</select></Field>
            <Field label="Component"><select value={form.component} onChange={update('component')} className={inputCls}>{COMPONENTS.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
            <Field label="Units Needed"><input type="number" min="1" max="20" value={form.unitsNeeded} onChange={update('unitsNeeded')} className={inputCls} /></Field>
            <Field label="Prescribing Doctor"><input value={form.prescribingDoctor} onChange={update('prescribingDoctor')} className={inputCls} placeholder="Dr. name" /></Field>
            <Field label="Requesting Hospital"><input value={form.hospitalName} onChange={update('hospitalName')} className={inputCls} /></Field>
            <Field label="Ward / Department"><input value={form.wardOrDepartment} onChange={update('wardOrDepartment')} className={inputCls} placeholder="e.g. ICU, OT-2" /></Field>
          </div>

          <Field label="Prescription / Reference Document URL (optional)">
            <div className="relative">
              <FileText className="w-4 h-4 text-medical-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={form.prescriptionDocUrl} onChange={update('prescriptionDocUrl')} className={`${inputCls} pl-9`} placeholder="https://… (Google Drive / uploaded copy link)" />
            </div>
          </Field>

          <Field label="Additional Notes"><textarea rows={3} value={form.notes} onChange={update('notes')} className={inputCls} placeholder="Clinical context, timeline, transfusion details" /></Field>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-medical-coolgray border border-medical-border">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-medical-muted">All requests are verified by licensed blood bank personnel before any unit is issued. Expired or unscreened units are never released.</p>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl bg-status-error hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50 inline-flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Droplets className="w-4 h-4" />} Submit Blood Request
          </button>
        </form>

        <div className="flex flex-wrap gap-3 justify-center text-xs pt-2">
          <Link to="/blood-bank/availability" className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"><Droplets className="w-4 h-4" /> Check live availability first</Link>
          <Link to="/blood-bank/donate" className="inline-flex items-center gap-1.5 font-bold text-secondary hover:underline">Want to donate instead?</Link>
          <Link to="/blood-bank/faq" className="inline-flex items-center gap-1.5 font-bold text-secondary hover:underline">Request FAQ</Link>
        </div>
      </section>
    </div>
  );
};

const inputCls = 'w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden bg-white';
const Field = ({ label, children }) => <div className="space-y-1"><label className="text-xs font-bold uppercase text-medical-muted">{label}</label>{children}</div>;

export default BloodRequestPage;
