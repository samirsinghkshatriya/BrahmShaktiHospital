import React from 'react';
import { quickStats } from '../data/hospitalData';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const InstitutionalFacts = () => {
  return (
    <section className="bg-white py-12 sm:py-16 border-b border-slate-200">
      <div className="max-w-page mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
          <div>
            <span className="text-xs font-bold text-[#006699] uppercase tracking-wider block mb-1">
              Verified Scale & Credentials
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0C2340] tracking-tight">
              A Multispecialty Tertiary Benchmark
            </h2>
          </div>
          <div className="text-xs text-slate-500 max-w-md">
            Serving the nation with unwavering medical ethics, postgraduate DNB teaching, and transparent healthcare.
          </div>
        </div>

        {/* 4-Stat High Impact Clean Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {quickStats.map((stat, idx) => (
            <div key={idx} className={`${idx !== 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''} space-y-1.5`}>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0C2340] tracking-tight">
                  {stat.number}
                </span>
                <span className="text-sm font-bold text-[#006699]">
                  {stat.suffix}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm text-slate-900">
                {stat.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quality Badges Ribbon */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">National Accreditation Board for Hospitals & Healthcare Providers (NABH)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Award className="w-4 h-4 text-[#006699]" />
            <span className="font-semibold">National Accreditation Board for Testing Laboratories (NABL)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <HeartHandshake className="w-4 h-4 text-[#006699]" />
            <span className="font-semibold">Brahm Shakti Trust (Regd.) Charitable Governance</span>
          </div>
        </div>

      </div>
    </section>
  );
};
