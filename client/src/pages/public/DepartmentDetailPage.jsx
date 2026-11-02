import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Activity,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Stethoscope,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  ArrowLeft
} from 'lucide-react';
import api from '../../services/api';

export const DepartmentDetailPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get(`/departments/${id}`),
          api.get(`/doctors?department=${id}`)
        ]);

        if (deptRes.data.success) setDepartment(deptRes.data.data);
        if (docRes.data.success) setDoctors(docRes.data.data);
      } catch (err) {
        console.error('Error fetching department details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-secondary">Department Not Found</h2>
        <p className="text-medical-muted text-sm">The requested medical specialty could not be located.</p>
        <Link to="/departments" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Departments</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link to="/departments" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Departments</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
              {department.category}
            </span>
            <span className="text-xs font-bold text-slate-300">Code: {department.code}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {department.name}
          </h1>
          <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
            {department.shortDescription}
          </p>
        </div>
      </section>

      {/* Detail Content Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Info Col */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Card */}
            <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-4">
              <h2 className="text-2xl font-bold text-secondary tracking-tight">
                Specialty Overview & Clinical Scope
              </h2>
              <p className="text-medical-muted text-sm leading-relaxed">
                {department.description || department.shortDescription}
              </p>

              {department.headOfDepartment && (
                <div className="p-4 rounded-xl bg-medical-coolgray border border-medical-border flex items-center gap-3">
                  <Stethoscope className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-medical-muted font-bold uppercase">Clinical Head of Department</div>
                    <div className="text-sm font-bold text-secondary">{department.headOfDepartment}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Services Offered */}
            {department.services && department.services.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-6">
                <h3 className="text-xl font-bold text-secondary tracking-tight">
                  Procedures & Clinical Services Offered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {department.services.map((srv, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-medical-coolgray border border-medical-border">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-secondary">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Department Doctors */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-secondary tracking-tight">
                Consultant Specialists in {department.name}
              </h3>

              {doctors.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-medical-border text-center text-medical-muted text-sm">
                  Consultant faculty available via general OPD desk.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-white rounded-2xl overflow-hidden border border-medical-border shadow-soft p-5 flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-xl object-cover border border-medical-border"
                        />
                        <div>
                          <h4 className="font-bold text-secondary text-base">{doctor.name}</h4>
                          <p className="text-xs text-primary font-semibold mt-0.5">{doctor.designation}</p>
                          <p className="text-[11px] text-medical-muted mt-0.5">{doctor.qualification}</p>
                          <div className="mt-2 text-xs text-secondary">
                            Fee: <strong className="text-primary font-bold">₹{doctor.consultationFee}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-medical-border flex items-center gap-2">
                        <Link
                          to={`/doctors/${doctor.id}`}
                          className="flex-1 py-2 text-center rounded-lg border border-secondary text-secondary hover:bg-secondary hover:text-white text-xs font-bold transition-all"
                        >
                          Doctor Profile
                        </Link>
                        <Link
                          to={`/appointments?doctor=${doctor.id}&department=${department.id}`}
                          className="flex-1 py-2 text-center rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Book Slot
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Col */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Consultation Booking Card */}
            <div className="bg-gradient-to-br from-secondary to-secondary-dark text-white p-6 rounded-2xl shadow-xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-accent">
                Subsidized Consultation
              </div>
              <div className="text-3xl font-black text-white">
                ₹{department.consultationCharges || 800}
                <span className="text-xs font-normal text-slate-300 ml-1">/ OPD Visit</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Charitable tariff applied by Brahm Shakti Trust (Regd.) with zero hidden consultation charges.
              </p>

              <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{department.opdTimings}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{department.floorLocation || 'Main Hospital Block'}</span>
                </div>
              </div>

              <Link
                to={`/appointments?department=${department.id}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md transition-transform hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book OPD Slot</span>
              </Link>
            </div>

            {/* Emergency Casualty Card */}
            <div className="bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-status-error flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-medical-muted">Emergency Desk</div>
                  <div className="text-lg font-black text-secondary">7840089703</div>
                </div>
              </div>
              <p className="text-xs text-medical-muted leading-relaxed">
                Casualty physicians and trauma resuscitation teams on round-the-clock duty.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentDetailPage;
