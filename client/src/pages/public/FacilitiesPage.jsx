import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Ambulance,
  HeartPulse,
  Activity,
  Droplets,
  Pill,
  Scissors,
  Bed,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Clock
} from 'lucide-react';

export const FacilitiesPage = () => {
  const facilities = [
    {
      title: '24x7 Emergency & Trauma Center',
      icon: PhoneCall,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
      desc: 'Immediate triage with dedicated casualty bays, defibrillators, crash carts, and emergency physicians available round the clock.',
      specs: ['Average triage < 3 mins', 'Immediate trauma resuscitation', 'Direct Cath Lab & OT integration']
    },
    {
      title: 'Mobile ICU Ambulance Fleet',
      icon: Ambulance,
      image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=600',
      desc: 'GPS-enabled high-dependency ambulances equipped with transport ventilators, multi-channel monitors, and emergency oxygen supplies.',
      specs: ['ACLS Certified Paramedics', 'Rapid North-West Delhi coverage', 'Toll-Free Hotline: 7840089703']
    },
    {
      title: 'Multi-Disciplinary ICU & CCU',
      icon: HeartPulse,
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600',
      desc: '30-bed high-tech critical care complex with central multi-parameter telemetry, invasive hemodynamic monitoring, and 1:1 nurse ratio.',
      specs: ['Invasive Arterial Blood Gas', 'High-Frequency Mechanical Ventilators', '24x7 Resident Intensivists']
    },
    {
      title: 'NABL Diagnostic Laboratories',
      icon: Activity,
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
      desc: 'Automated clinical biochemistry, hematology, histopathology, and microbiology ensuring rapid, calibrated test reporting.',
      specs: ['Barcoded Sample Processing', 'Online Digital Report Delivery', 'External Quality Assurance (EQAS)']
    },
    {
      title: 'Digital Radiology & CT Imaging',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
      desc: 'Multi-slice spiral CT Scanner, 3D/4D ultrasound color Doppler, and low-radiation digital radiography suites.',
      specs: ['Emergency CT within 15 mins', 'Whole Abdomen Ultrasound', 'Interventional Radiology Biopsies']
    },
    {
      title: 'Modular Surgical Theatres',
      icon: Scissors,
      image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600',
      desc: 'Ultra-clean laminar airflow theatres equipped with 4K Karl Storz laparoscopy towers, C-arm image intensifiers, and robotic tools.',
      specs: ['HEPA Filtered Air Handling Units', 'Zero Infection Protocol', 'Orthopaedic & Neuro OT Suites']
    },
    {
      title: '24-Hour Licensed Blood Bank',
      icon: Droplets,
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=600',
      desc: 'Component separation facility providing Whole Blood, PRBC, Platelets, FFP, and Cryoprecipitate with rigorous NAT/ELISA screening.',
      specs: ['Full 8 Blood Groups Maintained', 'Subsidized Trust Component Fees', 'Emergency Transfusion Desk']
    },
    {
      title: 'Continuous Renal Dialysis Center',
      icon: Activity,
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
      desc: '20-bed hemodialysis wing with advanced dialyzer reprocessing, double-pass reverse osmosis water, and dedicated infection-free stations.',
      specs: ['Round-the-Clock Dialysis Shifts', 'Subsidized Philanthropic Rates', 'Bedside SLED ICU Dialysis']
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Infrastructure & Diagnostics</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Hospital Facilities & Technology
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Engineered to international healthcare benchmarks, ensuring rapid triage, clinical safety, and comprehensive diagnostic reliability.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden bg-slate-100 relative">
                    <img src={fac.image} alt={fac.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-secondary/85 text-white backdrop-blur-xs flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-light" />
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-secondary text-base leading-snug">{fac.title}</h3>
                    <p className="text-xs text-medical-muted leading-relaxed">{fac.desc}</p>

                    <div className="pt-3 border-t border-medical-border space-y-1">
                      {fac.specs.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-secondary">
                          <CheckCircle2 className="w-3 h-3 text-status-success shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to="/contact"
                    className="w-full block py-2 text-center rounded-xl bg-medical-coolgray hover:bg-primary hover:text-white text-secondary text-xs font-bold transition-all border border-medical-border"
                  >
                    Contact Department
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FacilitiesPage;
