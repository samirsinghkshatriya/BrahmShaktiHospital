import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Droplets, HeartHandshake, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    category: 'Donating',
    q: 'Does submitting the online form mean I am approved to donate?',
    a: 'No. The form registers your intent and a health self-declaration. Final eligibility is decided only by our qualified blood bank medical team after an on-site vitals and haemoglobin check.'
  },
  {
    category: 'Donating',
    q: 'How long does the whole donation take?',
    a: 'The actual donation is about 8–10 minutes. Including registration, screening, and rest, plan for roughly 45 minutes to an hour.'
  },
  {
    category: 'Donating',
    q: 'How often can I donate whole blood?',
    a: 'At least 90 days must pass between whole-blood donations, subject to your health and staff clearance.'
  },
  {
    category: 'Donating',
    q: 'Is there a cost or compensation for donating?',
    a: 'Donation is completely voluntary and free of charge. We do not pay donors; you receive a donor certificate and a free health screening.'
  },
  {
    category: 'Requesting',
    q: 'What happens after I submit a blood request?',
    a: 'Your request enters a reviewed lifecycle: Submitted → Under Review → Approved → Available/Issued → Completed. Our team verifies details and calls you with availability and collection steps.'
  },
  {
    category: 'Requesting',
    q: 'Can I see exactly how many units are in stock?',
    a: 'The live availability page shows current, component-wise stock drawn from our inventory. Donor identities are never shown publicly, and expired units are never issued.'
  },
  {
    category: 'Requesting',
    q: 'This is an emergency — what should I do?',
    a: 'Submit the request form for records, but always call our 24x7 blood desk at 7840089703 so the team can act immediately.'
  },
  {
    category: 'General',
    q: 'Is the blood screened for infections?',
    a: 'Yes. Every unit is tested for HIV, Hepatitis B & C, syphilis, and malaria as per licensed blood bank regulations before release.'
  }
];

export const BloodFaqPage = () => {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-12 pb-20">
      <section className="bg-secondary text-white py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider"><HelpCircle className="w-3.5 h-3.5" /> Help Centre</div>
          <h1 className="text-4xl font-black tracking-tight">Blood Bank FAQ</h1>
          <p className="text-sm text-slate-300">Answers to the most common questions about donating and requesting blood at Brahm Shakti Hospital.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-3 p-5 text-left">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase shrink-0">{f.category}</span>
                <span className="text-sm font-bold text-secondary">{f.q}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-medical-muted shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <div className="px-5 pb-5 pl-[4.5rem] text-xs text-medical-muted leading-relaxed">{f.a}</div>}
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <Link to="/blood-bank/donate" className="bg-white rounded-2xl border border-medical-border shadow-soft p-5 flex items-center justify-between gap-3 hover:border-primary transition-colors">
            <div className="flex items-center gap-2 text-sm font-bold text-secondary"><HeartHandshake className="w-5 h-5 text-primary" /> Register to Donate</div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
          <Link to="/blood-bank/request" className="bg-white rounded-2xl border border-medical-border shadow-soft p-5 flex items-center justify-between gap-3 hover:border-primary transition-colors">
            <div className="flex items-center gap-2 text-sm font-bold text-secondary"><Droplets className="w-5 h-5 text-status-error" /> Request Blood</div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>

        <p className="text-center text-xs text-medical-muted pt-4">
          Still have questions? Call our 24x7 blood desk at <a href="tel:7840089703" className="font-bold text-primary hover:underline">7840089703</a>.
        </p>
      </section>
    </div>
  );
};

export default BloodFaqPage;
