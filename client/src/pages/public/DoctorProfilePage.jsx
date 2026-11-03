import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  PhoneCall,
  IndianRupee
} from 'lucide-react';
import api from '../../services/api';

export const DoctorProfilePage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        if (res.data.success) {
          setDoctor(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-secondary">Doctor Not Found</h2>
        <Link to="/doctors" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctors Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Top Banner */}
      <section className="bg-secondary text-white py-12 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <Link to="/doctors" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Doctor Directory</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
              {doctor.departmentName}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {doctor.name}
          </h1>
          <p className="text-base text-slate-300 max-w-3xl">
            {doctor.designation} · {doctor.qualification}
          </p>
        </div>
      </section>

      {/* Main Profile Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Doctor Bio & Credentials */}
          <div className="lg:col-span-7 space-y-8">
            {/* Overview Card */}
            <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-32 h-32 rounded-2xl object-cover object-top border-2 border-primary/20 shadow-md shrink-0"
                />
                <div className="space-y-2 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-secondary">{doctor.name}</h2>
                  <p className="text-xs font-bold text-primary">{doctor.designation}</p>
                  <p className="text-xs text-medical-muted">{doctor.qualification}</p>

                  <div className="pt-2 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap text-xs text-secondary justify-center sm:justify-start">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-medical-coolgray border border-medical-border text-center sm:text-left">
                      <span className="text-medical-muted block text-[10px] uppercase font-bold">Experience</span>
                      <strong className="text-xs sm:text-sm">{doctor.experienceYears}+ Years</strong>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-medical-coolgray border border-medical-border text-center sm:text-left">
                      <span className="text-medical-muted block text-[10px] uppercase font-bold">Fee</span>
                      <strong className="text-primary font-bold text-xs sm:text-sm">₹{doctor.consultationFee}</strong>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-medical-coolgray border border-medical-border text-center sm:text-left">
                      <span className="text-medical-muted block text-[10px] uppercase font-bold">Rating</span>
                      <strong className="text-amber-600 text-xs sm:text-sm">★ {doctor.rating || 4.9}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-4">
              <h3 className="text-xl font-bold text-secondary tracking-tight">
                Professional Biography
              </h3>
              <p className="text-medical-muted text-sm leading-relaxed">
                {doctor.bio || `${doctor.name} is a senior clinical specialist at Brahm Shakti Hospital, dedicated to providing ethical, evidence-based patient management and surgical precision.`}
              </p>
            </div>

            {/* Specializations & Procedures */}
            {doctor.specializations && doctor.specializations.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-4">
                <h3 className="text-xl font-bold text-secondary tracking-tight">
                  Clinical Focus & Specializations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctor.specializations.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-medical-coolgray border border-medical-border">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs font-semibold text-secondary">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OPD Schedule Card */}
            <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-4">
              <h3 className="text-xl font-bold text-secondary tracking-tight">
                OPD Schedule & Room Location
              </h3>
              <div className="p-4 rounded-xl bg-primary-50 border border-primary/20 space-y-2 text-xs text-secondary">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.opdSchedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-medical-muted" />
                  <span>Chamber: <strong>{doctor.room || 'OPD Block'}</strong>, Brahm Shakti Hospital</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Portal Entry (live slot booking happens in the portal) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-primary/20 shadow-elevated space-y-5 sticky top-24">
              <div>
                <span className="px-2.5 py-1 rounded bg-accent text-accent-dark text-[10px] font-bold uppercase tracking-wider">
                  Appointment Portal
                </span>
                <h3 className="text-xl font-black text-secondary mt-2">
                  Book Slot with {doctor.name}
                </h3>
                <p className="text-xs text-medical-muted mt-1">
                  Choose a real-time OPD slot in the hospital consultation portal. No login required.
                </p>
              </div>

              {/* Fee snapshot */}
              <div className="rounded-2xl border border-accent/50 bg-accent/10 p-4 space-y-2.5">
                <p className="flex items-center gap-1.5 text-xs font-black text-accent-dark uppercase tracking-wide">
                  <IndianRupee className="w-4 h-4" />
                  Consultation Fees
                </p>
                <div className="flex items-center justify-between bg-white rounded-xl border border-medical-border px-3 py-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary font-bold">Direct Consultation</span>
                  <span className="text-sm font-black text-secondary">₹{doctor.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-xl border border-medical-border px-3 py-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary font-bold">Follow-up</span>
                  <span className="text-sm font-black text-status-success">Free</span>
                </div>
              </div>

              {/* Chamber snapshot */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-medical-coolgray border border-medical-border">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-semibold text-secondary">{doctor.opdSchedule}</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-medical-coolgray border border-medical-border">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-semibold text-secondary">Chamber: <strong>{doctor.room || 'OPD Block'}</strong>, Brahm Shakti Hospital</span>
                </div>
              </div>

              <Link
                to={`/appointments?doctor=${doctor.id}&department=${doctor.departmentId}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md shadow-primary/20 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Choose Slot &amp; Book Appointment</span>
              </Link>

              <div className="pt-1 space-y-2">
                <p className="flex items-center gap-2 text-[11px] text-medical-muted font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  Live availability from the hospital scheduler · UHID issued instantly on confirmation
                </p>
                <a
                  href="tel:7840089703"
                  className="flex items-center gap-2 text-[11px] font-bold text-status-error hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Emergency? Call 24x7 helpline 7840089703
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorProfilePage;
