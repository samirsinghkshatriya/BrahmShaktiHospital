import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Receipt,
  FileText,
  Activity,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Plus,
  X,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const todayISO = () => new Date().toISOString().split('T')[0];

export const PatientDashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule modal state
  const [rescheduleFor, setRescheduleFor] = useState(null);
  const [rsDate, setRsDate] = useState('');
  const [rsSlot, setRsSlot] = useState('');
  const [rsSlots, setRsSlots] = useState([]);
  const [rsLoading, setRsLoading] = useState(false);
  const [rsSubmitting, setRsSubmitting] = useState(false);

  const fetchPatientData = async () => {
    try {
      const [aptRes, invRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/billing/invoices')
      ]);
      if (aptRes.data.success) setAppointments(aptRes.data.data);
      if (invRes.data.success) setInvoices(invRes.data.data);
    } catch (err) {
      console.error('Error fetching patient portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const loadSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    setRsLoading(true);
    setRsSlot('');
    try {
      const res = await api.get('/appointments/slots', { params: { doctorId, date } });
      if (res.data.success) setRsSlots(res.data.data || []);
      else setRsSlots([]);
    } catch (err) {
      toast.error('Could not load available slots');
      setRsSlots([]);
    } finally {
      setRsLoading(false);
    }
  };

  const openReschedule = (apt) => {
    setRescheduleFor(apt);
    setRsDate('');
    setRsSlot('');
    setRsSlots([]);
  };

  const handleCancel = async (apt) => {
    if (!window.confirm(`Cancel appointment ${apt.appointmentId} with Dr. ${apt.doctorName}?`)) return;
    try {
      const res = await api.put(`/appointments/${apt.appointmentId || apt._id}/cancel`, { cancellationReason: 'Cancelled by patient' });
      if (res.data.success) {
        toast.success('Appointment cancelled');
        fetchPatientData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleReschedule = async () => {
    if (!rsDate || !rsSlot) { toast.error('Select a new date and slot'); return; }
    setRsSubmitting(true);
    try {
      const res = await api.put(`/appointments/${rescheduleFor.appointmentId || rescheduleFor._id}/reschedule`, { date: rsDate, timeSlot: rsSlot });
      if (res.data.success) {
        toast.success('Appointment rescheduled');
        setRescheduleFor(null);
        fetchPatientData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reschedule appointment');
    } finally {
      setRsSubmitting(false);
    }
  };

  const canAct = (apt) => ['Pending', 'Confirmed'].includes(apt.status) && apt.date >= todayISO();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary to-primary p-6 sm:p-8 rounded-3xl text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs text-accent font-bold uppercase tracking-wider">
            Patient Health Records Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.name || 'Ramesh Chand'}
          </h2>
          <p className="text-xs text-slate-200">
            UHID / Patient ID: <strong>{user?.patientId || 'BSH-2026-001'}</strong> · Brahm Shakti Hospital
          </p>
        </div>

        <Link
          to="/appointments"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-secondary hover:bg-accent font-bold text-xs transition-all shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-primary" />
          <span>Book New Consultation</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-medical-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-medical-muted uppercase font-bold">Booked Appointments</span>
            <div className="text-xl font-black text-secondary">{appointments.length} Consultations</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-medical-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-medical-muted uppercase font-bold">Hospital Invoices</span>
            <div className="text-xl font-black text-secondary">{invoices.length} Paid Receipts</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-medical-border shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-50 text-secondary flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-medical-muted uppercase font-bold">Trust Health Status</span>
            <div className="text-xl font-black text-status-success">Active Beneficiary</div>
          </div>
        </div>
      </div>

      {/* Appointments History */}
      <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-medical-border">
          <div>
            <h3 className="text-base font-bold text-secondary">My Consultations & Appointments</h3>
            <p className="text-xs text-medical-muted">History of past and upcoming appointments with doctors.</p>
          </div>
          <Link to="/appointments" className="text-xs font-bold text-primary hover:underline">
            Book Next Appointment ↗
          </Link>
        </div>

        {loading ? (
          <div className="h-40 rounded-xl bg-medical-coolgray animate-shimmer"></div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-medical-muted">No appointments booked yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-medical-coolgray text-secondary uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Token / UHID</th>
                  <th className="py-3 px-4 font-bold">Doctor & Department</th>
                  <th className="py-3 px-4 font-bold">Date & Time Slot</th>
                  <th className="py-3 px-4 font-bold">Consultation Fee</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Clinical Advice / Notes</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {appointments.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-medical-coolgray/50">
                    <td className="py-3 px-4 font-bold text-primary">
                      {apt.appointmentId}
                      {apt.uhid && <span className="block text-[10px] font-medium text-medical-muted">{apt.uhid}{apt.tokenNumber ? ` · Token #${apt.tokenNumber}` : ''}</span>}
                    </td>
                    <td className="py-3 px-4 font-bold text-secondary">
                      {apt.doctorName}
                      <span className="block text-[10px] text-primary font-medium">{apt.departmentName}</span>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {apt.date} · {apt.timeSlot}
                    </td>
                    <td className="py-3 px-4 font-bold text-secondary">
                      ₹{apt.fee} ({apt.paymentStatus})
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : apt.status === 'Cancelled' ? 'bg-red-100 text-status-error' : 'bg-green-100 text-status-success'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-medical-muted italic">
                      {apt.doctorNotes || 'No notes entered yet.'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {canAct(apt) ? (
                        <div className="inline-flex gap-2">
                          <button onClick={() => openReschedule(apt)} className="px-2.5 py-1 rounded-lg border border-medical-border text-[10px] font-bold text-secondary hover:border-primary hover:text-primary inline-flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" /> Reschedule
                          </button>
                          <button onClick={() => handleCancel(apt)} className="px-2.5 py-1 rounded-lg border border-medical-border text-[10px] font-bold text-status-error hover:bg-red-50 inline-flex items-center gap-1">
                            <X className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-medical-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoices & Bills History */}
      <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-medical-border">
          <div>
            <h3 className="text-base font-bold text-secondary">My Billing Invoices & Receipts</h3>
            <p className="text-xs text-medical-muted">Download or review certified hospital receipts.</p>
          </div>
        </div>

        {loading ? (
          <div className="h-32 rounded-xl bg-medical-coolgray animate-shimmer"></div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-xs text-medical-muted">No billing invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-medical-coolgray text-secondary uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Invoice Number</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Billing Date</th>
                  <th className="py-3 px-4 font-bold">Amount Paid</th>
                  <th className="py-3 px-4 font-bold">Payment Mode</th>
                  <th className="py-3 px-4 font-bold text-right">Receipt Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {invoices.map((inv) => (
                  <tr key={inv.invoiceNumber} className="hover:bg-medical-coolgray/50">
                    <td className="py-3 px-4 font-bold text-primary">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-medium">{inv.billType}</td>
                    <td className="py-3 px-4 text-medical-muted">{inv.date}</td>
                    <td className="py-3 px-4 font-black text-secondary">₹{inv.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-semibold">{inv.paymentMethod}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-status-success font-bold text-[10px]">
                        {inv.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <h3 className="text-lg font-bold text-secondary">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleFor(null)} className="text-medical-muted hover:text-secondary font-bold">✕</button>
            </div>
            <div className="text-xs text-medical-muted">
              Currently: <strong className="text-secondary">{rescheduleFor.doctorName}</strong> · {rescheduleFor.date} · {rescheduleFor.timeSlot}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-medical-muted">New Date</label>
              <input type="date" min={todayISO()} value={rsDate} onChange={(e) => { setRsDate(e.target.value); loadSlots(rescheduleFor.doctorId, e.target.value); }} className="w-full p-3 rounded-xl border border-medical-border text-xs focus:border-primary focus:outline-hidden" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-medical-muted">Available Slots</label>
              {rsLoading ? (
                <div className="flex items-center gap-2 text-xs text-medical-muted py-3"><Loader2 className="w-4 h-4 animate-spin" /> Loading slots…</div>
              ) : !rsDate ? (
                <div className="text-xs text-medical-muted py-2">Select a date to view real availability.</div>
              ) : rsSlots.length === 0 ? (
                <div className="text-xs text-medical-muted py-2">The doctor is not available on this date.</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {rsSlots.map((s) => {
                    const open = (s.remaining ?? (s.capacity - s.bookedCount)) > 0 && !s.isClosed;
                    return (
                      <button key={s.timeSlot || s._id} disabled={!open} onClick={() => setRsSlot(s.timeSlot)} className={`p-2.5 rounded-xl border text-[11px] font-bold transition-colors ${rsSlot === s.timeSlot ? 'border-primary bg-primary text-white' : open ? 'border-medical-border text-secondary hover:border-primary' : 'border-medical-border text-medical-muted line-through cursor-not-allowed bg-medical-coolgray'}`}>
                        {s.timeSlot}
                        <span className="block text-[9px] font-normal opacity-80">{open ? `${s.remaining ?? (s.capacity - s.bookedCount)} open` : 'Full'}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setRescheduleFor(null)} className="flex-1 py-3 rounded-xl border border-secondary text-secondary text-xs font-bold">Keep Current</button>
              <button onClick={handleReschedule} disabled={!rsSlot || rsSubmitting} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold disabled:opacity-50 inline-flex items-center justify-center gap-2">
                {rsSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboardPage;
