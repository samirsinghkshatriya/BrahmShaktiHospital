import React from 'react';
import { Search, Calendar, FileText, Ambulance, ArrowRight } from 'lucide-react';
import { hospitalInfo } from '../data/hospitalData';

export const QuickAccessPanel = ({
  onFindDoctorClick,
  onOpenAppointment,
  onLabResultsClick,
  onEmergencyClick
}) => {
  const cards = [
    {
      id: 'doctor',
      title: 'Find a Doctor',
      subtitle: 'Search 25+ medical departments, senior consultants & daily OPD clinic hours.',
      icon: Search,
      action: onFindDoctorClick,
      badge: 'OPD Directory',
      badgeColor: 'bg-blue-50 text-[#006699] border-blue-200',
      iconBg: 'bg-blue-50 text-[#006699]'
    },
    {
      id: 'appointment',
      title: 'Book Consultation',
      subtitle: 'Request an in-person OPD consultation, second opinion, or follow-up slot online.',
      icon: Calendar,
      action: onOpenAppointment,
      badge: 'Online Booking',
      badgeColor: 'bg-sky-50 text-[#006699] border-sky-200',
      iconBg: 'bg-sky-50 text-[#006699]'
    },
    {
      id: 'lab',
      title: 'Lab & Diagnostic Reports',
      subtitle: 'Access authorized NABL diagnostic pathology, CT, MRI, and imaging test results.',
      icon: FileText,
      action: onLabResultsClick,
      badge: 'Online Reports',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'emergency',
      title: '24x7 Ambulance Service',
      subtitle: 'Immediate trauma triage, critical care resuscitation, and mobile ICU dispatch.',
      icon: Ambulance,
      action: onEmergencyClick,
      badge: 'Emergency 24 Hrs',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-600',
      isEmergency: true
    }
  ];

  return (
    <section className="bg-white py-10 sm:py-16 border-b border-slate-200/90">
      <div className="max-w-page mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#006699] bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full inline-block">
            Brahm Shakti Hospital Portals
          </span>
          <h2 className="font-display text-xl sm:text-3xl font-extrabold text-[#0C2340] tracking-tight">
            How can we assist you today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Immediate patient services, doctor consultations, lab reports, and round-the-clock emergency care.
          </p>
        </div>

        {/* 4 Spacious, Beautiful Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={c.action}
                className={`p-5 sm:p-6 text-left rounded-2xl border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 active:scale-[0.99] ${
                  c.isEmergency
                    ? 'bg-rose-50/30 border-rose-200 hover:border-rose-400 hover:bg-rose-50/60 shadow-xs hover:shadow-md'
                    : 'bg-[#F8FAFC] border-slate-200/90 hover:border-[#006699]/60 hover:bg-white shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${c.iconBg}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full border ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>

                  <h3 className={`font-display font-bold text-base sm:text-lg mb-1.5 sm:mb-2 transition-colors ${
                    c.isEmergency ? 'text-rose-700 group-hover:text-rose-800' : 'text-[#0C2340] group-hover:text-[#006699]'
                  }`}>
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {c.subtitle}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                  <span className={c.isEmergency ? 'text-rose-700' : 'text-[#006699]'}>
                    {c.isEmergency ? `Call ${hospitalInfo.contacts.emergency}` : 'Access Portal'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
