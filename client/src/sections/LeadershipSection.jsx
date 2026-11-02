import React from 'react';
import { Shield, Award, Users } from 'lucide-react';
import { leadershipMembers } from '../data/hospitalData';

export const LeadershipSection = () => {
  return (
    <section id="leadership" className="py-20 sm:py-24 bg-[#F5F7FA] border-b border-gray-200 scroll-mt-16">
      <div className="max-w-page mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white text-[#123653] border border-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-[#1769AA]" />
            <span>INSTITUTIONAL GOVERNANCE & STEWARDSHIP</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#123653] tracking-tight">
            Board of Management & Medical Direction
          </h2>
          <p className="text-sm text-[#637386] mt-2">
            Brahm Shakti Hospital is governed under the guidance of Brahm Shakti Trust (Regd.) and an experienced medical board dedicated to the highest standards of medical ethics, patient safety, and subsidized healthcare.
          </p>
        </div>

        {/* 3-Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadershipMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-gray-200/90 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#1769AA]/20 bg-gray-50 shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#123653]">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#1769AA] mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {member.credentials}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-gray-400">
                    Clinical Discipline: <span className="text-gray-700 font-normal">{member.department}</span>
                  </div>
                  <p className="text-[#637386] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Brahm Shakti Trust (Regd.)</span>
                <span className="font-semibold text-[#123653]">Board Member</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
