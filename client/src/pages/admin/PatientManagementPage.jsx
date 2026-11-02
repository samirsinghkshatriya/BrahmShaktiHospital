import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  FileText,
  User,
  ShieldCheck,
  Edit2,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PatientManagementPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');

  // Register modal
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('42');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // View modal
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients', {
        params: { search: search || undefined, bloodGroup: bloodFilter || undefined }
      });
      if (res.data.success) {
        setPatients(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [bloodFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatients();
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Patient name and contact phone are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/patients', {
        name,
        age: Number(age),
        gender,
        phone,
        email,
        bloodGroup,
        address,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone
        }
      });

      if (res.data.success) {
        toast.success(`Patient Registered! ID: ${res.data.data.patientId}`);
        setRegisterModalOpen(false);
        fetchPatients();
        // Reset
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register patient');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Patient Management</h2>
          <p className="text-xs text-medical-muted">
            Search, register, and review clinical histories for all hospital outpatients and inpatients.
          </p>
        </div>
        <button
          onClick={() => setRegisterModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-medical-border shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-medical-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Patient Name, ID, or Phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-medical-border focus:border-primary focus:outline-hidden"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
          <span className="text-medical-muted font-bold">Blood Group:</span>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="p-2 rounded-xl border border-medical-border font-medium text-secondary focus:border-primary focus:outline-hidden text-xs"
          >
            <option value="">All Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Patients Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
      ) : patients.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-medical-border space-y-2">
          <Users className="w-8 h-8 text-medical-muted mx-auto" />
          <h4 className="font-bold text-secondary text-sm">No Patients Found</h4>
          <p className="text-xs text-medical-muted">No records matched your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Patient ID</th>
                  <th className="py-3.5 px-5 font-bold">Name & Demographics</th>
                  <th className="py-3.5 px-5 font-bold">Contact Phone</th>
                  <th className="py-3.5 px-5 font-bold">Blood Group</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {patients.map((p) => (
                  <tr key={p.patientId} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary text-xs">
                      {p.patientId}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-secondary">{p.name}</div>
                      <div className="text-[10px] text-medical-muted">
                        {p.age} Yrs · {p.gender}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-medical-slate font-medium">
                      {p.phone}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-status-error font-bold text-[10px]">
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-status-success font-bold text-[10px]">
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary hover:bg-primary hover:text-white font-bold transition-all text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient Profile View Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-primary-50 text-primary text-[10px] font-bold uppercase">
                  {selectedPatient.patientId}
                </span>
                <h3 className="text-xl font-bold text-secondary mt-1">{selectedPatient.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-medical-muted hover:text-secondary font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-medical-coolgray text-xs">
              <div>
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Age / Gender</span>
                <strong>{selectedPatient.age} Yrs · {selectedPatient.gender}</strong>
              </div>
              <div>
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Blood Group</span>
                <strong className="text-status-error font-bold">{selectedPatient.bloodGroup}</strong>
              </div>
              <div>
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Phone</span>
                <strong>{selectedPatient.phone}</strong>
              </div>
              <div>
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Status</span>
                <strong className="text-status-success">{selectedPatient.status || 'Active'}</strong>
              </div>
            </div>

            {selectedPatient.address && (
              <div className="text-xs">
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Residential Address</span>
                <p className="text-secondary mt-0.5">{selectedPatient.address}</p>
              </div>
            )}

            {/* Medical History */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-secondary text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                <span>Recorded Clinical Diagnoses & Consultations</span>
              </h4>

              {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                <div className="space-y-2">
                  {selectedPatient.medicalHistory.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-medical-border text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-secondary">
                        <span>{m.diagnosis}</span>
                        <span className="text-medical-muted text-[10px]">{m.date}</span>
                      </div>
                      <div className="text-[11px] text-primary font-medium">Attending: {m.doctor}</div>
                      {m.notes && <p className="text-medical-muted text-[11px] italic">{m.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-medical-muted italic">No past chronic diagnoses recorded.</p>
              )}
            </div>

            <div className="pt-4 border-t border-medical-border flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 rounded-xl bg-secondary text-white text-xs font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Patient Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <h3 className="text-lg font-bold text-secondary">Register New Patient</h3>
              <button
                onClick={() => setRegisterModalOpen(false)}
                className="text-medical-muted hover:text-secondary font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-medical-muted">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Patient name"
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91-98XXXXXXXX"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-medical-muted">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Budh Vihar / Delhi address"
                  className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-medical-border">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Spouse / Parent / Next of Kin"
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Emergency Phone</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagementPage;
