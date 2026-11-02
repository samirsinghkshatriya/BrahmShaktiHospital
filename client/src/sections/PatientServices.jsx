import React from 'react';
import {
  Clock,
  Building2,
  CreditCard,
  Globe,
  PhoneCall,
  ArrowRight,
  Compass
} from 'lucide-react';
import { hospitalInfo } from '../data/hospitalData';

export const PatientServices = ({
  onAppointmentClick,
  onLabPortalClick,
  onInternationalClick,
  onEmergencyClick,
  onOpenAdmissions,
  onOpenBilling,
  onOpenVisitors
}) => {
  const patientHubCards = [
    {
      id: 'visitors',
      title: 'Visiting Hours & Passes',
      category: 'Inpatient Guidelines',
      description: 'Ward visiting hours (4–7 PM daily), ICU protocols, and attendant security pass guidelines.',
      icon: Clock,
      action: onOpenVisitors,
      ctaText: 'View Visiting Hours',
      badge: 'Daily 4:00 PM - 7:00 PM'
    },
    {
      id: 'admissions',
      title: 'Planned Admissions Guide',
      category: 'Hospitalization Prep',
      description: 'Checklist of required documents (Govt ID, Doctor slip), pre-admission desk, and room types.',
      icon: Building2,
      action: onOpenAdmissions,
      ctaText: 'Admissions Checklist',
      badge: '24x7 Admission Desk'
    },
    {
      id: 'billing',
      title: 'Cashless Insurance & TPA',
      category: 'Financial Clearance',
      description: 'Empanelment with Star Health, Medi Assist, ICICI Lombard, CGHS, ECHS, and 35+ TPAs.',
      icon: CreditCard,
      action: onOpenBilling,
      ctaText: 'Empaneled TPAs',
      badge: '35+ Empaneled Insurers'
    },
    {
      id: 'international',
      title: 'International Patient Desk',
      category: 'Global Healthcare',
      description: 'Dedicated medical visa invitation letters, language translators, and airport transfer support.',
      icon: Globe,
      action: onInternationalClick,
      ctaText: 'Medical Visa & Travel',
      badge: 'Patients from 45+ Countries'
    }
  ];

  return (
    <section id="patient-services" className="py-10 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-16">
      <div className="max-w-page mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4FA] text-[#006699] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>PATIENT & VISITOR ESSENTIALS</span>
          </div>
          <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2340] tracking-tight">
            Visiting & Hospital Guidance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Clear, transparent guidelines designed to remove stress and streamline your consultation, admission, or family visit.
          </p>
        </div>

        {/* 4-Card Focused Patient Essentials Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {patientHubCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-elevated transition-all flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#E8F4FA] text-[#006699] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 sm:px-2.5 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#0C2340] group-hover:text-[#006699] transition-colors mb-1.5 sm:mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 sm:mt-5 border-t border-slate-100">
                  <button
                    onClick={card.action}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F8FAFC] group-hover:bg-[#006699] text-[#0C2340] group-hover:text-white text-xs font-bold transition-all flex items-center justify-between active:scale-[0.99]"
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rapid Assistance Contact Bar */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#006699]">
              24-HOUR HOSPITAL BOARD & TELEPHONE DIRECTORY
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#0C2340]">
              Need immediate guidance on patient room location, admission status, or ambulance?
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 text-xs w-full md:w-auto">
            <a
              href={`tel:${hospitalInfo.contacts.emergency}`}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency 24x7: {hospitalInfo.contacts.emergency}</span>
            </a>
            <a
              href={`tel:${hospitalInfo.contacts.casualtyAlternate}`}
              className="px-4 py-2.5 rounded-xl bg-[#006699] hover:bg-[#004D73] text-white font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>Main Board: {hospitalInfo.contacts.casualtyAlternate}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
