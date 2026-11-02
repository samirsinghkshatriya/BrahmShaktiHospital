import React from 'react';
import { PhoneCall, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { hospitalInfo } from '../data/hospitalData';

export const EmergencyBanner = ({ onOpenEmergencyModal }) => {
  return (
    <div className="bg-[#0B2236] text-white border-b border-white/10 text-xs py-2 px-4 transition-all">
      <div className="max-w-page mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Emergency Alert indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-red-300 tracking-wide uppercase text-[11px]">
            24x7 Emergency & Trauma Casualty:
          </span>
          <a
            href={`tel:${hospitalInfo.contacts.emergency}`}
            className="font-bold text-white hover:text-red-300 transition-colors flex items-center gap-1 underline underline-offset-2"
          >
            <PhoneCall className="w-3.5 h-3.5 inline text-red-400" />
            {hospitalInfo.contacts.emergency}
          </a>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="hidden md:inline text-white/80">
            Ambulance Dispatch: <a href={`tel:${hospitalInfo.contacts.ambulance}`} className="font-medium text-white hover:underline">{hospitalInfo.contacts.ambulance}</a>
          </span>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-4 text-white/80">
          <span className="hidden lg:flex items-center gap-1.5 text-[11px] text-white/70">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            NABH & NABL Accredited Tertiary Care
          </span>
          <button
            onClick={onOpenEmergencyModal}
            className="text-[11px] font-semibold text-white bg-red-600/90 hover:bg-red-600 px-2.5 py-0.5 rounded transition-colors"
          >
            Casualty & Ambulance Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
