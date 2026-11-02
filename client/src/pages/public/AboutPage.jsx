import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Building2,
  Heart,
  Users,
  Target,
  Compass,
  CheckCircle2,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="space-y-16 lg:space-y-20 pb-20">
      {/* Header Banner */}
      <section className="bg-secondary text-white py-16 px-4 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Institution Overview</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            About Brahm Shakti Hospital
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            A 250-bedded multi-disciplinary tertiary healthcare center managed by Brahm Shakti Trust (Regd.), delivering world-class medical excellence with compassionate, subsidized care in North-West Delhi.
          </p>
        </div>
      </section>

      {/* Hospital Overview & History */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Compass className="w-4 h-4" />
              <span>Philanthropic Heritage</span>
            </div>
            <h2 className="text-3xl font-black text-secondary tracking-tight">
              A Legacy of Healing & Service to Humanity
            </h2>
            <p className="text-medical-muted text-sm leading-relaxed">
              Established under the benevolent aegis of <strong>Brahm Shakti Trust (Regd.)</strong>, Brahm Shakti Hospital was conceived to bridge the critical gap in super-specialty tertiary care for the semi-urban and urban populations of North-West Delhi and neighbouring areas.
            </p>
            <p className="text-medical-muted text-sm leading-relaxed">
              From our flagship premises at Pocket C, Budh Vihar Phase I, we have grown into a 250-bedded healthcare institution housing advanced flat-panel digital catheterization labs, 20-bed round-the-clock dialysis suites, modular laminar airflow operating theatres, and a dedicated 30-bed critical care intensive care unit.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white border border-medical-border">
                <div className="text-2xl font-black text-primary">250+</div>
                <div className="text-xs font-bold text-secondary mt-1">Inpatient Hospital Beds</div>
                <div className="text-[11px] text-medical-muted mt-0.5">ICU, CCU, NICU & Private Rooms</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-medical-border">
                <div className="text-2xl font-black text-primary">100%</div>
                <div className="text-xs font-bold text-secondary mt-1">Philanthropic Trust Model</div>
                <div className="text-[11px] text-medical-muted mt-0.5">Heavily Subsidized Tariffs</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
                alt="Brahm Shakti Hospital Modern Building"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Philosophy */}
      <section className="bg-white py-16 border-y border-medical-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <div className="p-8 rounded-2xl bg-medical-coolgray border border-medical-border space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-secondary">Our Vision</h3>
              <p className="text-sm text-medical-muted leading-relaxed">
                To be recognized as the most trusted healthcare landmark in Northern India, distinguished by ethical medical practices, innovative surgical excellence, and unwavering compassion for all socio-economic strata.
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 rounded-2xl bg-medical-coolgray border border-medical-border space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-secondary">Our Mission</h3>
              <p className="text-sm text-medical-muted leading-relaxed">
                To deliver comprehensive, subsidized, and prompt tertiary clinical care utilizing modern biomedical technology, certified infection prevention protocols, and continuous patient-centric empathy.
              </p>
            </div>

            {/* Healthcare Philosophy */}
            <div className="p-8 rounded-2xl bg-medical-coolgray border border-medical-border space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent text-accent-dark flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-secondary">Healthcare Philosophy</h3>
              <p className="text-sm text-medical-muted leading-relaxed">
                "Caring for you for Life." A total healthcare ethos runs through the corridors of Brahm Shakti, ensuring no patient is turned away due to lack of financial resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Infrastructure */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
            <Building2 className="w-4 h-4" />
            <span>Advanced Facilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
            World-Class Medical Infrastructure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: '24x7 Cath Lab Facility',
              desc: 'High-definition digital angiography for emergency heart attack stenting and coronary bypass evaluations.'
            },
            {
              title: 'Modular Surgical Theatres',
              desc: 'HEPA filtered ultra-clean air operating rooms for robotic knee replacements and neurosurgeries.'
            },
            {
              title: '20-Bed Hemodialysis Wing',
              desc: 'Ultra-pure reverse osmosis water plant with continuous dialysis shifts supported by trust subsidies.'
            },
            {
              title: 'Level-III NICU & Critical ICU',
              desc: 'Equipped with servo-controlled infant incubators, mechanical ventilators, and central monitoring.'
            }
          ].map((inf, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-medical-border shadow-soft">
              <CheckCircle2 className="w-6 h-6 text-primary mb-3" />
              <h4 className="text-base font-bold text-secondary">{inf.title}</h4>
              <p className="text-xs text-medical-muted mt-2 leading-relaxed">{inf.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accreditations & Standards */}
      <section className="bg-gradient-to-r from-secondary to-secondary-dark text-white py-14 px-4 rounded-3xl max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase">
              <Award className="w-4 h-4" />
              <span>Certified Quality Assurance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              NABH & NABL Accredited Healthcare Standards
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl">
              Brahm Shakti Hospital adheres rigorously to National Accreditation Board for Hospitals & Healthcare Providers (NABH) patient safety and clinical guidelines, with NABL-certified pathology diagnostics.
            </p>
          </div>
          <Link
            to="/appointments"
            className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md whitespace-nowrap transition-transform hover:scale-105"
          >
            Consult Our Specialists
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
