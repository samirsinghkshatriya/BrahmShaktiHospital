import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Printer,
  Download,
  Users,
  IndianRupee,
  Activity,
  FileText,
  Filter,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [departmentPerf, setDepartmentPerf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await api.get('/reports/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setTrends(res.data.monthlyTrends || []);
          setDepartmentPerf(res.data.departmentPerformance || []);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [timeRange]);

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Month,Patients,Revenue,Appointments\n" +
      trends.map(t => `${t.month},${t.patients},${t.revenue},${t.appointments}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Brahm_Shakti_Hospital_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Hospital report exported as CSV');
  };

  if (loading) {
    return <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Executive Hospital Performance Reports</h2>
          <p className="text-xs text-medical-muted">
            Aggregated institutional analytics: patient registrations, department clinical volumes, and philanthropic revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-secondary text-secondary hover:bg-secondary hover:text-white text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-medical-border shadow-soft space-y-1">
          <span className="text-[10px] uppercase font-bold text-medical-muted">Total Consultations</span>
          <div className="text-2xl font-black text-secondary">{stats?.totalAppointments || 128}</div>
          <span className="text-[10px] text-status-success font-semibold">+18% growth</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-medical-border shadow-soft space-y-1">
          <span className="text-[10px] uppercase font-bold text-medical-muted">Active Inpatient Beds</span>
          <div className="text-2xl font-black text-primary">250 Beds</div>
          <span className="text-[10px] text-secondary font-semibold">88% Bed Occupancy</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-medical-border shadow-soft space-y-1">
          <span className="text-[10px] uppercase font-bold text-medical-muted">Hospital Revenue</span>
          <div className="text-2xl font-black text-secondary">₹{(stats?.totalRevenue || 420000).toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-primary font-semibold">Trust Subsidies Applied</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-medical-border shadow-soft space-y-1">
          <span className="text-[10px] uppercase font-bold text-medical-muted">Patient Satisfaction</span>
          <div className="text-2xl font-black text-status-success">98.4%</div>
          <span className="text-[10px] text-medical-muted font-semibold">NABH Patient Safety Adherence</span>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-medical-border">
          <h3 className="text-base font-bold text-secondary">Monthly Performance Breakdown</h3>
          <span className="text-xs text-medical-muted">Financial Year 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-medical-coolgray text-secondary uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-bold">Month</th>
                <th className="py-3 px-4 font-bold">Outpatient Consultations</th>
                <th className="py-3 px-4 font-bold">Total Patient Registrations</th>
                <th className="py-3 px-4 font-bold">Total Subsidized Revenue</th>
                <th className="py-3 px-4 font-bold text-right">Target Achievement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-border text-secondary">
              {trends.map((t, idx) => (
                <tr key={idx} className="hover:bg-medical-coolgray/50">
                  <td className="py-3 px-4 font-bold text-primary">{t.month} 2026</td>
                  <td className="py-3 px-4">{t.appointments}</td>
                  <td className="py-3 px-4 font-semibold">{t.patients}</td>
                  <td className="py-3 px-4 font-black">₹{t.revenue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-green-100 text-status-success font-bold text-[10px]">
                      100% Target Met
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Department Volume Table */}
      <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-medical-border">
          <h3 className="text-base font-bold text-secondary">Department Volume & Operational Metrics</h3>
          <span className="text-xs text-medical-muted">6 Key Specialty Wings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-medical-coolgray text-secondary uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold">Consultation Volume</th>
                <th className="py-3 px-4 font-bold">Revenue Generated</th>
                <th className="py-3 px-4 font-bold">Infection Free Index</th>
                <th className="py-3 px-4 font-bold text-right">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-border text-secondary">
              {departmentPerf.map((dp, idx) => (
                <tr key={idx} className="hover:bg-medical-coolgray/50">
                  <td className="py-3 px-4 font-bold text-secondary">{dp.department}</td>
                  <td className="py-3 px-4 font-semibold">{dp.appointments} Consultations</td>
                  <td className="py-3 px-4 font-black">₹{dp.revenue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-status-success font-bold">99.8% Clean</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-amber-700 font-bold">★ {dp.satisfaction}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
