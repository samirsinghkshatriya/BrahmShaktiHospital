import React from 'react';
import { Heart, Users2, ShieldCheck, CheckCircle2, Stethoscope, ArrowRight } from 'lucide-react';

export const CommunityWelfare = ({ onVolunteerOrInquire }) => {
  const initiatives = [
    {
      title: "20% Free Inpatient Beds for EWS",
      detail: "In adherence to its founding trust charter, Brahm Shakti Hospital provides high-tech tertiary surgical and medical care with subsidized inpatient facilities for weaker sections of society."
    },
    {
      title: "Daily Subsidized Charity OPDs",
      detail: "Specialized morning charity clinics where thousands of patients receive clinical specialist consultations, essential blood investigations, and subsidized pharmaceuticals at nominal or zero cost."
    },
    {
      title: "Rural & Suburban Outreach Camps",
      detail: "Mobile medical teams conducted in rural Haryana, Uttar Pradesh, and Delhi NCR for early detection of cervical and breast cancers, diabetic retinopathy, and congenital cardiac disorders."
    },
    {
      title: "Disaster Relief & Emergency Mobilization",
      detail: "Immediate deployment of medical response teams, critical medication supplies, and trauma specialists during public health crises and regional natural disasters."
    }
  ];

  return (
    <section id="welfare" className="py-20 sm:py-24 bg-[#F5F7FA] border-b border-gray-200 scroll-mt-16">
      <div className="max-w-page mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white text-[#123653] border border-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span>HUMANITARIAN MANDATE & TRUST PHILOSOPHY</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#123653] tracking-tight">
            Compassionate Care for Economically Weaker Sections
          </h2>
          <p className="text-sm text-[#637386] mt-2">
            Founded on the principle that the highest quality tertiary medical care is a fundamental human dignity, not a privilege reserved for the few.
          </p>
        </div>

        {/* 4-Item Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initiatives.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-subtle hover:shadow-elevated transition-all space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EBF3FA] text-[#1769AA] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#123653]">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-[#637386] leading-relaxed pl-10">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-[#123653] to-[#1A4D75] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-serif font-bold text-base text-white">
              Brahm Shakti Trust Medical Welfare Board
            </div>
            <p className="text-xs text-white/80 mt-1">
              For assistance regarding subsidized care admissions, please contact our hospital desk.
            </p>
          </div>
          <a
            href="tel:01127531683"
            className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shrink-0 transition-colors border border-white/20"
          >
            Hospital Desk: 011-27531683
          </a>
        </div>

      </div>
    </section>
  );
};
