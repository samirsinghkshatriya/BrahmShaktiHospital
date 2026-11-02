import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Calendar,
  Search,
  PhoneCall,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { hospitalInfo } from '../data/hospitalData';

const HERO_BANNERS = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1792870901/1bb0a89e-42fa-4402-831c-49d18bb2127e.png',
    alt: 'Brahm Shakti Hospital - Caring for you for Life'
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1792870901/480ba29b-228e-49c7-b439-65ab3d8ac86d.png',
    alt: 'Brahm Shakti Hospital - Advanced Tertiary Medical Care'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1792870902/ad226d6c-336b-4fe5-b97e-4a6678d88049.png',
    alt: 'Brahm Shakti Hospital - 250-Bedded Tertiary Healthcare Facility'
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1792870902/fa23529d-caea-4686-b2a9-2250866cb894.png',
    alt: 'Brahm Shakti Hospital - 24x7 Emergency and Critical Care'
  }
];

export const HeroSection = ({
  onFindDoctorClick,
  onOpenAppointment,
  onOpenEmergency
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);

  // Auto-scrolling timer - advances smoothly every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  };

  // Touch Swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  return (
    <section className="relative bg-[#F8FAFC] pb-6 sm:pb-10 pt-2 sm:pt-4 overflow-hidden">
      <div className="max-w-page mx-auto px-0 sm:px-4 lg:px-6">
        
        {/* Main Auto-Scrolling Banner Container */}
        <div
          className="relative w-full overflow-hidden rounded-none sm:rounded-2xl shadow-elevated border-y sm:border border-slate-200/90 bg-slate-900 group select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Banner Slides Carousel Track */}
          <div className="relative w-full aspect-[1983/793] max-h-[580px] min-h-[160px] xs:min-h-[200px]">
            {HERO_BANNERS.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  currentIndex === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover sm:object-fill"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Bottom Indicators & Controls Bar */}
          <div className="absolute bottom-2 sm:bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
              {HERO_BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full h-2 ${
                    currentIndex === idx
                      ? 'w-7 sm:w-8 bg-[#006699]'
                      : 'w-2 sm:w-2.5 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}

              {/* Play/Pause subtle indicator */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="ml-1 text-white/80 hover:text-white transition-colors"
                title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
                aria-label={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-white/70" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Bar directly beneath the Carousel */}
        <div className="mt-3 sm:mt-5 px-3 sm:px-0 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <button
            onClick={onOpenAppointment}
            className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-[#006699] hover:bg-[#004D73] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">Book Appointment</span>
          </button>

          <button
            onClick={() => onFindDoctorClick && onFindDoctorClick()}
            className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-white hover:bg-slate-50 text-[#0C2340] border border-slate-200/90 font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs hover:shadow-xs active:scale-[0.98]"
          >
            <Search className="w-4 h-4 text-[#006699] shrink-0" />
            <span className="truncate">Find a Doctor</span>
          </button>

          <button
            onClick={() => onFindDoctorClick && onFindDoctorClick()}
            className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-white hover:bg-slate-50 text-[#0C2340] border border-slate-200/90 font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs hover:shadow-xs active:scale-[0.98]"
          >
            <Clock className="w-4 h-4 text-[#006699] shrink-0" />
            <span className="truncate">Doctor Schedules</span>
          </button>

          <button
            onClick={onOpenEmergency}
            className="flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span className="truncate">Emergency 24x7</span>
          </button>
        </div>

      </div>
    </section>
  );
};
