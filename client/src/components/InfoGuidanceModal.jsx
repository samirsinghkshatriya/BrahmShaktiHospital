import React from 'react';
import { X, Clock, ShieldCheck, CreditCard, Users, FileCheck, Phone, CheckCircle2, Building2 } from 'lucide-react';
import { hospitalInfo } from '../data/hospitalData';

export const InfoGuidanceModal = ({ type, isOpen, onClose, onBookAppointment }) => {
  if (!isOpen || !type) return null;

  const contentMap = {
    admissions: {
      icon: Building2,
      badge: "INPATIENT SERVICES GUIDE",
      title: "Planned Admissions & Hospitalization Procedure",
      subtitle: "Everything you need to know before coming to Brahm Shakti Hospital for an inpatient procedure.",
      sections: [
        {
          title: "Checklist of Documents Needed at Admission",
          items: [
            "Original Doctor Admission Recommendation Slip",
            "Government Photo ID Proof (Aadhaar Card / Voter ID / Passport)",
            "Health Insurance TPA Card & Pre-Authorization approval (if applicable)",
            "Previous medical records, diagnostic test reports, and current medications"
          ]
        },
        {
          title: "Admission Desk Location & Hours",
          items: [
            "Central Admission Counter: Ground Floor, Main Hospital Block (Open 24x7)",
            "Planned surgical admissions are recommended to report by 8:00 AM on the day of surgery.",
            "Emergency admissions are processed directly via Emergency Casualty Desk."
          ]
        },
        {
          title: "Room Categories Available",
          items: [
            "Deluxe Single Private Suites (with attendant sleeping arrangements)",
            "Standard Single Air-Conditioned Rooms",
            "Twin-Sharing Semi-Private Rooms",
            "Multi-bed General Wards (Subsidized Trust Wards)"
          ]
        }
      ]
    },
    billing: {
      icon: CreditCard,
      badge: "FINANCIAL SERVICES & TPA",
      title: "Cashless Health Insurance (TPA) & Billing Desk",
      subtitle: "Brahm Shakti Hospital is empaneled with major health insurance companies, government schemes, and corporate entities.",
      sections: [
        {
          title: "Empaneled Third-Party Administrators (TPAs) & Insurers",
          items: [
            "Star Health, Medi Assist, ICICI Lombard, HDFC ERGO, Care Health Insurance",
            "Niva Bupa (Max Bupa), Bajaj Allianz, United India, New India Assurance",
            "Paramount TPA, Heritage Health, Raksha TPA, Vidal Health TPA",
            "Empaneled for CGHS, ECHS, and Delhi Government Employees (DGHS)"
          ]
        },
        {
          title: "Cashless Hospitalization Process",
          items: [
            "Step 1: Submit TPA card and admission recommendation to Cashless TPA Desk (Counter 6, Ground Floor).",
            "Step 2: Our hospital TPA coordinator submits the pre-authorization query to your insurer within 2 hours.",
            "Step 3: Initial approval received before or during admission."
          ]
        },
        {
          title: "Direct TPA Helpdesk Contact",
          items: [
            "TPA Cashless Desk Phone: 011-27531683",
            "Operating Hours: 8:00 AM – 9:00 PM (Monday to Saturday)"
          ]
        }
      ]
    },
    visitors: {
      icon: Users,
      badge: "VISITING REGULATIONS & SAFETY",
      title: "Visitor Hours, Attendant Passes & Hygiene Rules",
      subtitle: "Designed to maintain peaceful healing environments and rigorous clinical infection prevention standards.",
      sections: [
        {
          title: "Official Visiting Hours",
          items: [
            "General & Semi-Private Inpatient Wards: Daily 4:00 PM – 7:00 PM",
            "Intensive Care Units (ICU / CCU / NICU): Morning 11:00 AM – 12:00 PM | Evening 5:00 PM – 6:00 PM",
            "Only ONE attendant is permitted to enter the ICU at a time to minimize infection risks."
          ]
        },
        {
          title: "Attendant Pass Guidelines",
          items: [
            "One 24-hour Patient Attendant Pass is issued upon admission.",
            "One temporary Visitor Pass is valid strictly during official visiting hours.",
            "Children under 12 years of age are not permitted into inpatient wards and ICUs for their safety."
          ]
        },
        {
          title: "Hospital Safety Standards",
          items: [
            "Sanitize hands at bedside dispensers before and after touching patient surroundings.",
            "Outside cooked food and fresh flowers are strictly prohibited in ICU and transplant units.",
            "Strict silence must be maintained in patient corridors."
          ]
        }
      ]
    }
  };

  const activeContent = contentMap[type] || contentMap.admissions;
  const Icon = activeContent.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col p-4 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn my-auto overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 sm:mb-6 pr-6">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#006699] uppercase tracking-wider mb-1">
            <Icon className="w-4 h-4" />
            <span>{activeContent.badge}</span>
          </div>
          <h3 className="font-display font-bold text-lg sm:text-2xl text-[#0C2340]">
            {activeContent.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {activeContent.subtitle}
          </p>
        </div>

        {/* Sections Content */}
        <div className="space-y-3 sm:space-y-4 max-h-[55vh] overflow-y-auto pr-1 text-xs">
          {activeContent.sections.map((section, idx) => (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-[#F8FAFC] border border-gray-200/80 space-y-2">
              <h4 className="font-semibold text-xs sm:text-sm text-[#0C2340] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006699]"></span>
                <span>{section.title}</span>
              </h4>
              <ul className="space-y-1.5 text-gray-600 pl-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold shrink-0">&bull;</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-gray-500 w-full sm:w-auto text-center sm:text-left">
            Helpline: <strong>011-27531683</strong>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#006699] hover:bg-[#004D73] text-white text-xs font-semibold transition-colors text-center active:scale-[0.99]"
          >
            I Understand & Close
          </button>
        </div>

      </div>
    </div>
  );
};
