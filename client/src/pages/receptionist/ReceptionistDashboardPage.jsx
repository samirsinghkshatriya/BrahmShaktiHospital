import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Receipt,
  UserCheck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ReceptionistDashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Check-in
  const [patientCheckinId, setPatientCheckinId] = useState('');

  const fetchTodayAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  const handlePatientCheckin = async (aptId) => {
    try {
      const res = await api.put(`/appointments/${aptId}`, { status: 'Confirmed' });
      if (res.data.success) {
        toast.success(`Patient ${aptId} checked in at Reception counter!`);
        fetchTodayAppointments();
      }
    } catch (err) {
      toast.error('Check-in failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-secondary to-teal-800 p-6 sm:p-8 rounded-3xl text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs text-accent font-bold uppercase tracking-wider">
            OPD Front Office & Admissions
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Reception Desk Portal
          </h2>
          <p className="text-xs text-slate-200">
            Rapid patient check-in, walk-in registration, and counter token assignment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/patients"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Register Patient</span>
          </Link>
          <Link
            to="/appointments"
            className="px-4 py-2.5 rounded-xl bg-white text-secondary font-bold text-xs hover:bg-accent transition-all shadow-md flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>

      {/* Today's Queue & Check-In */}
      <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-medical-border">
          <div>
            <h3 className="text-base font-bold text-secondary">Today's Patient Check-In Queue</h3>
            <p className="text-xs text-medical-muted">Verify patient arrival and notify the consulting physician chamber.</p>
          </div>
          <span className="text-xs font-bold text-primary">{appointments.length} Scheduled</span>
        </div>

        {loading ? (
          <div className="h-48 rounded-xl bg-medical-coolgray animate-shimmer"></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Appointment ID</th>
                  <th className="py-3 px-4 font-bold">Patient Details</th>
                  <th className="py-3 px-4 font-bold">Doctor & Chamber</th>
                  <th className="py-3 px-4 font-bold">Time Slot</th>
                  <th className="py-3 px-4 font-bold">Fee Status</th>
                  <th className="py-3 px-4 font-bold">Queue Status</th>
                  <th className="py-3 px-4 font-bold text-right">Counter Check-In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {appointments.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-medical-coolgray/50">
                    <td className="py-3 px-4 font-bold text-primary">
                      {apt.appointmentId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-secondary">{apt.patientName}</div>
                      <div className="text-[10px] text-medical-muted">{apt.patientPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <div className="text-secondary font-bold">{apt.doctorName}</div>
                      <div className="text-[10px] text-primary">{apt.departmentName}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-secondary">
                      {apt.timeSlot}
                    </td>
                    <td className="py-3 px-4 font-black">
                      ₹{apt.fee} <span className="text-[10px] text-status-success font-bold ml-0.5">({apt.paymentStatus})</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        apt.status === 'Confirmed'
                          ? 'bg-green-100 text-status-success'
                          : apt.status === 'Completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {apt.status === 'Pending' ? (
                        <button
                          onClick={() => handlePatientCheckin(apt.appointmentId)}
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-[11px] transition-all shadow-xs"
                        >
                          Check In Patient
                        </button>
                      ) : (
                        <span className="text-[11px] text-status-success font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Checked In</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Desk Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/patients"
          className="p-5 rounded-2xl bg-white border border-medical-border shadow-soft hover:shadow-card-hover transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-secondary text-sm">Register Walk-In</h4>
            <p className="text-[11px] text-medical-muted">Generate new patient ID</p>
          </div>
        </Link>

        <Link
          to="/admin/billing"
          className="p-5 rounded-2xl bg-white border border-medical-border shadow-soft hover:shadow-card-hover transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-secondary text-sm">Counter Billing</h4>
            <p className="text-[11px] text-medical-muted">OPD slips & receipts</p>
          </div>
        </Link>

        <Link
          to="/doctors"
          className="p-5 rounded-2xl bg-white border border-medical-border shadow-soft hover:shadow-card-hover transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary-50 text-secondary flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-secondary text-sm">Doctors On Duty</h4>
            <p className="text-[11px] text-medical-muted">Verify active OPD chambers</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ReceptionistDashboardPage;
