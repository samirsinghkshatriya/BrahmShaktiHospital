import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  User,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const BloodBankManagementPage = () => {
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'requests', 'donations'

  // Update Stock Modal
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newUnits, setNewUnits] = useState(10);
  const [pricePerUnit, setPricePerUnit] = useState(1200);

  const fetchBloodData = async () => {
    try {
      const [invRes, reqRes, donRes] = await Promise.all([
        api.get('/blood-bank/inventory'),
        api.get('/blood-bank/requests'),
        api.get('/blood-bank/donations')
      ]);

      if (invRes.data.success) setInventory(invRes.data.data);
      if (reqRes.data.success) setRequests(reqRes.data.data);
      if (donRes.data.success) setDonations(donRes.data.data);
    } catch (err) {
      console.error('Error fetching blood bank data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodData();
  }, []);

  const handleOpenStockModal = (item) => {
    setSelectedItem(item);
    setNewUnits(item.unitsAvailable);
    setPricePerUnit(item.pricePerUnit || 1200);
    setStockModalOpen(true);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/blood-bank/inventory', {
        bloodGroup: selectedItem.bloodGroup,
        component: selectedItem.component,
        unitsAvailable: Number(newUnits),
        pricePerUnit: Number(pricePerUnit)
      });

      if (res.data.success) {
        toast.success(`Inventory updated for ${selectedItem.bloodGroup} ${selectedItem.component}`);
        setStockModalOpen(false);
        fetchBloodData();
      }
    } catch (err) {
      toast.error('Failed to update blood inventory');
    }
  };

  const handleRequestStatusChange = async (requestId, status) => {
    try {
      const res = await api.put(`/blood-bank/requests/${requestId}/status`, { status });
      if (res.data.success) {
        toast.success(`Request ${requestId} status updated to ${status}`);
        fetchBloodData();
      }
    } catch (err) {
      toast.error('Failed to update request');
    }
  };

  const criticalItems = inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Blood Bank & Component Inventory</h2>
          <p className="text-xs text-medical-muted">
            Track real-time blood components, approve urgent issue requests, and monitor voluntary donations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-xl border border-medical-border text-xs font-bold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'inventory' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-primary'
            }`}
          >
            Inventory ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'requests' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-primary'
            }`}
          >
            Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'donations' ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-primary'
            }`}
          >
            Donations ({donations.length})
          </button>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {criticalItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-status-error font-bold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              {criticalItems.length} Blood Components Below Safe Reserves ({criticalItems.map(c => `${c.bloodGroup} ${c.component}`).slice(0, 3).join(', ')}...)
            </span>
          </div>
          <span className="text-red-700 font-semibold uppercase text-[10px] hidden sm:block">
            Immediate Donor Call Recommended
          </span>
        </div>
      )}

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Group</th>
                  <th className="py-3.5 px-5 font-bold">Blood Component</th>
                  <th className="py-3.5 px-5 font-bold">Units In Reserve</th>
                  <th className="py-3.5 px-5 font-bold">Trust Price / Unit</th>
                  <th className="py-3.5 px-5 font-bold">Threshold Alert</th>
                  <th className="py-3.5 px-5 font-bold text-right">Update Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {inventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-black text-sm">
                      <span className="w-8 h-8 rounded-full bg-red-100 text-status-error flex items-center justify-center">
                        {item.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-secondary">
                      {item.component}
                    </td>
                    <td className="py-3.5 px-5 font-black text-sm text-primary">
                      {item.unitsAvailable} Units
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-secondary">
                      ₹{item.pricePerUnit || 1200}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenStockModal(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-medical-coolgray hover:bg-primary hover:text-white text-secondary font-bold transition-all text-[11px] border border-medical-border"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Units</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Blood Requests Queue */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Request ID</th>
                  <th className="py-3.5 px-5 font-bold">Patient / Ward</th>
                  <th className="py-3.5 px-5 font-bold">Group & Component</th>
                  <th className="py-3.5 px-5 font-bold">Units Needed</th>
                  <th className="py-3.5 px-5 font-bold">Urgency</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {requests.map((r) => (
                  <tr key={r.requestId} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary">
                      {r.requestId}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-secondary">{r.patientName}</div>
                      <div className="text-[10px] text-medical-muted">{r.hospitalName} · {r.contactPhone}</div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-secondary">
                      <span className="text-status-error font-black">{r.bloodGroup}</span> · {r.component}
                    </td>
                    <td className="py-3.5 px-5 font-black text-secondary">
                      {r.unitsNeeded} Unit(s)
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.urgency === 'Emergency'
                            ? 'bg-red-600 text-white animate-pulse'
                            : r.urgency === 'Urgent'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-secondary'
                        }`}
                      >
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-secondary font-bold text-[10px]">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                      {r.status === 'Pending' && (
                        <button
                          onClick={() => handleRequestStatusChange(r.requestId, 'Approved')}
                          className="px-2.5 py-1 rounded bg-green-50 text-status-success font-bold hover:bg-status-success hover:text-white"
                        >
                          Approve
                        </button>
                      )}
                      {r.status === 'Approved' && (
                        <button
                          onClick={() => handleRequestStatusChange(r.requestId, 'Fulfilled')}
                          className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold hover:bg-blue-700 hover:text-white"
                        >
                          Fulfill Issue
                        </button>
                      )}
                      {r.status !== 'Rejected' && r.status !== 'Fulfilled' && (
                        <button
                          onClick={() => handleRequestStatusChange(r.requestId, 'Rejected')}
                          className="px-2.5 py-1 rounded bg-red-50 text-status-error font-bold hover:bg-status-error hover:text-white"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Donations Log */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Donation ID</th>
                  <th className="py-3.5 px-5 font-bold">Donor Name</th>
                  <th className="py-3.5 px-5 font-bold">Blood Group</th>
                  <th className="py-3.5 px-5 font-bold">Age & Gender</th>
                  <th className="py-3.5 px-5 font-bold">Contact Phone</th>
                  <th className="py-3.5 px-5 font-bold">Date</th>
                  <th className="py-3.5 px-5 font-bold">Screening</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {donations.map((d) => (
                  <tr key={d.donationId} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary">{d.donationId}</td>
                    <td className="py-3.5 px-5 font-bold text-secondary">{d.donorName}</td>
                    <td className="py-3.5 px-5">
                      <span className="w-7 h-7 rounded-full bg-red-100 text-status-error font-bold flex items-center justify-center">
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-medical-muted">{d.donorAge} Yrs · {d.gender}</td>
                    <td className="py-3.5 px-5">{d.donorPhone}</td>
                    <td className="py-3.5 px-5">{d.donationDate}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-status-success font-bold text-[10px]">
                        {d.screeningStatus || 'Passed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {stockModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <h3 className="text-base font-bold text-secondary">
                Update Blood Stock Units
              </h3>
              <button onClick={() => setStockModalOpen(false)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-medical-coolgray space-y-1">
                <div className="font-bold text-secondary text-sm">
                  {selectedItem.bloodGroup} — {selectedItem.component}
                </div>
                <div className="text-[10px] text-medical-muted">Storage: 2°C to 6°C Monitored Refrigerator</div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Units Available</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newUnits}
                  onChange={(e) => setNewUnits(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border font-black text-secondary focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Trust Subsidized Price / Unit (₹)</label>
                <input
                  type="number"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border font-bold text-secondary focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStockModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-secondary text-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md"
                >
                  Save Units
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankManagementPage;
