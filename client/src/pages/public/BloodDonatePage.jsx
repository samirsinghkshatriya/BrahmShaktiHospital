import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake, Droplets, Loader2, CheckCircle2, AlertTriangle,
  ShieldCheck, ArrowRight, ArrowLeft, Calendar
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

// Self-declaration questions. These DO NOT decide eligibility — staff screening does.
const ELIGIBILITY_QUESTIONS = [
  'Have you donated blood in the last 3 months?',
  'Are you currently taking antibiotics or have you had a fever in the last 2 weeks?',
  'Have you had major surgery, vaccination, or a blood transfusion in the last 6 months?',
  'Do you have heart disease, high blood pressure (uncontrolled), epilepsy, or cancer?',
  'Have you ever tested positive for HIV, Hepatitis B/C, or syphilis?',
  'Are you pregnant, breastfeeding, or have you delivered a baby within the last year?',
  'Have you experienced significant weight loss or fainting spells recently?'
];

const CONSENT_TEXT =
  'I confirm the information provided is accurate. I understand that final medical eligibility is determined only by the qualified blood bank medical team after on-site vital and haemoglobin screening. Submitting this form does not guarantee that donation will proceed.';

export const BloodDonatePage = () => {
  const [form, setForm] = useState({
    donorName: '', dateOfBirth: '', donorPhone: '', gender: 'Male', email: '',
    address: '', bloodGroup: 'Unknown', previousDonations: '', preferredDonationDate: ''
  });
  const [answers, setAnswers] = useState(() => ELIGIBILITY_QUESTIONS.map(() => ''));
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const computedAge = form.dateOfBirth
    ? Math.floor((Date.now() - new Date(form.dateOfBirth).getTime()) / 3.15576e10)
    : null;

  const setAnswer = (i, val) => setAnswers((a) => a.map((x, idx) => (idx === i ? val : x)));

  const answersComplete = answers.every((a) => a !== '');
  const basicValid = form.donorName.trim() && form.donorPhone.trim();

  const canNextStep1 = basicValid;
  const canNextStep2 = answersComplete && consent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) { toast.error('Donor consent is required to submit'); return; }
    setSubmitting(true);
    try {
      const eligibilityAnswers = ELIGIBILITY_QUESTIONS.map((question, i) => ({ question, answer: answers[i] }));
      const payload = {
        ...form,
        donorAge: computedAge ?? 0,
        bloodGroup: form.bloodGroup || 'Unknown',
        previousDonations: form.previousDonations,
        eligibilityAnswers,
        consentGiven: consent
      };
      const res = await api.post('/blood-bank/donation-applications', payload);
      if (res.data.success) {
        setResult(res.data.data);
        toast.success(res.data.message || 'Application submitted');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit donation application');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-10 pb-20">
        <section className="max-w-3xl mx-auto px-4 pt-16">
          <div className="bg-white rounded-3xl border border-medical-border shadow-soft p-8 sm:p-12 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-status-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-black text-secondary">Donation Application Received</h1>
            <p className="text-sm text-medical-muted leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-secondary">{form.donorName}</strong>. Your reference number is
              <span className="font-mono font-bold text-primary"> {result.donationId}</span>. A blood bank counselor
              will contact you on <strong className="text-secondary">{form.donorPhone}</strong> to schedule your screening.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-100 max-w-md mx-auto">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="text-left">Eligibility is confirmed only after on-site medical screening by our qualified team — this application does not approve donation on its own.</span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button onClick={() => { setResult(null); setStep(1); setConsent(false); setAnswers(ELIGIBILITY_QUESTIONS.map(() => '')); }} className="px-5 py-2.5 rounded-xl border border-medical-border text-secondary text-xs font-bold">Register Another Donor</button>
              <Link to="/blood-bank/availability" className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold inline-flex items-center gap-1.5">View Live Availability <ArrowRight className="w-4 h-4" /></Link>
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" /> Donate Blood
          </div>
          <h1 className="text-4xl font-black tracking-tight">Voluntary Blood Donation Registration</h1>
          <p className="text-sm text-slate-300">Register your intent to donate. One donation can save up to three lives. Our team will guide you through screening and scheduling.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${step >= s ? 'bg-primary text-white' : 'bg-white text-medical-muted border border-medical-border'}`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{s}</span>
                {['Details', 'Health', 'Consent'][s - 1]}
              </div>
              {s < 3 && <div className={`w-6 h-px ${step > s ? 'bg-primary' : 'bg-medical-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 sm:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2"><Droplets className="w-5 h-5 text-primary" /> Donor Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *"><input required value={form.donorName} onChange={update('donorName')} className={inputCls} placeholder="Your full name" /></Field>
                <Field label="Mobile Number *"><input required value={form.donorPhone} onChange={update('donorPhone')} className={inputCls} placeholder="+91-98XXXXXXXX" /></Field>
                <Field label="Date of Birth"><input type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} className={inputCls} /></Field>
                <Field label="Gender"><select value={form.gender} onChange={update('gender')} className={inputCls}><option>Male</option><option>Female</option><option>Other</option></select></Field>
                <Field label="Email"><input type="email" value={form.email} onChange={update('email')} className={inputCls} placeholder="you@example.com" /></Field>
                <Field label="Blood Group (if known)"><select value={form.bloodGroup} onChange={update('bloodGroup')} className={inputCls}>{BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}</select></Field>
                <div className="sm:col-span-2"><Field label="Address"><textarea value={form.address} onChange={update('address')} rows={2} className={inputCls} placeholder="Residential address" /></Field></div>
                <Field label="Previous Donations (count / date)"><input value={form.previousDonations} onChange={update('previousDonations')} className={inputCls} placeholder="e.g. 2 (last Jan 2025)" /></Field>
                <Field label="Preferred Donation Date"><input type="date" value={form.preferredDonationDate} onChange={update('preferredDonationDate')} className={inputCls} /></Field>
              </div>
              {computedAge != null && (
                <p className="text-xs text-medical-muted">Calculated age: <strong className="text-secondary">{computedAge} years</strong> {computedAge < 18 && <span className="text-status-error"> — donors must be 18+ (subject to staff review).</span>}</p>
              )}
              <div className="flex justify-end pt-2">
                <button type="button" disabled={!canNextStep1} onClick={() => setStep(2)} className={nextBtn}>Continue <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Health Self-Declaration</h2>
              <p className="text-xs text-medical-muted">Answer honestly. These answers help our medical team prepare — they do <strong>not</strong> automatically determine your eligibility.</p>
              <div className="space-y-3">
                {ELIGIBILITY_QUESTIONS.map((q, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl border border-medical-border bg-medical-coolgray">
                    <span className="text-xs text-secondary">{i + 1}. {q}</span>
                    <div className="flex gap-2 shrink-0">
                      {['Yes', 'No'].map((opt) => (
                        <button type="button" key={opt} onClick={() => setAnswer(i, opt)} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${answers[i] === opt ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-medical-border hover:border-primary'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(1)} className={backBtn}><ArrowLeft className="w-4 h-4" /> Back</button>
                <button type="button" disabled={!answersComplete} onClick={() => setStep(3)} className={nextBtn}>Continue <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-secondary flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Consent & Submit</h2>
              <div className="p-4 rounded-xl border border-medical-border bg-medical-coolgray text-xs text-secondary leading-relaxed">{CONSENT_TEXT}</div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#0F766E]" />
                <span className="text-xs text-secondary">I have read and agree to the consent statement above.</span>
              </label>
              <div className="flex justify-between pt-2">
                <button type="button" onClick={() => setStep(2)} className={backBtn}><ArrowLeft className="w-4 h-4" /> Back</button>
                <button type="submit" disabled={!canNextStep2 || submitting} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold disabled:opacity-50 inline-flex items-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartHandshake className="w-4 h-4" />} Submit Donation Application
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="flex flex-wrap gap-3 justify-center text-xs pt-2">
          <Link to="/blood-bank/eligibility" className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"><ShieldCheck className="w-4 h-4" /> Full eligibility criteria</Link>
          <Link to="/blood-bank/faq" className="inline-flex items-center gap-1.5 font-bold text-secondary hover:underline">Donation FAQ</Link>
          <Link to="/blood-bank/request" className="inline-flex items-center gap-1.5 font-bold text-status-error hover:underline"><Droplets className="w-4 h-4" /> Need blood instead?</Link>
        </div>
      </section>
    </div>
  );
};

const inputCls = 'w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden bg-white';
const nextBtn = 'px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold disabled:opacity-50 inline-flex items-center gap-2';
const backBtn = 'px-5 py-3 rounded-xl border border-medical-border text-secondary text-xs font-bold inline-flex items-center gap-2';
const Field = ({ label, children }) => <div className="space-y-1"><label className="text-xs font-bold uppercase text-medical-muted">{label}</label>{children}</div>;

export default BloodDonatePage;
