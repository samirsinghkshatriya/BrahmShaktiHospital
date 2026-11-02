import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  Droplets,
  Brain,
  ShieldAlert,
  Scissors,
  Baby,
  Ambulance,
  Clock,
  ArrowRight,
  ChevronRight,
  Stethoscope,
  Calendar,
  Building2
} from 'lucide-react';
import api from '../../services/api';

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        if (res.data.success) {
          setDepartments(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const categories = ['all', 'Super Specialty', 'Surgical Specialties', 'Clinical Specialties', 'Emergency & Critical Care'];

  const filteredDepts = selectedCategory === 'all'
    ? departments
    : departments.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-12 pb-20">
      {/* Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Clinical Specialties</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Hospital Departments & Centers of Excellence
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            From emergency 24x7 Cath Lab cardiology and advanced joint replacements to continuous renal dialysis and Level-III neonatal care.
          </p>
        </div>
      </section>

      {/* Main Grid with Category Filter */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-secondary border border-medical-border hover:border-primary hover:text-primary'
              }`}
            >
              {cat === 'all' ? 'All Departments' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDepts.map((dept) => (
              <div
                key={dept.id}
                className="group bg-white rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={dept.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-secondary/85 text-white backdrop-blur-xs text-[11px] font-bold uppercase">
                      {dept.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{dept.code}</span>
                      <span className="text-xs font-semibold text-secondary">
                        Fee: <strong className="text-primary">₹{dept.consultationCharges || 800}</strong>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-secondary mt-1 group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-medical-muted mt-2 leading-relaxed">
                      {dept.shortDescription}
                    </p>

                    {/* Key Services Offered */}
                    {dept.services && dept.services.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-medical-border">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-medical-muted mb-2">
                          Key Clinical Services:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {dept.services.slice(0, 3).map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-medical-coolgray text-[11px] font-medium text-secondary border border-medical-border"
                            >
                              {srv}
                            </span>
                          ))}
                          {dept.services.length > 3 && (
                            <span className="text-[11px] font-semibold text-primary self-center">
                              +{dept.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-medical-border text-xs text-medical-slate flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{dept.opdTimings}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-3">
                  <Link
                    to={`/departments/${dept.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-secondary text-secondary hover:bg-secondary hover:text-white text-xs font-bold transition-all"
                  >
                    <span>View Department</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/appointments?department=${dept.id}`}
                    className="flex items-center justify-center p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm"
                    title="Book Appointment"
                  >
                    <Calendar className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DepartmentsPage;
