import React from 'react';
import { Globe, Plane, ShieldCheck, FileCheck, Users, PhoneCall, ArrowRight } from 'lucide-react';
import { internationalSupportSteps, hospitalInfo } from '../data/hospitalData';

export const InternationalPatients = ({ onOpenInternationalModal }) => {
  return (
    <section id="international" className="py-20 sm:py-24 bg-white border-b border-gray-200 scroll-mt-16">
      <div className="max-w-page mx-auto px-4 lg:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Global Care Framework & Process */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#EBF3FA] text-[#1769AA] text-xs font-semibold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL HEALTHCARE PATHWAY</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123653] tracking-tight leading-tight">
              International Patient Care & Medical Travel Support
            </h2>

            <p className="text-base text-[#384252] leading-relaxed">
              Patients travel to Brahm Shakti Hospital for advanced joint surgeries, subsidized dialysis, heart procedures, and neuro spine care. Our dedicated Patient Desk coordinates every detail from medical opinions to discharge.
            </p>

            {/* 4-Step Pathway */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {internationalSupportSteps.map((step) => (
                <div key={step.step} className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#1769AA] bg-white px-2 py-0.5 rounded border border-gray-200">
                      {step.step}
                    </span>
                    <h4 className="font-semibold text-xs text-[#123653]">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#637386] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Action CTA & Hotline */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenInternationalModal}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#123653] hover:bg-[#1769AA] text-white text-xs font-semibold transition-all shadow-subtle hover:shadow-elevated"
              >
                <span>International Patient Enquiry</span>
                <ArrowRight className="w-4 h-4 text-teal-300" />
              </button>

              <div className="text-xs text-[#637386] flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#1769AA]" />
                <span>
                  Direct Desk: <a href={`tel:${hospitalInfo.contacts.internationalDesk}`} className="font-bold text-[#123653] hover:underline">{hospitalInfo.contacts.internationalDesk}</a>
                </span>
              </div>
            </div>

          </div>

          {/* Right: Hospital International Desk Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-gray-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=900"
                alt="Patient Coordination and Lounge at Brahm Shakti Hospital"
                className="w-full h-[400px] sm:h-[460px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2236]/90 via-[#0B2236]/30 to-transparent"></div>

              {/* Informational overlay */}
              <div className="absolute bottom-5 inset-x-5 text-white space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  <ShieldCheck className="w-4 h-4 text-teal-300" />
                  <span>DEDICATED INTERNATIONAL LOUNGE</span>
                </div>
                <h4 className="font-serif font-semibold text-base text-white">
                  Multi-lingual Patient Assistance
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Support in Arabic, Russian, French, and regional dialects ensures comfortable communication for patients and accompanying relatives.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
