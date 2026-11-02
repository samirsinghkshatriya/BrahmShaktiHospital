import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  IndianRupee,
  AlertTriangle,
  Droplets,
  Pill,
  TrendingUp,
  Building2,
  ArrowRight,
  Plus,
  Receipt,
  CheckCircle2,
  Activity
} from 'lucide-react';
import api from '../../services/api';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [departmentPerf, setDepartmentPerf] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [repRes, aptRes] = await Promise.all([
          api.get('/reports/dashboard-stats'),
          api.get('/appointments')
        ]);

        if (repRes.data.success) {
          setStats(repRes.data.stats);
          setMonthlyTrends(repRes.data.monthlyTrends || []);
          setDepartmentPerf(repRes.data.departmentPerformance || []);
        }
        if (aptRes.data.success) {
          setRecentAppointments(aptRes.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || '45,200',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary-50',
      change: '+14% this month'
    },
    {
      title: 'Active Doctors',
      value: stats?.totalDoctors || '32',
      icon: UserCheck,
      color: 'text-secondary',
      bg: 'bg-secondary-50',
      change: '25+ Specialties'
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || '24',
      icon: Calendar,
      color: 'text-teal-700',
      bg: 'bg-teal-50',
      change: `${stats?.pendingAppointments || 3} Pending Confirmation`
    },
    {
      title: 'Total Revenue (Est.)',
      value: `₹${(stats?.totalRevenue || 1245000).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      change: 'Subsidized Trust Tariff'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-medical-border shadow-soft flex items-start justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-medical-muted uppercase tracking-wider block">
                  {card.title}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                  {card.value}
                </div>
                <div className="text-[11px] font-semibold text-primary">
                  {card.change}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Stock Alert Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pharmacy Alert */}
        <div className="p-5 rounded-2xl bg-white border border-medical-border shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-medical-muted">Pharmacy Stock Alerts</div>
              <div className="text-base font-bold text-secondary">
                {stats?.pharmacyAlerts || 2} Formularies Below Safety Threshold
              </div>
            </div>
          </div>
          <Link
            to="/admin/pharmacy"
            className="px-3.5 py-1.5 rounded-lg bg-primary-50 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors"
          >
            Review Stock
          </Link>
        </div>

        {/* Blood Bank Alert */}
        <div className="p-5 rounded-2xl bg-white border border-medical-border shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-status-error flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-medical-muted">Blood Bank Alerts</div>
              <div className="text-base font-bold text-secondary">
                {stats?.bloodAlerts || 3} Groups at Critical/Low Units (A-, AB-)
              </div>
            </div>
          </div>
          <Link
            to="/admin/blood-bank"
            className="px-3.5 py-1.5 rounded-lg bg-red-50 text-status-error text-xs font-bold hover:bg-status-error hover:text-white transition-colors"
          >
            Manage Blood
          </Link>
        </div>
      </div>

      {/* Charts & Department Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Inpatient & Revenue Trends */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-medical-border">
            <div>
              <h3 className="font-bold text-secondary text-base">Patient Registrations & Revenue Trend</h3>
              <p className="text-xs text-medical-muted">Last 6 Months Clinical Influx</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-accent text-accent-dark text-[11px] font-bold">
              Subsidized Model
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {monthlyTrends.map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-secondary">{m.month} 2026</span>
                  <span className="text-primary">{m.patients} Patients (₹{(m.revenue / 100000).toFixed(1)}L)</span>
                </div>
                <div className="w-full bg-medical-coolgray h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (m.patients / 2500) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Volume Share */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-4">
          <div className="pb-3 border-b border-medical-border">
            <h3 className="font-bold text-secondary text-base">Department Performance</h3>
            <p className="text-xs text-medical-muted">Volume & Patient Satisfaction Ratings</p>
          </div>

          <div className="space-y-3 pt-2">
            {departmentPerf.map((dp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-medical-coolgray border border-medical-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-secondary text-xs">{dp.department}</div>
                  <div className="text-[10px] text-medical-muted">{dp.appointments} Consultations · ₹{(dp.revenue / 100000).toFixed(1)}L</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-green-100 text-status-success text-xs font-bold">
                  ★ {dp.satisfaction}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Appointments & Operational Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Appointments Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-medical-border">
            <div>
              <h3 className="font-bold text-secondary text-base">Recent Appointment Bookings</h3>
              <p className="text-xs text-medical-muted">Live Outpatient Queue</p>
            </div>
            <Link to="/admin/appointments" className="text-xs font-bold text-primary hover:underline">
              View All ↗
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-medical-coolgray text-secondary uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 font-bold">ID / Patient</th>
                  <th className="p-3 font-bold">Doctor</th>
                  <th className="p-3 font-bold">Slot</th>
                  <th className="p-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {recentAppointments.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-medical-coolgray/50">
                    <td className="p-3 font-medium">
                      <div className="font-bold text-secondary">{apt.patientName}</div>
                      <div className="text-[10px] text-medical-muted">{apt.appointmentId}</div>
                    </td>
                    <td className="p-3 text-medical-slate">
                      <div>{apt.doctorName}</div>
                      <div className="text-[10px] text-primary">{apt.departmentName}</div>
                    </td>
                    <td className="p-3 text-medical-muted">
                      <div>{apt.date}</div>
                      <div className="text-[10px]">{apt.timeSlot}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'Confirmed'
                            ? 'bg-green-100 text-status-success'
                            : apt.status === 'Completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Quick Actions Panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-4">
          <div className="pb-3 border-b border-medical-border">
            <h3 className="font-bold text-secondary text-base">Administrative Actions</h3>
            <p className="text-xs text-medical-muted">One-Click Operational Routines</p>
          </div>

          <div className="space-y-2.5">
            <Link
              to="/admin/patients"
              className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 hover:bg-primary hover:text-white text-primary text-xs font-bold transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Register New Patient</span>
            </Link>

            <Link
              to="/admin/appointments"
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary-50 hover:bg-secondary hover:text-white text-secondary text-xs font-bold transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Walk-In Appointment</span>
            </Link>

            <Link
              to="/admin/billing"
              className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-bold transition-all"
            >
              <Receipt className="w-4 h-4" />
              <span>Generate Patient Invoice</span>
            </Link>

            <Link
              to="/admin/blood-bank"
              className="flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-status-error hover:text-white text-status-error text-xs font-bold transition-all"
            >
              <Droplets className="w-4 h-4" />
              <span>Update Blood Bank Stock</span>
            </Link>

            <Link
              to="/admin/reports"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 hover:bg-slate-700 hover:text-white text-secondary text-xs font-bold transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Executive Hospital Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
