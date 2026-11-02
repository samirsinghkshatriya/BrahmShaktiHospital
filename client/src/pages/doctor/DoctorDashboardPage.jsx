import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileText,
  AlertCircle,
  Phone,
  Edit2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState('');

  const fetchDoctorAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!selectedApt) return;

    try {
      const res = await api.put(`/appointments/${selectedApt.appointmentId}`, {
        doctorNotes: clinicalNotes,
        status: 'Completed'
      });
      if (res.data.success) {
        toast.success('Clinical notes recorded & appointment marked completed.');
        setSelectedApt(null);
        fetchDoctorAppointments();
      }
    } catch (err) {
      toast.error('Failed to save clinical notes');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary to-primary p-6 sm:p-8 rounded-3xl text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs text-accent font-bold uppercase tracking-wider">
            Clinical Practitioner Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.name || 'Doctor'}
          </h2>
          <p className="text-xs text-slate-200">
            Assigned OPD Consultation Queue · Brahm Shakti Hospital
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/20">
          <Clock className="w-5 h-5 text-accent" />
          <div className="text-xs">
            <span className="text-slate-300 block text-[10px]">Today's OPD Shift</span>
            <strong className="text-white">09:30 AM - 02:00 PM</strong>
          </div>
        </div>
      </div>

      {/* OPD Queue Table */}
      <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-medical-border">
          <div>
            <h3 className="text-base font-bold text-secondary">My Assigned Patient Queue</h3>
            <p className="text-xs text-medical-muted">Review patient complaints, add clinical notes, and prescribe medicines.</p>
          </div>
          <span className="text-xs font-bold text-primary">{appointments.length} Consultations</span>
        </div>

        {loading ? (
          <div className="h-48 rounded-xl bg-medical-coolgray animate-shimmer"></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Slot Time</th>
                  <th className="py-3 px-4 font-bold">Patient Details</th>
                  <th className="py-3 px-4 font-bold">Symptoms / Chief Complaint</th>
                  <th className="py-3 px-4 font-bold">Type</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Consultation Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {appointments.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-medical-coolgray/50">
                    <td className="py-3 px-4 font-bold text-primary">
                      {apt.timeSlot}
                      <span className="block text-[10px] text-medical-muted font-normal">{apt.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-secondary">{apt.patientName}</div>
                      <div className="text-[10px] text-medical-muted">{apt.patientAge} Yrs · {apt.gender} · {apt.patientPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-medical-slate italic max-w-xs truncate">
                      "{apt.symptoms || 'General clinical review'}"
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {apt.appointmentType}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-status-success'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedApt(apt);
                          setClinicalNotes(apt.doctorNotes || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-[11px] transition-all shadow-xs"
                      >
                        {apt.doctorNotes ? 'Edit Notes' : 'Examine & Note'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clinical Notes Drawer / Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase">{selectedApt.appointmentId}</span>
                <h3 className="text-lg font-bold text-secondary">Clinical Record for {selectedApt.patientName}</h3>
              </div>
              <button onClick={() => setSelectedApt(null)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-medical-coolgray space-y-1">
                <div className="text-secondary font-bold">Chief Symptoms Reported:</div>
                <p className="text-medical-muted italic">"{selectedApt.symptoms || 'None reported'}"</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Physician Clinical Findings & Diagnosis</label>
                <textarea
                  rows={4}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Vitals: BP, Pulse. Examination findings, formal diagnosis, clinical follow-up timeline..."
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedApt(null)}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md"
                >
                  Save Notes & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;
