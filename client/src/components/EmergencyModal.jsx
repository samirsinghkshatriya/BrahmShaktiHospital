import React from 'react';
import { X, PhoneCall, Ambulance, AlertOctagon, ShieldAlert, MapPin, HeartPulse } from 'lucide-react';
import { hospitalInfo } from '../data/hospitalData';

export const EmergencyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border-2 border-red-500/20 animate-fadeIn my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
              24-HOUR TRAUMA & ACUTE RESUSCITATION
            </span>
            <h3 className="font-serif font-bold text-xl text-[#123653]">
              Emergency Casualty Protocol
            </h3>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Direct Calling Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${hospitalInfo.contacts.emergency}`}
              className="p-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex flex-col justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-red-200">CASUALTY HOTLINE</span>
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-base tracking-wide">{hospitalInfo.contacts.emergency}</span>
            </a>

            <a
              href={`tel:${hospitalInfo.contacts.ambulance}`}
              className="p-3.5 rounded-xl bg-[#006699] hover:bg-[#004D73] text-white font-bold flex flex-col justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-sky-200">AMBULANCE DISPATCH</span>
                <Ambulance className="w-4 h-4 text-sky-200" />
              </div>
              <span className="text-base tracking-wide">{hospitalInfo.contacts.ambulance}</span>
            </a>
          </div>

          {/* Rapid Triage Tiers */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200/90 space-y-2.5">
            <h4 className="font-semibold text-gray-900 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>Immediate Arrival Guidance & Location:</span>
            </h4>
            <div className="space-y-1.5 text-gray-600 pl-5">
              <p>
                &bull; <strong>Emergency Casualty Gate:</strong> Dedicated casualty reception at Brahm Shakti Hospital, <strong>Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi, Delhi, 110085</strong> (direct ambulance ramp access).
              </p>
              <p>
                &bull; <strong>Cardiac Emergency (Code Red):</strong> Immediate ECG & 24x7 Primary Angioplasty team ready within 20 minutes of arrival.
              </p>
              <p>
                &bull; <strong>Hyperacute Stroke (Code Blue):</strong> Rapid CT scan & thrombolysis protocols managed by attending neurologists.
              </p>
              <p>
                &bull; <strong>Blood Bank:</strong> 24x7 in-house blood component apheresis unit on standby.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 text-center">
            No prior appointment or registration card is required for acute trauma or casualty triage.
          </p>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>

        </div>
      </div>
    </div>
  );
};
