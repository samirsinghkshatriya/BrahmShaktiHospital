import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Clock,
  Calendar,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Receipt
} from 'lucide-react';
import api from '../../services/api';

export const OpdServicesPage = () => {
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
        if (deptRes.data.success) setDepartments(deptRes.data.data);
        if (docRes.data.success) setDoctors(docRes.data.data);
      } catch (err) {
        console.error('Error fetching OPD data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-14 pb-20">
      {/* Top Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Outpatient Department</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            OPD Clinical Services & Schedule
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Consultations across 25+ specialized outpatient clinics operating daily with senior specialists and subsidized Brahm Shakti Trust tariffs.
          </p>
        </div>
      </section>

      {/* OPD Guidelines & Process */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Registration / Token', desc: 'Visit Ground Floor OPD Counter or book online for immediate digital token assignment.' },
            { step: '02', title: 'Specialist Consultation', desc: 'Consult experienced consultants with complete vitals examination and diagnostic review.' },
            { step: '03', title: 'Diagnostic Support', desc: 'Direct on-campus NABL labs, X-ray, CT scan, and ultrasound within the same wing.' },
            { step: '04', title: 'Subsidized Pharmacy', desc: 'Collect prescribed medications from hospital 24x7 pharmacy at trust discounted pricing.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-3">
              <span className="text-2xl font-black text-primary">{item.step}</span>
              <h3 className="text-base font-bold text-secondary">{item.title}</h3>
              <p className="text-xs text-medical-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Complete OPD Schedule Table */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight">
              Department OPD Timings & Consultation Tariffs
            </h2>
            <p className="text-xs text-medical-muted mt-1">
              General OPD Hours: <strong>09:00 AM to 05:00 PM</strong> (Monday through Saturday)
            </p>
          </div>
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-hover"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Confirmed Slot</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-bold">Department</th>
                  <th className="py-4 px-6 font-bold">Location</th>
                  <th className="py-4 px-6 font-bold">OPD Schedule</th>
                  <th className="py-4 px-6 font-bold">Consultation Fee</th>
                  <th className="py-4 px-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-4 px-6 font-bold">
                      <div className="text-sm font-bold text-secondary">{dept.name}</div>
                      <div className="text-[11px] text-medical-muted">{dept.headOfDepartment}</div>
                    </td>
                    <td className="py-4 px-6 text-medical-muted">
                      {dept.floorLocation || 'Main Block'}
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {dept.opdTimings}
                    </td>
                    <td className="py-4 px-6 font-bold text-primary">
                      ₹{dept.consultationCharges || 800}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/appointments?department=${dept.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary hover:bg-primary hover:text-white font-bold transition-all text-[11px]"
                      >
                        <span>Book Slot</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* OPD Doctors Schedule Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <h2 className="text-2xl font-bold text-secondary tracking-tight">
          Specialist Faculty Schedules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-medical-border shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-secondary text-sm">{doc.name}</h4>
                  <div className="text-xs text-primary font-medium">{doc.departmentName}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-medical-border text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-medical-slate font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{doc.opdSchedule}</span>
                </div>
                <div className="text-secondary font-bold">
                  Fee: <strong className="text-primary">₹{doc.consultationFee}</strong>
                </div>
              </div>
              <Link
                to={`/appointments?doctor=${doc.id}&department=${doc.departmentId}`}
                className="w-full flex items-center justify-center py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs"
              >
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OpdServicesPage;
