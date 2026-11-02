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
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const PatientDashboardPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchPatientData();
  }, []);

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
                  <th className="py-3 px-4 font-bold">Token ID</th>
                  <th className="py-3 px-4 font-bold">Doctor & Department</th>
                  <th className="py-3 px-4 font-bold">Date & Time Slot</th>
                  <th className="py-3 px-4 font-bold">Consultation Fee</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Clinical Advice / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {appointments.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-medical-coolgray/50">
                    <td className="py-3 px-4 font-bold text-primary">
                      {apt.appointmentId}
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
                        apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-status-success'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-medical-muted italic">
                      {apt.doctorNotes || 'No notes entered yet.'}
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
    </div>
  );
};

export default PatientDashboardPage;
