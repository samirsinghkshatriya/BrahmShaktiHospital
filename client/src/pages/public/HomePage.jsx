import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  PhoneCall,
  ShieldCheck,
  Award,
  Users,
  Activity,
  HeartPulse,
  Droplets,
  Building2,
  Stethoscope,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Star,
  Ambulance,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';

export const HomePage = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors')
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.data.slice(0, 6));
        if (docRes.data.success) setDoctors(docRes.data.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. Hero Section - Modern Split Layout */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary-50 via-white to-medical-coolgray pt-8 lg:pt-16 pb-12 lg:pb-20 border-b border-medical-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary/20 text-primary text-xs font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>NABH Accredited · Brahm Shakti Trust (Regd.)</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.12]">
                Your Health, <br />
                <span className="teal-gradient-text">Our Priority.</span>
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-sm sm:text-base text-medical-muted leading-relaxed max-w-2xl font-normal">
                Welcome to <strong>Brahm Shakti Hospital</strong>, a 250-bedded tertiary healthcare institution located at Pocket C, Budh Vihar, New Delhi. Dedicated to high-standard, subsidized medical care with 24x7 emergency trauma, advanced cardiac cath lab, and continuous renal dialysis.
              </p>

              {/* CTAs Above the Fold */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  to="/appointments"
                  className="flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm sm:text-base font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </Link>

                <Link
                  to="/departments"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl bg-white border border-medical-border hover:border-primary text-secondary hover:text-primary text-sm sm:text-base font-semibold shadow-sm transition-all"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Emergency Contact Strip */}
              <div className="pt-4 border-t border-medical-border/80 flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-status-error flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs text-medical-muted font-bold uppercase">24x7 Emergency Line</div>
                    <a href="tel:7840089703" className="text-secondary font-black text-sm sm:text-base hover:text-status-error">
                      7840089703
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs text-medical-muted font-bold uppercase">Mobile ICU Dispatch</div>
                    <span className="text-secondary font-bold text-sm sm:text-base">North-West Delhi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Image Card */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
                  alt="Brahm Shakti Hospital Modern Tertiary Facility"
                  className="w-full h-[280px] sm:h-[380px] lg:h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent"></div>

                {/* Floating Highlight Card */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl glass-panel shadow-lg border border-white/40 text-secondary">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping shrink-0"></span>
                      <span className="text-[11px] sm:text-xs font-bold uppercase text-primary">Live Capacity</span>
                    </div>
                    <span className="text-[11px] sm:text-xs font-extrabold text-secondary">250 Beds Active</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-medical-muted font-medium line-clamp-2 sm:line-clamp-none">
                    Fully equipped with Modular Surgical Suites, 24x7 Cath Lab, and Level-III NICU.
                  </p>
                </div>
              </div>

              {/* Trust Badge Floating */}
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-white p-2.5 sm:p-3.5 rounded-2xl shadow-elevated border border-medical-border hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent text-accent-dark flex items-center justify-center font-bold text-xs sm:text-sm">
                  ★ 4.9
                </div>
                <div>
                  <div className="text-xs font-bold text-secondary">Patient Satisfaction</div>
                  <div className="text-[10px] text-medical-muted">Over 45,000+ Treated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hospital Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { number: '250+', suffix: 'Beds', title: 'Inpatient Capacity', desc: 'ICU, NICU & modern private rooms' },
            { number: '25+', suffix: 'Specialties', title: 'Clinical Disciplines', desc: 'From Cardiology to Ortho Spine' },
            { number: '24x7', suffix: 'Active', title: 'Casualty & Blood Bank', desc: 'Round-the-clock emergency desk' },
            { number: 'Subsidized', suffix: 'Care', title: 'Trust Ethos', desc: 'Brahm Shakti Trust philanthropic fee' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-medical-border shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">{stat.number}</span>
                  <span className="text-xs sm:text-sm font-bold text-secondary">{stat.suffix}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-secondary mt-1">{stat.title}</h3>
                <p className="text-[11px] sm:text-xs text-medical-muted mt-1 leading-relaxed">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Medical Departments */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Activity className="w-4 h-4" />
              <span>Super Specialties</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Featured Clinical Departments
            </h2>
          </div>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold text-sm"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="group bg-white rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={dept.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-secondary/80 text-white backdrop-blur-xs text-[11px] font-bold uppercase">
                  {dept.category || 'Specialty'}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-medical-muted mt-2 line-clamp-2 leading-relaxed">
                    {dept.shortDescription}
                  </p>
                  <div className="mt-4 pt-3 border-t border-medical-border text-xs text-medical-slate space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{dept.opdTimings || 'Mon - Sat: 09:00 AM - 05:00 PM'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-medical-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-secondary">
                    Consultation: <strong className="text-primary font-bold">₹{dept.consultationCharges || 800}</strong>
                  </span>
                  <Link
                    to={`/departments/${dept.id}`}
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-bold text-xs"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Consultant Doctor Profiles */}
      <section className="bg-white py-16 border-y border-medical-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Stethoscope className="w-4 h-4" />
                <span>Expert Medical Faculty</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                Senior Consultant Specialists
              </h2>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold text-sm"
            >
              <span>Explore Doctor Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-medical-coolgray rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 overflow-hidden bg-slate-200 relative">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold text-secondary">
                      ★ {doctor.rating || 4.9}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-secondary leading-tight">{doctor.name}</h3>
                    <p className="text-xs font-semibold text-primary mt-1">{doctor.designation}</p>
                    <p className="text-[11px] text-medical-muted mt-0.5">{doctor.qualification}</p>

                    <div className="mt-3 text-xs text-medical-slate space-y-1">
                      <div>Experience: <strong>{doctor.experienceYears}+ Years</strong></div>
                      <div>Fee: <strong>₹{doctor.consultationFee}</strong> (Subsidized)</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Brahm Shakti Hospital */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span>Philanthropic Healthcare Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Why Choose Brahm Shakti Hospital?
            </h2>
            <p className="text-medical-muted text-sm leading-relaxed">
              Managed by Brahm Shakti Trust (Regd.), our mission is to make super-specialty tertiary care accessible to all families in North-West Delhi without financial strain, backed by certified clinical excellence.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: 'NABH & NABL Accredited Infrastructure', desc: 'Strict adherence to national patient safety protocols and international laboratory precision.' },
                { title: '24x7 Cath Lab & Emergency Trauma', desc: 'Rapid STEMI heart attack intervention with door-to-balloon time under 45 minutes.' },
                { title: 'Subsidized High-Flux Hemodialysis', desc: 'Charitable dialysis center operating round the clock at subsidized trust rates.' },
                { title: 'Cashless Insurance & Government Panels', desc: 'Empaneled with CGHS, ECHS, DGEHS, and leading TPAs for cashless hospitalization.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-medical-border">
                  <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-secondary">{item.title}</h4>
                    <p className="text-xs text-medical-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600"
                  alt="Cath Lab Surgery"
                  className="rounded-2xl shadow-md h-36 sm:h-56 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
                  alt="Dialysis Care"
                  className="rounded-2xl shadow-md h-28 sm:h-40 w-full object-cover"
                />
              </div>
              <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-8">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600"
                  alt="NICU Incubator"
                  className="rounded-2xl shadow-md h-28 sm:h-40 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600"
                  alt="Orthopaedic Joint Surgery"
                  className="rounded-2xl shadow-md h-36 sm:h-56 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Patient Testimonials & Trust */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
              <Star className="w-4 h-4 fill-accent" />
              <span>Patient Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Words From Our Recovered Patients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Satish Narang',
                treatment: 'Total Knee Replacement',
                text: 'Dr. Dev Patel and the orthopaedic team at Brahm Shakti Hospital gave me a second chance to walk without pain. Subsidized package made it truly affordable for our family.',
                location: 'Rohini, Sector 22'
              },
              {
                name: 'Kavita Mathur',
                treatment: 'Emergency Cath Angioplasty',
                text: 'When my husband suffered severe chest pain at midnight, Brahm Shakti casualty team stabilized him in minutes. The 24x7 Cath Lab angioplasty saved his life. Eternally grateful.',
                location: 'Budh Vihar Phase I'
              },
              {
                name: 'Mohd. Salim',
                treatment: 'Maintenance Hemodialysis',
                text: 'I have been coming to Brahm Shakti dialysis wing for 2 years. Ultra-pure water system, friendly nurses, and philanthropic trust rates have relieved my family completely.',
                location: 'Pooth Khurd, Delhi'
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-accent mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-accent">{t.treatment} · {t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Ready to Book CTA Strip */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 sm:p-12 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-white text-center lg:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need Medical Guidance or Appointment?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Consult with senior specialists across 25+ disciplines. Instant online booking with confirmed slot generation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              to="/appointments"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-white text-secondary font-bold text-sm hover:bg-accent hover:text-secondary-dark shadow-md transition-all text-center hover:scale-105"
            >
              Book OPD Appointment
            </Link>
            <a
              href="tel:7840089703"
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors text-center"
            >
              Emergency: 7840089703
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
