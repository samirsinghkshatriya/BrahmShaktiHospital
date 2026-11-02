import React, { useState } from 'react';
import { Cpu, ShieldCheck, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { advancedTechnologies } from '../data/hospitalData';

export const TechnologySection = () => {
  const [activeTech, setActiveTech] = useState(0);

  const techImages = [
    {
      src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=900",
      alt: "Advanced Surgical Suites at Brahm Shakti Hospital"
    },
    {
      src: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=900",
      alt: "TrueBeam STx Stereotactic Radiotherapy Suite"
    },
    {
      src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900",
      alt: "3T High-Field Magnetic Resonance Imaging (MRI)"
    },
    {
      src: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=900",
      alt: "Advanced Extracorporeal Life Support & ECMO Unit"
    }
  ];

  return (
    <section id="technology" className="py-20 sm:py-28 bg-[#F5F7FA] border-b border-gray-200 scroll-mt-16">
      <div className="max-w-page mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8F4FA] text-[#006699] text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>ADVANCED CLINICAL INFRASTRUCTURE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0C2340] tracking-tight">
            Precision Medical Technology in Practice
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            State-of-the-art diagnostic imaging, robotic instrumentation, and cardiopulmonary life-support systems operated by credentialed super-specialists.
          </p>
        </div>

        {/* Interactive Technology Showcase (List + Visual) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Technology Selector List */}
          <div className="lg:col-span-6 space-y-3">
            {advancedTechnologies.map((tech, idx) => {
              const isActive = activeTech === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTech(idx)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#006699] shadow-elevated'
                      : 'bg-[#F8FAFC] border-gray-200/80 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006699]">
                      {tech.category}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                        <Activity className="w-3 h-3 text-teal-600" />
                        Clinical Active
                      </span>
                    )}
                  </div>

                  <h3 className={`font-display font-bold text-base mt-1 transition-colors ${
                    isActive ? 'text-[#0C2340]' : 'text-gray-800'
                  }`}>
                    {tech.name}
                  </h3>

                  <p className="text-xs text-[#637386] mt-1.5 leading-relaxed">
                    {tech.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-2 text-[11px] text-[#384252]">
                    <span className="font-semibold text-gray-500">Key Applications:</span>
                    <span className="truncate">{tech.application}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Controlled Photography View */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-gray-200 bg-white">
              <img
                src={techImages[activeTech].src}
                alt={techImages[activeTech].alt}
                className="w-full h-[360px] sm:h-[440px] object-cover transition-opacity duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2236]/90 via-[#0B2236]/20 to-transparent"></div>

              <div className="absolute bottom-5 inset-x-5 text-white">
                <div className="text-[10px] uppercase font-bold tracking-wider text-teal-400 mb-1">
                  VERIFIED MEDICAL CAPABILITY
                </div>
                <h4 className="font-serif font-bold text-lg text-white">
                  {advancedTechnologies[activeTech].name}
                </h4>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">
                  Integrated into multidisciplinary treatment pathways across oncology, critical care, and organ transplantation.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
