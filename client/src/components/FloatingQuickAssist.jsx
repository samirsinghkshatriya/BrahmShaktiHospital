import React, { useState, useEffect } from 'react';
import { PhoneCall, Calendar, FileText, ArrowUp, X, MessageSquare, ChevronUp } from 'lucide-react';
import { hospitalInfo } from '../data/hospitalData';

export const FloatingQuickAssist = ({
  onOpenAppointment,
  onOpenEmergency,
  onOpenLabPortal
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside aria-label="Quick Patient Assistance" className="fixed bottom-4 right-3 sm:right-6 z-40 flex flex-col items-end gap-2">
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#0C2340] shadow-elevated border border-slate-200 flex items-center justify-center transition-all hover:-translate-y-0.5 active:scale-90"
          title="Scroll to top of page"
          aria-label="Back to Top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Floating Assist Bar */}
      <div className="bg-[#0C2340]/95 text-white rounded-full shadow-2xl border border-white/20 p-1 sm:p-1.5 flex items-center gap-1 sm:gap-1.5 backdrop-blur-md">
        
        {/* 1. Emergency Dial */}
        <button
          onClick={onOpenEmergency}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          title="24x7 Emergency Casualty Helpline"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">24x7 Casualty</span>
        </button>

        {/* 2. Book Appointment (Classic Hospital Blue) */}
        <button
          onClick={onOpenAppointment}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-[#006699] hover:bg-[#004D73] text-white text-xs font-semibold transition-all shadow-xs active:scale-95"
          title="Request Doctor Consultation"
        >
          <Calendar className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Book OPD</span>
        </button>

        {/* 3. Lab Reports */}
        <button
          onClick={onOpenLabPortal}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all active:scale-95"
          title="View Lab & Diagnostic Test Reports"
        >
          <FileText className="w-3.5 h-3.5 text-sky-300" />
          <span className="hidden sm:inline">Lab Reports</span>
        </button>

      </div>
    </aside>
  );
};
