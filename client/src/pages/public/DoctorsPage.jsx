import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Stethoscope,
  Search,
  Calendar,
  Clock,
  Filter,
  Star,
  Award,
  ArrowRight,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';

export const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || 'all');
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '1000');
  const [selectedDay, setSelectedDay] = useState('all');

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [docRes, deptRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/departments')
        ]);
        if (docRes.data.success) setDoctors(docRes.data.data);
        if (deptRes.data.success) setDepartments(deptRes.data.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedDept !== 'all' && doc.departmentId !== selectedDept) return false;
    if (Number(doc.consultationFee) > Number(maxFee)) return false;
    if (selectedDay !== 'all') {
      if (!doc.availableDays || !doc.availableDays.includes(selectedDay)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchDesig = doc.designation.toLowerCase().includes(q);
      const matchDept = doc.departmentName.toLowerCase().includes(q);
      const matchSpec = doc.specializations && doc.specializations.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchDesig && !matchDept && !matchSpec) return false;
    }
    return true;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Consultant Faculty Directory</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Meet Our Specialist Doctors
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Distinguished physicians and surgeons offering evidence-based outpatient consultations and inpatient surgical leadership.
          </p>
        </div>
      </section>

      {/* Filter and Content Area */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between lg:hidden mb-4 p-3 rounded-xl bg-white border border-medical-border">
          <div className="text-xs font-bold text-secondary flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span>Search & Specialty Filters</span>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold transition-all"
          >
            {filtersOpen ? 'Hide Filters ▲' : 'Show Filters ▼'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Filter Panel */}
          <div className={`lg:col-span-3 space-y-6 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-medical-border">
                <div className="flex items-center gap-2 font-bold text-secondary text-sm">
                  <Filter className="w-4 h-4 text-primary" />
                  <span>Filter Directory</span>
                </div>
                {(selectedDept !== 'all' || searchQuery || selectedDay !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedDept('all');
                      setSearchQuery('');
                      setSelectedDay('all');
                      setMaxFee('1000');
                    }}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Search by Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                  Doctor Name / Specialty
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-medical-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor name..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-medical-border focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-medical-border text-secondary font-medium focus:border-primary focus:outline-hidden"
                >
                  <option value="all">All Specialties</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Available Days */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-medical-muted tracking-wider">
                  Day of Consultation
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-medical-border text-secondary font-medium focus:border-primary focus:outline-hidden"
                >
                  <option value="all">Any Day</option>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <option key={d} value={d}>
                      {d}day
                    </option>
                  ))}
                </select>
              </div>

              {/* Fee Range Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase text-medical-muted tracking-wider">Max Fee</span>
                  <span className="text-primary font-bold">₹{maxFee}</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="1200"
                  step="50"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-medical-muted">
                  <span>₹600</span>
                  <span>₹1200</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Doctors Listing Grid */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-medical-muted">
              <span>Showing <strong>{filteredDoctors.length}</strong> verified doctors</span>
              <span className="text-accent-dark font-semibold">★ Subsidized Trust Consultation</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-medical-border space-y-3">
                <Stethoscope className="w-10 h-10 text-medical-muted mx-auto" />
                <h3 className="text-lg font-bold text-secondary">No Doctors Match Your Filters</h3>
                <p className="text-xs text-medical-muted">Try resetting search parameters or selecting all departments.</p>
                <button
                  onClick={() => {
                    setSelectedDept('all');
                    setSearchQuery('');
                    setSelectedDay('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover transition-all p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-24 h-24 rounded-2xl object-cover object-top border border-medical-border shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-primary-50 text-primary text-[10px] font-bold uppercase tracking-wider">
                              {doc.departmentName}
                            </span>
                            <span className="text-[11px] font-bold text-secondary">★ {doc.rating || 4.8}</span>
                          </div>

                          <h3 className="text-lg font-bold text-secondary leading-tight">{doc.name}</h3>
                          <p className="text-xs font-semibold text-primary">{doc.designation}</p>
                          <p className="text-[11px] text-medical-muted">{doc.qualification}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-medical-border space-y-1.5 text-xs text-medical-slate">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{doc.opdSchedule}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Experience: <strong>{doc.experienceYears}+ Years</strong></span>
                          <span>Fee: <strong className="text-primary font-bold">₹{doc.consultationFee}</strong></span>
                        </div>
                      </div>

                      {/* Specialization Tags */}
                      {doc.specializations && doc.specializations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {doc.specializations.slice(0, 2).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-medical-coolgray text-[10px] font-medium text-secondary border border-medical-border"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-medical-border flex items-center gap-2">
                      <Link
                        to={`/doctors/${doc.id}`}
                        className="flex-1 py-2.5 text-center rounded-xl border border-secondary text-secondary hover:bg-secondary hover:text-white text-xs font-bold transition-all"
                      >
                        Doctor Profile
                      </Link>
                      <Link
                        to={`/appointments?doctor=${doc.id}&department=${doc.departmentId}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Slot</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;
