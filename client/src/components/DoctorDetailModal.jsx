import React from 'react';
import { X, Calendar, Clock, MapPin, Award, Languages, CheckCircle2, Stethoscope } from 'lucide-react';

export const DoctorDetailModal = ({ doctor, isOpen, onClose, onBookConsultation }) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Doctor Header */}
        <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-5 items-start pb-5 sm:pb-6 border-b border-gray-100">
          <img
            src={doctor.image}
            alt={doctor.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600';
            }}
            className="w-18 h-18 sm:w-24 sm:h-24 rounded-2xl object-cover object-top border-2 border-slate-200 bg-slate-50 shrink-0"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded inline-block mb-1.5">
              {doctor.departmentName}
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0B2545]">
              {doctor.name}
            </h3>
            <p className="text-xs text-gray-700 font-semibold mt-0.5">
              {doctor.qualification}
            </p>
            <p className="text-xs text-[#637386] mt-0.5">
              {doctor.designation} &middot; <strong className="text-[#0284C7]">{doctor.experienceYears} Years Experience</strong>
            </p>
          </div>
        </div>

        {/* Body content */}
        <div className="py-4 sm:py-5 space-y-4 text-xs">
          
          {/* OPD Schedule */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-200/80 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#0B2545]">
              <Clock className="w-4 h-4 text-[#0284C7]" />
              <span>Outpatient Clinic Schedule & Location</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 pl-6">
              <div>
                <span className="font-medium text-gray-800">OPD Days: </span>
                <span>{doctor.opdSchedule}</span>
              </div>
              <div>
                <span className="font-medium text-gray-800">Room / Clinic: </span>
                <span>{doctor.room}</span>
              </div>
            </div>
          </div>

          {/* Clinical Focus / Specializations */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Key Clinical Focus & Specializations</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {doctor.specializations?.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded bg-gray-50 border border-gray-100 text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages Spoken */}
          {doctor.languages && (
            <div className="flex items-center gap-2 text-gray-600">
              <Languages className="w-4 h-4 text-gray-400" />
              <span>Consultations conducted in: <strong>{doctor.languages.join(', ')}</strong></span>
            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 text-center"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookConsultation(doctor);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#0284C7] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-sky-300" />
            <span>Book Consultation with {doctor.name.split(' ')[1] || doctor.name}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
