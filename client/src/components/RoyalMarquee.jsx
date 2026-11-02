import React from 'react';
import {
  Award,
  ShieldCheck,
  HeartHandshake,
  Activity,
  Ambulance,
  PhoneCall,
  Sparkles,
  Stethoscope
} from 'lucide-react';

const MARQUEE_ITEMS = [
  {
    icon: HeartHandshake,
    title: 'Managed by Brahm Shakti Trust (Regd.)',
    subtitle: 'Philanthropic Healthcare Ethos',
    color: 'text-sky-300'
  },
  {
    icon: Award,
    title: 'NABH & NABL Accredited Center',
    subtitle: 'National Quality Standards',
    color: 'text-emerald-400'
  },
  {
    icon: Activity,
    title: '250-Bedded Tertiary Healthcare Project',
    subtitle: 'Modern ICUs, Dialysis & Laminar OTs',
    color: 'text-sky-400'
  },
  {
    icon: Sparkles,
    title: 'High-Tech Care at Subsidised Fees',
    subtitle: 'Coronary Bypass & Kidney Care',
    color: 'text-teal-300'
  },
  {
    icon: Ambulance,
    title: 'Ambulance & Emergency 24 Hrs',
    subtitle: 'Immediate Hotline: +91-7840089703',
    color: 'text-rose-400'
  },
  {
    icon: Stethoscope,
    title: '25+ Clinical Specialties Under One Roof',
    subtitle: 'Orthopaedics, Cardiology, Neuro, Gynae',
    color: 'text-sky-300'
  },
  {
    icon: ShieldCheck,
    title: 'Empaneled with Major TPA & Cashless Panels',
    subtitle: 'Hassle-free Inpatient Hospitalization',
    color: 'text-emerald-300'
  }
];

export const RoyalMarquee = () => {
  return (
    <div className="bg-[#0C2340] border-y border-blue-400/20 py-3 relative overflow-hidden select-none">
      
      {/* Subtle Ambient Edge Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#0C2340] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#0C2340] to-transparent z-10 pointer-events-none"></div>

      {/* Continuously Sliding Infinite Track */}
      <div className="animate-marquee flex items-center gap-8 text-white">
        
        {/* First Set */}
        {MARQUEE_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`item-1-${idx}`}
              className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shrink-0 group cursor-default"
            >
              <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold tracking-wide text-white group-hover:text-sky-300 transition-colors">
                  <span>{item.title}</span>
                </div>
                <div className="text-[10px] text-white/60 font-medium">
                  {item.subtitle}
                </div>
              </div>
            </div>
          );
        })}

        {/* Duplicate Set for Seamless Continuous Looping */}
        {MARQUEE_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`item-2-${idx}`}
              className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shrink-0 group cursor-default"
            >
              <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold tracking-wide text-white group-hover:text-sky-300 transition-colors">
                  <span>{item.title}</span>
                </div>
                <div className="text-[10px] text-white/60 font-medium">
                  {item.subtitle}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
