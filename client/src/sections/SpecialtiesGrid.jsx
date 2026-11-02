import React, { useState, useEffect, useRef } from 'react';
import { centersOfExcellence, advancedTechnologies } from '../data/hospitalData';
import {
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  Cpu,
  Activity,
  Pause,
  Play
} from 'lucide-react';

export const SpecialtiesGrid = ({ onSelectSpecialty, onExploreAllSpecialties }) => {
  const [activeTab, setActiveTab] = useState('specialties'); // 'specialties' or 'technology'
  const [currentPage, setCurrentPage] = useState(0); // 0 or 1 for 3-card sets
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 6 seconds if not paused
  useEffect(() => {
    if (isPaused || activeTab !== 'specialties') return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev === 0 ? 1 : 0));
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, activeTab]);

  const displayedSpecialties = centersOfExcellence.slice(currentPage * 3, currentPage * 3 + 3);

  return (
    <section
      id="specialties"
      className="py-10 sm:py-24 bg-white border-b border-slate-200/80 scroll-mt-16 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-page mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4FA] text-[#006699] border border-blue-200/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-[#006699]" />
              <span>TERTIARY CENTERS OF EXCELLENCE</span>
            </div>
            <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2340] tracking-tight">
              Pioneering Clinical Disciplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Brahm Shakti Hospital houses 25+ clinical departments and high-tech surgical facilities, led by dedicated senior clinicians at highly subsidised fees.
            </p>
          </div>

          {/* Interactive Mode Toggle & Carousel Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            {activeTab === 'specialties' && (
              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setCurrentPage((prev) => (prev === 0 ? 1 : 0))}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#0C2340] shadow-xs transition-colors"
                  title="Previous Specialties"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-slate-600 px-1.5 sm:px-2">
                  {currentPage + 1} / 2
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => (prev === 0 ? 1 : 0))}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#0C2340] shadow-xs transition-colors"
                  title="Next Specialties"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tab switch */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-slate-200 flex-1 sm:flex-initial">
              <button
                onClick={() => setActiveTab('specialties')}
                className={`flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'specialties'
                    ? 'bg-[#006699] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0C2340]'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Flagship (6)</span>
              </button>
              <button
                onClick={() => setActiveTab('technology')}
                className={`flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'technology'
                    ? 'bg-[#006699] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0C2340]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Robotics & Tech</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Carousel / Grid Content */}
        {activeTab === 'specialties' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7 transition-all duration-500">
              {displayedSpecialties.map((specialty) => (
                <div
                  key={specialty.id}
                  className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-slate-200/90 hover:border-[#0D7B7B] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    {/* Card Image */}
                    <div className="relative overflow-hidden h-48 bg-slate-100">
                      <img
                        src={specialty.image}
                        alt={specialty.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/85 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#0C2340] border border-slate-200 shadow-xs flex items-center gap-1">
                        <span>{specialty.tagline}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold tracking-wide">
                        {specialty.stats}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="font-display font-bold text-lg text-[#0C2340] group-hover:text-[#006699] transition-colors">
                        {specialty.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {specialty.description}
                      </p>

                      {/* Clean Key Highlights */}
                      <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                        {specialty.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => onSelectSpecialty(specialty.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-[#006699] border border-slate-200 group-hover:border-[#006699] text-[#0C2340] group-hover:text-white text-xs font-bold transition-all flex items-center justify-between shadow-xs"
                    >
                      <span>View Consultants & OPD</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paging Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(0)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === 0 ? 'w-8 bg-[#006699]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label="Specialties Page 1"
              />
              <button
                onClick={() => setCurrentPage(1)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === 1 ? 'w-8 bg-[#006699]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label="Specialties Page 2"
              />
            </div>
          </div>
        ) : (
          /* Advanced Technology Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
            {advancedTechnologies.map((tech, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 hover:border-[#006699] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006699] bg-[#E8F4FA] px-2.5 py-0.5 rounded-full">
                      {tech.category}
                    </span>
                    <Activity className="w-4 h-4 text-teal-600" />
                  </div>

                  <h3 className="font-display font-bold text-base text-[#0C2340] group-hover:text-[#006699] transition-colors mb-2">
                    {tech.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {tech.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-600">
                  <span className="font-bold text-[#0C2340] block mb-0.5">Clinical Use:</span>
                  <span className="text-slate-500">{tech.application}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Explore All 71 Specialties Button */}
        <div className="mt-8 sm:mt-12 text-center px-2">
          <button
            onClick={onExploreAllSpecialties}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#006699] hover:bg-[#004D73] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm active:scale-[0.99]"
          >
            <span>View Full Directory of 71 Medical Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
