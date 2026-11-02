import React from 'react';
import { Landmark, Award, BookOpen, HeartHandshake, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const HeritageSection = ({ onOpenAppointment }) => {
  return (
    <section id="heritage" className="py-10 sm:py-20 bg-white border-b border-slate-200/90 scroll-mt-16">
      <div className="max-w-page mx-auto px-3 sm:px-4 lg:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Authentic Archival Visual & Clean Caption */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-elevated border border-slate-200/90 bg-white">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
                alt="Brahm Shakti Hospital Campus and Medical Heritage"
                className="w-full h-[260px] xs:h-[300px] sm:h-[450px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/85 via-transparent to-transparent"></div>

              {/* Clean Bottom Overlay Card */}
              <div className="absolute bottom-3 inset-x-3 sm:bottom-5 sm:inset-x-5 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-white/80 shadow-md">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#006699] mb-1">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>MANAGED BY BRAHM SHAKTI TRUST (REGD.)</span>
                </div>
                <div className="font-display font-bold text-sm sm:text-base text-[#0C2340]">
                  250-Bedded Tertiary Healthcare Project
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  Built to the level of a tertiary center providing high-tech facilities like Coronary Bypass, Kidney Care, and Spine Surgeries at highly subsidised fee.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Heritage & Humanitarian Pillars */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4FA] text-[#006699] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>THE TRUST ETHOS &amp; HEALTHCARE PHILOSOPHY</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2340] tracking-tight leading-snug sm:leading-tight">
              A Total Healthcare Ethos Run Through Our Corridors
            </h2>

            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal">
              <strong className="text-[#0C2340]">Brahm Shakti Hospital</strong> was founded under the aegis of <strong className="text-[#0C2340]">Brahm Shakti Trust (Regd.)</strong> with an unwavering conviction: <strong>advanced tertiary surgical and medical care must be delivered with compassion at highly affordable, subsidised rates</strong> for every family.
            </p>

            {/* 2 Core Tenets (Subsidized High-Tech Care, 24x7 Critical Response) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0C2340]">
                  <HeartHandshake className="w-4 h-4 text-[#006699]" />
                  <span>Subsidised Fee Mission</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  High-tech tertiary facilities like Coronary Bypass Surgery, Kidney Transplant &amp; Dialysis, and Joint Replacements provided at highly subsidised rates.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0C2340]">
                  <ShieldCheck className="w-4 h-4 text-[#006699]" />
                  <span>Cashless TPA &amp; Panels</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Empaneled with major health insurance companies, corporate networks, and government panels for smooth cashless admissions.
                </p>
              </div>
            </div>

            {/* Not-for-Profit Governance Note */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs">
              <div>
                <span className="font-bold text-[#0C2340] block">Brahm Shakti Trust Commitment</span>
                <span className="text-slate-600">Surplus resources are continuously reinvested to upgrade diagnostic technology and expand subsidized patient care.</span>
              </div>
              <button
                onClick={onOpenAppointment}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#006699] hover:bg-[#004D73] text-white font-bold shrink-0 transition-colors text-center active:scale-[0.99]"
              >
                Book Appointment
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
