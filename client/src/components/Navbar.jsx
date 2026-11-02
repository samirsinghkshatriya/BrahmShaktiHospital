import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Calendar,
  Search,
  Menu,
  X,
  ChevronDown,
  Globe,
  FileText,
  PhoneCall,
  Activity,
  Ambulance,
  Heart,
  Stethoscope,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { hospitalInfo } from '../data/hospitalData';

export const Navbar = ({
  onOpenAppointment,
  onOpenInternational,
  onOpenLabPortal,
  onOpenEmergency,
  onSelectDepartmentFilter,
  onSearchFocus,
  fontSize,
  onChangeFontSize
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (menuName) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleLanguage = () => {
    toast.success('ब्रह्म शक्ति अस्पताल — हिंदी भाषा विकल्प सक्रिय (Brahm Shakti Hospital Multilingual Active)', {
      duration: 3500
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white transition-all duration-300 shadow-sm border-b border-slate-200/90">
      
      {/* 1. Sleek, Minimal Top Utility Bar */}
      <div className="bg-[#0C2340] text-white text-xs py-1.5 px-3 sm:px-6 border-b border-white/10">
        <div className="max-w-page mx-auto flex items-center justify-between gap-4">
          
          {/* Left: 24-Hour Emergency Helpline */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-slate-300 font-medium text-[11px] sm:text-xs">
                24x7 Emergency:
              </span>
              <a
                href={`tel:${hospitalInfo.contacts.emergency}`}
                className="font-bold text-white hover:text-rose-200 transition-colors tracking-wide text-[11px] sm:text-xs"
              >
                +91-{hospitalInfo.contacts.emergency}
              </a>
            </div>

            <span className="hidden sm:inline text-white/20">|</span>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 text-[11px] sm:text-xs">
              <span>Hospital Desk:</span>
              <a href={`tel:${hospitalInfo.contacts.casualtyAlternate}`} className="font-semibold text-white hover:underline">
                {hospitalInfo.contacts.casualtyAlternate}
              </a>
            </div>
          </div>

          {/* Right: Minimal Essentials (Location, Lab Reports, Language) */}
          <div className="flex items-center gap-3 sm:gap-5 text-[11px] sm:text-xs">
            <span className="hidden md:inline text-slate-300 font-normal">
              Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi – 110085
            </span>

            <span className="hidden md:inline text-white/20">&middot;</span>

            <button
              onClick={onOpenLabPortal}
              className="text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Lab Reports</span>
            </button>

            <span className="text-white/20">|</span>

            <button
              onClick={toggleLanguage}
              className="text-slate-300 hover:text-white transition-colors font-medium text-[11px]"
              title="Toggle Hindi / English"
            >
              हिन्दी / ENG
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar (Clean, Distinct, Structured just like Brahm Shakti Hospital) */}
      <nav className={`max-w-page mx-auto px-3 sm:px-4 lg:px-6 transition-all duration-200 ${isScrolled ? 'py-2.5 sm:py-3' : 'py-3 sm:py-4'}`}>
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brahm Shakti Hospital Rectangular Logo (Acts as both emblem and name) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center group focus:outline-none shrink-0"
            aria-label="Brahm Shakti Hospital Home"
          >
            <img
              src="https://res.cloudinary.com/urzka7oz/image/upload/v1792869678/bsh_img_01_02.gif"
              alt="Brahm Shakti Hospital"
              className="h-9 xs:h-11 sm:h-13 md:h-15 w-auto max-w-[200px] xs:max-w-[240px] sm:max-w-[320px] md:max-w-[360px] object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              loading="eager"
            />
          </a>

          {/* Center Navigation Links: Services, Find a Doctor, Specialties, Patient Services, Clinical Services, Health & Lifestyle */}
          <div className="hidden xl:flex items-center gap-1 text-[13.5px] font-bold text-[#0C2340] uppercase tracking-wide">
            
            {/* 1. SERVICES Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`px-3 py-2 rounded-lg flex items-center gap-1 hover:text-[#006699] hover:bg-slate-50 transition-colors ${
                  activeDropdown === 'services' ? 'text-[#006699] bg-slate-50' : ''
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'services' && (
                <div className="absolute left-0 top-full pt-2 w-72 z-50 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 p-2.5 text-xs space-y-1 normal-case">
                    <button
                      onClick={() => onOpenEmergency && onOpenEmergency()}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">24x7 Emergency & Trauma</span>
                      <span className="text-[11px] text-slate-500">Immediate casualty arrival & mobile ICU</span>
                    </button>
                    <button
                      onClick={() => scrollTo('doctor-search')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Outpatient (OPD) Clinics</span>
                      <span className="text-[11px] text-slate-500">Morning & evening consultant clinics</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollTo('specialties');
                        if (onSelectDepartmentFilter) onSelectDepartmentFilter('nephrology');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Subsidized Dialysis Center</span>
                      <span className="text-[11px] text-slate-500">24x7 renal care at subsidized fee</span>
                    </button>
                    <button
                      onClick={onOpenLabPortal}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-sky-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Diagnostic Radiology & Labs</span>
                      <span className="text-[11px] text-slate-500">CT Scan, MRI, Ultrasound & Blood Bank</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. FIND A DOCTOR */}
            <button
              onClick={() => scrollTo('doctor-search')}
              className="px-3 py-2 rounded-lg hover:text-[#006699] hover:bg-slate-50 transition-colors"
            >
              Find a Doctor
            </button>

            {/* 3. OUR SPECIALTIES Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('specialties')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`px-3 py-2 rounded-lg flex items-center gap-1 hover:text-[#006699] hover:bg-slate-50 transition-colors ${
                  activeDropdown === 'specialties' ? 'text-[#006699] bg-slate-50' : ''
                }`}
              >
                <span>Our Specialties</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeDropdown === 'specialties' && (
                <div className="absolute left-0 top-full pt-2 w-80 z-50 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 p-2.5 text-xs space-y-1 normal-case">
                    <button
                      onClick={() => {
                        scrollTo('doctor-search');
                        if (onSelectDepartmentFilter) onSelectDepartmentFilter('orthopaedics');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Orthopaedics & Joint Surgery</span>
                      <span className="text-[11px] text-slate-500">Knee/Hip replacement, Arthroscopy & Spine</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollTo('doctor-search');
                        if (onSelectDepartmentFilter) onSelectDepartmentFilter('cardiology');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Heart Surgeries & Interventions</span>
                      <span className="text-[11px] text-slate-500">Coronary Bypass & Cardiac Emergency</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollTo('doctor-search');
                        if (onSelectDepartmentFilter) onSelectDepartmentFilter('nephrology');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Nephrology & Kidney Care</span>
                      <span className="text-[11px] text-slate-500">24x7 Subsidized Dialysis & Renal Care</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollTo('doctor-search');
                        if (onSelectDepartmentFilter) onSelectDepartmentFilter('neurosciences');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Neuro & Neuro Spine Surgeries</span>
                      <span className="text-[11px] text-slate-500">Brain & Spine microsurgery & Stroke unit</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollTo('doctor-search');
                        if (onSelectDepartmentFilter) onSelectDepartmentFilter('oncology');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Cancer Treatment & Oncology</span>
                      <span className="text-[11px] text-slate-500">Surgical oncology & Day-care chemotherapy</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollTo('doctor-search');
                        if (onSelectDepartmentFilter) onSelectDepartmentFilter('cosmetic');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#006699] transition-colors"
                    >
                      <span className="font-bold text-[#0C2340] block">Aesthetic & Cosmetic Surgeries</span>
                      <span className="text-[11px] text-slate-500">Rhinoplasty, Liposuction & Reconstructions</span>
                    </button>
                    <div className="pt-2 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => scrollTo('specialties')}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold text-[#006699] hover:underline flex items-center justify-between"
                      >
                        <span>View All Hospital Specialties</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. PATIENT SERVICES */}
            <button
              onClick={() => scrollTo('patient-services')}
              className="px-3 py-2 rounded-lg hover:text-[#006699] hover:bg-slate-50 transition-colors"
            >
              Patient Services
            </button>

            {/* 5. CLINICAL SERVICES */}
            <button
              onClick={() => scrollTo('clinical-services')}
              className="px-3 py-2 rounded-lg hover:text-[#006699] hover:bg-slate-50 transition-colors"
            >
              Clinical Services
            </button>

            {/* 6. HEALTH & LIFESTYLE */}
            <button
              onClick={() => scrollTo('heritage')}
              className="px-3 py-2 rounded-lg hover:text-[#006699] hover:bg-slate-50 transition-colors"
            >
              Health & Lifestyle
            </button>
          </div>

          {/* Right Action CTAs: Search, 24x7 Ambulance, Book Appointment */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => {
                scrollTo('doctor-search');
                if (onSearchFocus) onSearchFocus();
              }}
              className="p-2 sm:p-2.5 text-slate-600 hover:text-[#0C2340] hover:bg-slate-100 rounded-xl transition-colors"
              title="Search Doctors or Services"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Emergency Hotline Button */}
            <button
              onClick={onOpenEmergency}
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors"
              title="24x7 Emergency Ambulance"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Ambulance 24x7</span>
            </button>

            {/* Primary Appointment Button (Classic Hospital Blue) */}
            <button
              onClick={onOpenAppointment}
              className="hidden md:inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#006699] hover:bg-[#004D73] text-white font-bold text-xs sm:text-sm uppercase tracking-wide transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-10 h-10 flex items-center justify-center text-slate-800 hover:text-[#0C2340] hover:bg-slate-100 rounded-xl transition-colors focus:outline-none shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-slate-200 pb-4 space-y-3 animate-fadeIn">
            
            {/* Primary Book Appointment CTA inside Mobile Menu */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppointment();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#006699] hover:bg-[#004D73] text-white font-bold text-xs uppercase tracking-wide shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Appointment</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEmergency();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wide shadow-sm"
              >
                <Ambulance className="w-4 h-4" />
                <span>Emergency 24x7</span>
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1 font-semibold text-sm text-[#0C2340]">
              <button
                onClick={() => scrollTo('doctor-search')}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Find a Doctor & OPD</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => scrollTo('specialties')}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Our Specialties</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => scrollTo('patient-services')}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Patient Services & TPA Panels</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => scrollTo('clinical-services')}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Clinical Services (CT, MRI, Dialysis)</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => scrollTo('heritage')}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>About Brahm Shakti Trust</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Contact Hospital & Location</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-400" />
              </button>
            </div>

            {/* Mobile Helplines Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Ambulance Hotline:</span>
                <a href={`tel:${hospitalInfo.contacts.emergency}`} className="font-bold text-rose-600 hover:underline">
                  +91-{hospitalInfo.contacts.emergency}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Hospital Board:</span>
                <a href={`tel:${hospitalInfo.contacts.casualtyAlternate}`} className="font-bold text-[#0C2340] hover:underline">
                  {hospitalInfo.contacts.casualtyAlternate}
                </a>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Hospital Email:</span>
                <a href={`mailto:${hospitalInfo.contacts.email}`} className="font-bold text-[#006699] hover:underline">
                  {hospitalInfo.contacts.email}
                </a>
              </div>
            </div>

          </div>
        )}

      </nav>

    </header>
  );
};
