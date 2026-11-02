import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Bed,
  HeartPulse,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  FileText,
  UserCheck
} from 'lucide-react';

export const IpdServicesPage = () => {
  const roomCategories = [
    {
      title: 'General Wards',
      desc: 'Spacious, well-ventilated shared multi-bed units with nurse call bells, subsidized daily charges, and 24-hour RMO cover.',
      tariff: '₹800 - ₹1,200 / day',
      features: ['Air-cooled ward', 'Individual bedside locker', 'Attendant chair', 'Subsidized Trust tariff']
    },
    {
      title: 'Semi-Private Rooms',
      desc: 'Twin-sharing air-conditioned rooms partitioned for privacy with attached washroom, telephone, and sofa-cum-bed.',
      tariff: '₹2,500 / day',
      features: ['Twin occupancy', 'Split Air Conditioner', 'Attached washroom', 'Dedicated TV and intercom']
    },
    {
      title: 'Deluxe Private Rooms',
      desc: 'Single occupancy spacious suites designed for patient comfort, television, refrigerator, and dedicated nursing attention.',
      tariff: '₹4,500 / day',
      features: ['Complete privacy', 'Refrigerator & LED TV', 'Attendant couch', 'In-room dietary service']
    },
    {
      title: 'Intensive Care Units (ICU / CCU / NICU)',
      desc: 'Multi-parameter computerized vital monitoring, invasive arterial line, servo mechanical ventilators, and 1:1 nurse-to-bed ratio.',
      tariff: '₹4,000 - ₹6,500 / day',
      features: ['1:1 Critical Care Nursing', 'Advanced Mechanical Ventilation', 'Central Monitoring Console', '24x7 Intensivist On-Duty']
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Top Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Inpatient Care</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            IPD Services & Admission Guidelines
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Comfortable, clean, and technologically advanced hospital accommodations supported by 24x7 critical care specialists and attentive nursing staff.
          </p>
        </div>
      </section>

      {/* Available Room Categories */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div>
          <h2 className="text-3xl font-black text-secondary tracking-tight">
            Available Inpatient Room Categories
          </h2>
          <p className="text-sm text-medical-muted mt-1">
            250-bed inpatient capacity tailored for patient recovery and subsidized affordability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roomCategories.map((room, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-medical-border shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded bg-primary-50 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {room.tariff}
                </span>
                <h3 className="text-xl font-bold text-secondary">{room.title}</h3>
                <p className="text-xs text-medical-muted leading-relaxed">{room.desc}</p>

                <div className="pt-3 border-t border-medical-border space-y-2">
                  {room.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-medical-border">
                <Link
                  to="/contact"
                  className="w-full block py-2.5 text-center rounded-xl bg-medical-coolgray hover:bg-primary hover:text-white text-secondary text-xs font-bold transition-all border border-medical-border"
                >
                  Inquire Admission
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admission & Discharge Process */}
      <section className="bg-white py-16 border-y border-medical-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Admission Process */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <FileText className="w-4 h-4" />
                <span>Seamless Admission</span>
              </div>
              <h3 className="text-2xl font-bold text-secondary">Admission Process & Guidelines</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Physician Admission Slip', desc: 'Admission order issued by OPD consultant or 24x7 Casualty Medical Officer.' },
                  { step: '2', title: 'IPD Reception & Room Selection', desc: 'Visit Central IPD Desk on Ground Floor to choose room category and initial deposit.' },
                  { step: '3', title: 'Cashless TPA Desk Verification', desc: 'Submit insurance card/ECHS/CGHS booklet for prompt cashless pre-authorization.' },
                  { step: '4', title: 'Ward Escort & Vitals Transfer', desc: 'Escorted directly by nursing orderly with electronic medical record handoff.' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-medical-coolgray border border-medical-border">
                    <span className="w-7 h-7 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-secondary">{item.title}</h4>
                      <p className="text-xs text-medical-muted mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discharge Process */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>Planned Discharge</span>
              </div>
              <h3 className="text-2xl font-bold text-secondary">Discharge & Handover Procedure</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Consultant Clinical Clearance', desc: 'Attending specialist reviews progress and signs medical discharge summary.' },
                  { step: '2', title: 'Billing Clearance', desc: 'Itemized bill prepared by IPD billing desk with insurance settlement or transparent payment.' },
                  { step: '3', title: 'Medication Handover & Counseling', desc: 'Pharmacist delivers discharge take-home medicines with dosage schedules explained.' },
                  { step: '4', title: 'Follow-up Consultation Booking', desc: 'Complimentary or subsidized follow-up slot scheduled for post-discharge review.' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-medical-coolgray border border-medical-border">
                    <span className="w-7 h-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-secondary">{item.title}</h4>
                      <p className="text-xs text-medical-muted mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cashless Insurance Desk */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Cashless Hospitalization</span>
            <h3 className="text-2xl sm:text-3xl font-black">Empaneled with All Leading TPAs & Panels</h3>
            <p className="text-sm text-slate-200 max-w-xl">
              CGHS, ECHS, DGEHS, Star Health, Medi Assist, Paramount, MD India, ICICI Lombard, HDFC ERGO, and more.
            </p>
          </div>
          <a
            href="tel:01127531683"
            className="px-8 py-3.5 rounded-xl bg-white text-secondary font-bold text-sm hover:bg-accent whitespace-nowrap shadow-md"
          >
            TPA Desk: 011-27531683
          </a>
        </div>
      </section>
    </div>
  );
};

export default IpdServicesPage;
