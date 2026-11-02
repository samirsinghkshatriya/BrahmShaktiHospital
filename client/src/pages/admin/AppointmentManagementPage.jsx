import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Stethoscope,
  Building2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AppointmentManagementPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Reschedule / status modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [newStatus, setNewStatus] = useState('Confirmed');
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAppointments = async () => {
    try {
      const [aptRes, deptRes, docRes] = await Promise.all([
        api.get('/appointments', {
          params: {
            status: statusFilter !== 'all' ? statusFilter : undefined,
            departmentId: deptFilter !== 'all' ? deptFilter : undefined,
            date: dateFilter || undefined,
            search: search || undefined
          }
        }),
        api.get('/departments'),
        api.get('/doctors')
      ]);

      if (aptRes.data.success) setAppointments(aptRes.data.data);
      if (deptRes.data.success) setDepartments(deptRes.data.data);
      if (docRes.data.success) setDoctors(docRes.data.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, deptFilter, dateFilter]);

  const handleOpenStatusModal = (apt) => {
    setSelectedApt(apt);
    setNewStatus(apt.status);
    setNewDate(apt.date);
    setNewSlot(apt.timeSlot);
    setDoctorNotes(apt.doctorNotes || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.put(`/appointments/${selectedApt.appointmentId}`, {
        status: newStatus,
        date: newDate,
        timeSlot: newSlot,
        doctorNotes
      });

      if (res.data.success) {
        toast.success(`Appointment ${selectedApt.appointmentId} updated to ${newStatus}`);
        setModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      toast.error('Failed to update appointment');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickApprove = async (aptId) => {
    try {
      const res = await api.put(`/appointments/${aptId}`, { status: 'Confirmed' });
      if (res.data.success) {
        toast.success('Appointment Approved & Confirmed');
        fetchAppointments();
      }
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleQuickComplete = async (aptId) => {
    try {
      const res = await api.put(`/appointments/${aptId}`, { status: 'Completed' });
      if (res.data.success) {
        toast.success('Marked as Completed');
        fetchAppointments();
      }
    } catch (err) {
      toast.error('Failed to complete');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-secondary tracking-tight">Outpatient Appointment Queue</h2>
        <p className="text-xs text-medical-muted">
          Review, approve, reschedule, or cancel consultations across all clinical disciplines.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-medical-border shadow-soft flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-medical-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAppointments()}
            placeholder="Search patient, phone, ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-medical-border focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-medical-border font-medium text-secondary focus:border-primary focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="p-2 rounded-xl border border-medical-border font-medium text-secondary focus:border-primary focus:outline-hidden"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 rounded-xl border border-medical-border font-medium text-secondary focus:border-primary focus:outline-hidden"
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-primary font-bold hover:underline"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Appointments Listing Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
      ) : appointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-medical-border space-y-2">
          <Calendar className="w-8 h-8 text-medical-muted mx-auto" />
          <h4 className="font-bold text-secondary text-sm">No Appointments Found</h4>
          <p className="text-xs text-medical-muted">No consultations match the selected filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Appointment ID</th>
                  <th className="py-3.5 px-5 font-bold">Patient Details</th>
                  <th className="py-3.5 px-5 font-bold">Doctor & Department</th>
                  <th className="py-3.5 px-5 font-bold">Date & Time Slot</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold">Fee & Payment</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {appointments.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary">
                      {apt.appointmentId}
                      <span className="block text-[10px] text-medical-muted font-normal">{apt.appointmentType}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-secondary">{apt.patientName}</div>
                      <div className="text-[10px] text-medical-muted">
                        {apt.patientAge} Yrs · {apt.gender} · {apt.patientPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-secondary">{apt.doctorName}</div>
                      <div className="text-[10px] text-primary">{apt.departmentName}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-secondary">{apt.date}</div>
                      <div className="text-[10px] text-medical-muted">{apt.timeSlot}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          apt.status === 'Confirmed'
                            ? 'bg-green-100 text-status-success'
                            : apt.status === 'Completed'
                            ? 'bg-blue-100 text-blue-700'
                            : apt.status === 'Cancelled'
                            ? 'bg-red-100 text-status-error'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-medium">
                      <div className="font-bold text-secondary">₹{apt.fee}</div>
                      <span className="text-[10px] text-status-success font-semibold">{apt.paymentStatus}</span>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1 whitespace-nowrap">
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleQuickApprove(apt.appointmentId)}
                          className="px-2.5 py-1 rounded-lg bg-green-50 text-status-success font-bold hover:bg-status-success hover:text-white transition-colors"
                          title="Approve"
                        >
                          Approve
                        </button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleQuickComplete(apt.appointmentId)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-700 hover:text-white transition-colors"
                          title="Mark Complete"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenStatusModal(apt)}
                        className="px-2.5 py-1 rounded-lg bg-medical-coolgray text-secondary hover:bg-primary hover:text-white font-bold transition-colors border border-medical-border"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Status & Reschedule Modal */}
      {modalOpen && selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase">{selectedApt.appointmentId}</span>
                <h3 className="text-lg font-bold text-secondary">Manage Appointment</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Appointment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-medical-border font-bold text-secondary focus:border-primary focus:outline-hidden"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Reschedule Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Time Slot</label>
                  <input
                    type="text"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    placeholder="10:00 AM - 10:30 AM"
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Consultation / Clinical Notes</label>
                <textarea
                  rows={3}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Record symptoms observed, recommendations, clinical instructions..."
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagementPage;
