import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Heart,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  PlusCircle,
  FileText,
  User,
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const BloodBankPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');

  // Request Blood Form
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [bloodGroupReq, setBloodGroupReq] = useState('B+');
  const [componentReq, setComponentReq] = useState('Packed Red Blood Cells');
  const [unitsNeeded, setUnitsNeeded] = useState(1);
  const [urgency, setUrgency] = useState('Urgent');
  const [contactPhone, setContactPhone] = useState('');
  const [requestHospital, setRequestHospital] = useState('Brahm Shakti Hospital');
  const [reqLoading, setReqLoading] = useState(false);

  // Voluntary Donation Form
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorAge, setDonorAge] = useState(26);
  const [donorGroup, setDonorGroup] = useState('O+');
  const [donationSuccess, setDonationSuccess] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/blood-bank/inventory');
      if (res.data.success) {
        setInventory(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching blood inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredInventory = selectedGroupFilter === 'all'
    ? inventory
    : inventory.filter(i => i.bloodGroup === selectedGroupFilter);

  const handleBloodRequestSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !contactPhone) {
      toast.error('Please enter patient name and contact telephone');
      return;
    }

    setReqLoading(true);
    try {
      const res = await api.post('/blood-bank/requests', {
        patientName,
        hospitalName: requestHospital,
        bloodGroup: bloodGroupReq,
        component: componentReq,
        unitsNeeded: Number(unitsNeeded),
        urgency,
        contactPhone
      });

      if (res.data.success) {
        toast.success(`Blood Request Registered! ID: ${res.data.data.requestId}`);
        setRequestModalOpen(false);
        // Clear
        setPatientName('');
        setContactPhone('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit blood request');
    } finally {
      setReqLoading(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !donorPhone) {
      toast.error('Please provide your name and phone number');
      return;
    }

    try {
      const res = await api.post('/blood-bank/donations', {
        donorName,
        donorPhone,
        donorAge: Number(donorAge),
        bloodGroup: donorGroup,
        unitsDonated: 1
      });

      if (res.data.success) {
        setDonationSuccess(true);
        toast.success('Thank you for pledging life-saving blood donation!');
        fetchInventory();
      }
    } catch (err) {
      toast.error('Failed to register donation');
    }
  };

  return (
    <div className="space-y-14 pb-20">
      {/* Top Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-bold uppercase tracking-wider">
              <Droplets className="w-3.5 h-3.5" />
              <span>24x7 Licensed Blood Bank</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Blood Bank & Component Separation
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Serving emergency trauma, surgical suites, and patients across North-West Delhi with verified, infection-screened blood products.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setRequestModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-status-error hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Request Blood Urgently</span>
            </button>
            <a
              href="tel:7840089703"
              className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-accent" />
              <span>24x7 Desk: 7840089703</span>
            </a>
          </div>
        </div>
      </section>

      {/* Live Inventory Status Table */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight">
              Current Blood Component Inventory
            </h2>
            <p className="text-xs text-medical-muted mt-1">
              Live stock levels of Whole Blood, Packed RBCs, Platelets, FFP, and Cryoprecipitate.
            </p>
          </div>

          {/* Group Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroupFilter(bg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedGroupFilter === bg
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white text-secondary border border-medical-border hover:border-primary'
                }`}
              >
                {bg === 'all' ? 'All Groups' : bg}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
        ) : (
          <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary text-white uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6 font-bold">Blood Group</th>
                    <th className="py-4 px-6 font-bold">Component</th>
                    <th className="py-4 px-6 font-bold">Units Available</th>
                    <th className="py-4 px-6 font-bold">Price / Unit</th>
                    <th className="py-4 px-6 font-bold">Status</th>
                    <th className="py-4 px-6 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-medical-border text-secondary">
                  {filteredInventory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-medical-coolgray transition-colors">
                      <td className="py-4 px-6 font-black text-sm text-secondary">
                        <span className="w-8 h-8 rounded-full bg-red-100 text-status-error flex items-center justify-center font-black">
                          {item.bloodGroup}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-secondary">
                        {item.component}
                      </td>
                      <td className="py-4 px-6 font-black text-base text-primary">
                        {item.unitsAvailable} <span className="text-xs font-normal text-medical-muted">Units</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-secondary">
                        ₹{item.pricePerUnit || 1200}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'Critical'
                              ? 'bg-red-100 text-status-error'
                              : item.status === 'Low Stock'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-status-success'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setBloodGroupReq(item.bloodGroup);
                            setComponentReq(item.component);
                            setRequestModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover font-bold text-[11px] transition-all"
                        >
                          Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Donor Eligibility & Voluntary Donation */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Eligibility Criteria */}
          <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-medical-border shadow-soft space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety & Health Protocol</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary">Who Can Donate Blood?</h3>
            <p className="text-xs text-medical-muted leading-relaxed">
              Every unit of voluntary blood donated can save up to 3 lives. Donors undergo free vital screening, hemoglobin checks, and receive a Brahm Shakti donor certificate.
            </p>

            <div className="space-y-3">
              {[
                'Age between 18 to 65 years with good general health',
                'Body weight minimum 45 kg or above',
                'Hemoglobin minimum 12.5 g/dL (tested on site)',
                'No major surgery or blood transfusion in previous 6 months',
                'Free from active viral infections (HIV, HBV, HCV, Syphilis, Malaria)',
                'At least 3 months gap since last whole blood donation'
              ].map((crit, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Voluntary Donor Registration Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-secondary to-secondary-dark text-white p-8 rounded-2xl shadow-xl space-y-6">
            <div>
              <span className="px-2.5 py-1 rounded bg-accent text-accent-dark text-[10px] font-bold uppercase tracking-wider">
                Be a Life Saver
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                Register as a Voluntary Donor
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Pledge your donation at Brahm Shakti Hospital Blood Bank. Our team will contact you for a convenient scheduled slot.
              </p>
            </div>

            {donationSuccess ? (
              <div className="p-6 rounded-xl bg-white/10 border border-white/20 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-accent mx-auto" />
                <h4 className="font-bold text-white text-base">Pledge Registered Successfully</h4>
                <p className="text-xs text-slate-300">
                  Thank you, <strong>{donorName}</strong>. Our blood bank counselor will connect with you shortly.
                </p>
                <button
                  onClick={() => setDonationSuccess(false)}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-accent text-secondary text-xs font-bold"
                >
                  Register Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Enter donor name"
                    required
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-300">Phone</label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="+91-98XXXXXXXX"
                      required
                      className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-300">Blood Group</label>
                    <select
                      value={donorGroup}
                      onChange={(e) => setDonorGroup(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-secondary-light border border-white/20 text-xs text-white focus:outline-hidden"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md"
                >
                  Pledge Blood Donation
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Blood Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-status-error flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-secondary">Submit Blood Request</h3>
              </div>
              <button
                onClick={() => setRequestModalOpen(false)}
                className="text-medical-muted hover:text-secondary font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBloodRequestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-medical-muted">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient name"
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Blood Group</label>
                  <select
                    value={bloodGroupReq}
                    onChange={(e) => setBloodGroupReq(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-bold focus:border-primary focus:outline-hidden"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Component</label>
                  <select
                    value={componentReq}
                    onChange={(e) => setComponentReq(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                  >
                    {[
                      'Packed Red Blood Cells',
                      'Whole Blood',
                      'Platelets',
                      'Fresh Frozen Plasma',
                      'Cryoprecipitate'
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Units Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-bold focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-medical-muted">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-bold focus:border-primary focus:outline-hidden"
                  >
                    <option value="Normal">Normal (Elective)</option>
                    <option value="Urgent">Urgent (Within 4 Hours)</option>
                    <option value="Emergency">Emergency (Immediate Life Saving)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-medical-muted">Contact Mobile Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91-98XXXXXXXX"
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-medical-muted">Hospital / Ward</label>
                <input
                  type="text"
                  value={requestHospital}
                  onChange={(e) => setRequestHospital(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-medical-border text-xs text-secondary font-medium focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-secondary text-secondary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reqLoading}
                  className="flex-1 py-3 rounded-xl bg-status-error hover:bg-red-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {reqLoading ? 'Submitting...' : 'Submit Urgent Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankPage;
