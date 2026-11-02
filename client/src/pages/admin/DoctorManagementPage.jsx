import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Edit2,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Stethoscope
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DoctorManagementPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Add / Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [qualification, setQualification] = useState('');
  const [designation, setDesignation] = useState('');
  const [experienceYears, setExperienceYears] = useState('15');
  const [consultationFee, setConsultationFee] = useState('800');
  const [availableDays, setAvailableDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [availableTimings, setAvailableTimings] = useState('09:00 AM - 02:00 PM');
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        api.get('/doctors', { params: { search: search || undefined, department: deptFilter !== 'all' ? deptFilter : undefined } }),
        api.get('/departments')
      ]);
      if (docRes.data.success) setDoctors(docRes.data.data);
      if (deptRes.data.success) {
        setDepartments(deptRes.data.data);
        if (!departmentId && deptRes.data.data.length > 0) {
          setDepartmentId(deptRes.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [deptFilter]);

  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    setName('');
    setQualification('MBBS, MD');
    setDesignation('Senior Consultant');
    setExperienceYears('15');
    setConsultationFee('800');
    setAvailableDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setAvailableTimings('09:00 AM - 02:00 PM');
    setModalOpen(true);
  };

  const handleOpenEditModal = (doc) => {
    setEditingDoctor(doc);
    setName(doc.name);
    setDepartmentId(doc.departmentId);
    setQualification(doc.qualification);
    setDesignation(doc.designation);
    setExperienceYears(String(doc.experienceYears));
    setConsultationFee(String(doc.consultationFee));
    setAvailableDays(doc.availableDays || ['Mon', 'Wed', 'Fri']);
    setAvailableTimings(doc.availableTimings || '09:00 AM - 02:00 PM');
    setModalOpen(true);
  };

  const handleToggleStatus = async (doc) => {
    try {
      const res = await api.put(`/doctors/${doc.id}`, { isActive: !doc.isActive });
      if (res.data.success) {
        toast.success(`Doctor status updated to ${!doc.isActive ? 'Active' : 'Inactive'}`);
        fetchDoctors();
      }
    } catch (err) {
      toast.error('Failed to update doctor status');
    }
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    if (!name || !departmentId) {
      toast.error('Doctor name and department are required');
      return;
    }

    setSubmitting(true);
    try {
      const deptObj = departments.find(d => d.id === departmentId);
      const payload = {
        name,
        departmentId,
        departmentName: deptObj?.name || departmentId,
        qualification,
        designation,
        experienceYears: Number(experienceYears),
        consultationFee: Number(consultationFee),
        availableDays,
        availableTimings
      };

      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor.id}`, payload);
        toast.success('Doctor details updated successfully');
      } else {
        await api.post('/doctors', payload);
        toast.success('Doctor added to hospital faculty');
      }

      setModalOpen(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save doctor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Doctor Faculty Management</h2>
          <p className="text-xs text-medical-muted">
            Manage consultant profiles, OPD timing slots, consultation charges, and active rosters.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-medical-border shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-medical-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
            placeholder="Search by doctor name or qualification..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-medical-border focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
          <span className="text-medical-muted font-bold">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="p-2 rounded-xl border border-medical-border font-medium text-secondary focus:border-primary focus:outline-hidden text-xs"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
      ) : (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Doctor Profile</th>
                  <th className="py-3.5 px-5 font-bold">Department</th>
                  <th className="py-3.5 px-5 font-bold">Experience</th>
                  <th className="py-3.5 px-5 font-bold">Fee (Subsidized)</th>
                  <th className="py-3.5 px-5 font-bold">OPD Schedule</th>
                  <th className="py-3.5 px-5 font-bold">Account Status</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-secondary">{doc.name}</div>
                          <div className="text-[10px] text-medical-muted">{doc.qualification}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-primary">
                      {doc.departmentName}
                    </td>
                    <td className="py-3.5 px-5 text-secondary">
                      {doc.experienceYears}+ Years
                    </td>
                    <td className="py-3.5 px-5 font-black text-secondary">
                      ₹{doc.consultationFee}
                    </td>
                    <td className="py-3.5 px-5 text-medical-muted">
                      {doc.opdSchedule}
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => handleToggleStatus(doc)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          doc.isActive !== false
                            ? 'bg-green-100 text-status-success hover:bg-green-200'
                            : 'bg-red-100 text-status-error hover:bg-red-200'
                        }`}
                      >
                        {doc.isActive !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenEditModal(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-medical-coolgray hover:bg-primary hover:text-white text-secondary font-bold transition-all text-[11px] border border-medical-border"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <h3 className="text-lg font-bold text-secondary">
                {editingDoctor ? 'Edit Doctor Profile' : 'Add New Consultant Doctor'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-medical-muted">Doctor Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Full Name"
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Senior Consultant"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Qualifications</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="MBBS, MD, DM"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Experience (Years)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-bold focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">OPD Timings</label>
                  <input
                    type="text"
                    value={availableTimings}
                    onChange={(e) => setAvailableTimings(e.target.value)}
                    placeholder="09:00 AM - 02:00 PM"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Doctor Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagementPage;
