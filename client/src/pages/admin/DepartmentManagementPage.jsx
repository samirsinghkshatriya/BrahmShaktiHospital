import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Clock,
  IndianRupee,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Super Specialty');
  const [shortDescription, setShortDescription] = useState('');
  const [consultationCharges, setConsultationCharges] = useState('800');
  const [opdTimings, setOpdTimings] = useState('Mon - Sat: 09:00 AM - 05:00 PM');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAddModal = () => {
    setEditingDept(null);
    setName('');
    setCode('');
    setCategory('Super Specialty');
    setShortDescription('');
    setConsultationCharges('800');
    setOpdTimings('Mon - Sat: 09:00 AM - 05:00 PM');
    setHeadOfDepartment('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (dept) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setCategory(dept.category);
    setShortDescription(dept.shortDescription);
    setConsultationCharges(String(dept.consultationCharges || 800));
    setOpdTimings(dept.opdTimings || 'Mon - Sat: 09:00 AM - 05:00 PM');
    setHeadOfDepartment(dept.headOfDepartment || '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error('Department name and code are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        code,
        category,
        shortDescription,
        consultationCharges: Number(consultationCharges),
        opdTimings,
        headOfDepartment
      };

      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, payload);
        toast.success('Department updated successfully');
      } else {
        await api.post('/departments', payload);
        toast.success('Department added successfully');
      }

      setModalOpen(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Clinical Departments & Specialties</h2>
          <p className="text-xs text-medical-muted">
            Configure hospital clinical disciplines, OPD fee structures, and department heads.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
      ) : (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Code</th>
                  <th className="py-3.5 px-5 font-bold">Department Name</th>
                  <th className="py-3.5 px-5 font-bold">Category</th>
                  <th className="py-3.5 px-5 font-bold">Department Head</th>
                  <th className="py-3.5 px-5 font-bold">Consultation Fee</th>
                  <th className="py-3.5 px-5 font-bold">OPD Schedule</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary">
                      {dept.code}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-secondary text-sm">
                      {dept.name}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded bg-primary-50 text-primary text-[10px] font-bold">
                        {dept.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-medical-muted">
                      {dept.headOfDepartment || 'Senior Clinical Director'}
                    </td>
                    <td className="py-3.5 px-5 font-black text-secondary">
                      ₹{dept.consultationCharges || 800}
                    </td>
                    <td className="py-3.5 px-5 text-medical-muted">
                      {dept.opdTimings}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenEditModal(dept)}
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <h3 className="text-lg font-bold text-secondary">
                {editingDept ? 'Edit Department' : 'Add Clinical Department'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Department Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cardiology & Vascular"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CARD"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  >
                    <option value="Super Specialty">Super Specialty</option>
                    <option value="Surgical Specialties">Surgical Specialties</option>
                    <option value="Clinical Specialties">Clinical Specialties</option>
                    <option value="Emergency & Critical Care">Emergency & Critical Care</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={consultationCharges}
                    onChange={(e) => setConsultationCharges(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary font-bold focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Head of Department</label>
                <input
                  type="text"
                  value={headOfDepartment}
                  onChange={(e) => setHeadOfDepartment(e.target.value)}
                  placeholder="Dr. Specialist Name"
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">OPD Schedule Timings</label>
                <input
                  type="text"
                  value={opdTimings}
                  onChange={(e) => setOpdTimings(e.target.value)}
                  placeholder="Mon - Sat: 09:00 AM - 05:00 PM"
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Clinical scope and facilities..."
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
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagementPage;
