import React from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  MapPin,
  Mail,
  ShieldCheck,
  Clock,
  Heart,
  Activity,
  ArrowRight
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-14 pb-8 border-t border-secondary-light">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Highlight: Emergency & Ambulance Quick Response */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-5 sm:p-6 rounded-2xl mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 shadow-xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm shrink-0">
              <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-accent font-bold">24x7 Immediate Medical Assistance</div>
              <div className="text-base sm:text-xl lg:text-2xl font-black text-white tracking-wide leading-snug mt-0.5">
                Emergency Trauma & ICU Ambulance: <span className="text-accent underline font-black">7840089703</span>
              </div>
            </div>
          </div>
          <Link
            to="/appointments"
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-white text-primary font-bold text-xs sm:text-sm hover:bg-accent transition-colors shadow-md whitespace-nowrap text-center shrink-0"
          >
            Book Instant Consultation
          </Link>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Col 1: Hospital Overview */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-white">BRAHM SHAKTI</div>
                <div className="text-[11px] text-accent tracking-wider font-semibold uppercase">Hospital & Research Center</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              A 250-bedded premier tertiary healthcare facility operated by Brahm Shakti Trust (Regd.). Committed to philanthropic, affordable, and clinical excellence for the community.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-light" />
                <span>NABH Accredited Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-light" />
                <span>NABL Accredited Diagnostics Lab</span>
              </div>
            </div>
          </div>

          {/* Col 2: Clinical Departments */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4 border-b border-white/10 pb-2">
              Centers of Excellence
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/departments/orthopaedics" className="hover:text-primary-light transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-light" />
                  <span>Orthopaedics & Joint Replacement</span>
                </Link>
              </li>
              <li>
                <Link to="/departments/cardiology" className="hover:text-primary-light transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-light" />
                  <span>Cardiology & 24x7 Cath Lab</span>
                </Link>
              </li>
              <li>
                <Link to="/departments/nephrology" className="hover:text-primary-light transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-light" />
                  <span>Nephrology & Subsidized Dialysis</span>
                </Link>
              </li>
              <li>
                <Link to="/departments/neurosciences" className="hover:text-primary-light transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-light" />
                  <span>Neurology & Neuro Spine Surgery</span>
                </Link>
              </li>
              <li>
                <Link to="/departments/oncology" className="hover:text-primary-light transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-light" />
                  <span>Cancer Care & Day-Care Chemo</span>
                </Link>
              </li>
              <li>
                <Link to="/departments/pediatrics" className="hover:text-primary-light transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-primary-light" />
                  <span>Pediatrics & Level-III NICU</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4 border-b border-white/10 pb-2">
              Hospital Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/services/opd" className="hover:text-primary-light transition-colors">OPD Timings & Doctor Schedule</Link></li>
              <li><Link to="/services/ipd" className="hover:text-primary-light transition-colors">IPD Rooms & Admission Guidelines</Link></li>
              <li><Link to="/blood-bank" className="hover:text-primary-light transition-colors">Blood Bank Inventory & Donation</Link></li>
              <li><Link to="/pharmacy" className="hover:text-primary-light transition-colors">Hospital Pharmacy & Medicines</Link></li>
              <li><Link to="/facilities" className="hover:text-primary-light transition-colors">Diagnostic Labs & Radiology CT Scan</Link></li>
              <li><Link to="/login" className="hover:text-primary-light transition-colors">Staff & Patient Portal Login</Link></li>
            </ul>
          </div>

          {/* Col 4: Verified Hospital Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4 border-b border-white/10 pb-2">
              Contact & Location
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-primary-light shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi, Delhi, 110085
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-primary-light shrink-0" />
                <span>Emergency: 7840089703</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-primary-light shrink-0" />
                <span>General Reception: 011-27531683</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-light shrink-0" />
                <span>enquiry@brahmshaktihospital.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-accent">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Emergency & Blood Bank Open 24x7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Brahm Shakti Hospital. Managed by Brahm Shakti Trust (Regd.). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>NABH Accredited</span>
            <span>NABL Certified</span>
            <span>Cashless TPAs Empaneled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
