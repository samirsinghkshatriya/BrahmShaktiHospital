import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, ShieldCheck, Edit2, PackagePlus,
  Send, ClipboardCheck, Loader2, Ban, CheckCircle2, Clock
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const REQUEST_FLOW = ['Submitted', 'Under Review', 'Approved', 'Available', 'Completed', 'Rejected'];
const APP_FLOW = ['Submitted', 'Under Review', 'Scheduled', 'Eligible', 'Deferred', 'Collected', 'Rejected'];

export const BloodBankManagementPage = () => {
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

  // Stock modal
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockMode, setStockMode] = useState('set'); // 'set' | 'add'
  const [stockUnits, setStockUnits] = useState(0);
  const [stockBatch, setStockBatch] = useState('');
  const [stockExpiry, setStockExpiry] = useState('');

  // Issue modal
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueTarget, setIssueTarget] = useState(null);
  const [issueUnits, setIssueUnits] = useState(1);

  // Collect modal
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [collectTarget, setCollectTarget] = useState(null);
  const [collectUnits, setCollectUnits] = useState(1);
  const [collectBatch, setCollectBatch] = useState('');

  const fetchData = async () => {
    try {
      const [invRes, reqRes, donRes, txRes] = await Promise.all([
        api.get('/blood-bank/inventory/admin'),
        api.get('/blood-bank/requests'),
        api.get('/blood-bank/donations'),
        api.get('/blood-bank/inventory/transactions')
      ]);
      if (invRes.data.success) setInventory(invRes.data.data);
      if (reqRes.data.success) setRequests(reqRes.data.data);
      if (donRes.data.success) setDonations(donRes.data.data);
      if (txRes.data.success) setTransactions(txRes.data.data);
    } catch (err) {
      toast.error('Failed to load blood bank data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openStockModal = (item, mode) => {
    setSelectedItem(item);
    setStockMode(mode);
    setStockUnits(mode === 'set' ? item.unitsAvailable : 1);
    setStockBatch(item.batchNo || '');
    setStockExpiry('');
    setStockModalOpen(true);
  };

  const handleSubmitStock = async (e) => {
    e.preventDefault();
    try {
      if (stockMode === 'add') {
        await api.post('/blood-bank/inventory/add', {
          bloodGroup: selectedItem.bloodGroup, component: selectedItem.component,
          units: Number(stockUnits), batchNo: stockBatch || undefined, expiryDate: stockExpiry || undefined
        });
        toast.success(`Added ${stockUnits} unit(s) to ${selectedItem.bloodGroup} ${selectedItem.component}`);
      } else {
        await api.put('/blood-bank/inventory', {
          bloodGroup: selectedItem.bloodGroup, component: selectedItem.component,
          unitsAvailable: Number(stockUnits), batchNo: stockBatch || undefined, expiryDate: stockExpiry || undefined
        });
        toast.success('Inventory updated');
      }
      setStockModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update inventory');
    }
  };

  const changeRequestStatus = async (r, status) => {
    try {
      await api.put(`/blood-bank/requests/${r.requestId}/status`, { status });
      toast.success(`Request ${r.requestId} → ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request');
    }
  };

  const openIssueModal = (r) => { setIssueTarget(r); setIssueUnits(r.unitsNeeded || 1); setIssueModalOpen(true); };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/blood-bank/inventory/issue', { requestId: issueTarget.requestId, units: Number(issueUnits) });
      toast.success(res.data.message || 'Units issued');
      setIssueModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue units');
    }
  };

  const changeDonationStatus = async (d, applicationStatus, screeningStatus) => {
    try {
      await api.put(`/blood-bank/donations/${d.donationId}/status`, { applicationStatus, screeningStatus });
      toast.success(`Application ${d.donationId} → ${applicationStatus}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update application');
    }
  };

  const openCollectModal = (d) => { setCollectTarget(d); setCollectUnits(1); setCollectBatch(''); setCollectModalOpen(true); };

  const handleCollect = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/blood-bank/donations/collect', { donationId: collectTarget.donationId, units: Number(collectUnits), batchNo: collectBatch || undefined });
      toast.success(res.data.message || 'Donation collected');
      setCollectModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record collection');
    }
  };

  const alerts = inventory.filter((i) => ['Critical', 'Low Stock', 'Expired'].includes(i.status) || i.isExpired);

  const statusTone = (s) =>
    s === 'Critical' || s === 'Expired' ? 'bg-red-100 text-status-error'
      : s === 'Low Stock' ? 'bg-amber-100 text-amber-800'
        : 'bg-green-100 text-status-success';

  if (loading) {
    return <div className="flex items-center justify-center gap-2 py-20 text-medical-muted"><Loader2 className="w-5 h-5 animate-spin" /> Loading blood bank…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Blood Bank Management</h2>
          <p className="text-xs text-medical-muted">Batch &amp; expiry-aware inventory, request lifecycle, and donor application screening.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-medical-border text-xs font-bold flex-wrap">
          {[['inventory', `Inventory (${inventory.length})`], ['requests', `Requests (${requests.length})`], ['donations', `Applications (${donations.length})`], ['transactions', `Ledger (${transactions.length})`]].map(([k, label]) => (
            <button key={k} onClick={() => setActiveTab(k)} className={`px-3.5 py-1.5 rounded-lg transition-all ${activeTab === k ? 'bg-primary text-white shadow-xs' : 'text-secondary hover:text-primary'}`}>{label}</button>
          ))}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-status-error font-bold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{alerts.length} component(s) need attention — low stock or expired ({alerts.map((a) => `${a.bloodGroup} ${a.component}`).slice(0, 3).join(', ')}{alerts.length > 3 ? '…' : ''})</span>
          </div>
          <span className="text-red-700 font-semibold uppercase text-[10px] hidden sm:block">Expired units cannot be issued</span>
        </div>
      )}

      {/* Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Group</th>
                  <th className="py-3.5 px-5 font-bold">Component</th>
                  <th className="py-3.5 px-5 font-bold">Units</th>
                  <th className="py-3.5 px-5 font-bold">Batch</th>
                  <th className="py-3.5 px-5 font-bold">Expiry</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {inventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5"><span className="w-8 h-8 rounded-full bg-red-100 text-status-error flex items-center justify-center font-black">{item.bloodGroup}</span></td>
                    <td className="py-3.5 px-5 font-bold">{item.component}</td>
                    <td className="py-3.5 px-5 font-black text-primary">{item.unitsAvailable}</td>
                    <td className="py-3.5 px-5 font-mono text-[10px] text-medical-muted">{item.batchNo || '—'}</td>
                    <td className="py-3.5 px-5 text-[10px]">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '—'}
                      {item.isExpired && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[9px] uppercase">Expired</span>}
                    </td>
                    <td className="py-3.5 px-5"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusTone(item.status)}`}>{item.status}</span></td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap space-x-1.5">
                      <button onClick={() => openStockModal(item, 'add')} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-status-success hover:bg-status-success hover:text-white font-bold text-[11px] border border-transparent"><PackagePlus className="w-3.5 h-3.5" /> Add</button>
                      <button onClick={() => openStockModal(item, 'set')} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-medical-coolgray text-secondary hover:bg-primary hover:text-white font-bold text-[11px] border border-medical-border"><Edit2 className="w-3.5 h-3.5" /> Set</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Request</th>
                  <th className="py-3.5 px-5 font-bold">Patient / Ward</th>
                  <th className="py-3.5 px-5 font-bold">Group · Component</th>
                  <th className="py-3.5 px-5 font-bold">Needed / Issued</th>
                  <th className="py-3.5 px-5 font-bold">Urgency</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {requests.map((r) => (
                  <tr key={r.requestId} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary">{r.requestId}</td>
                    <td className="py-3.5 px-5"><div className="font-bold text-secondary">{r.patientName}</div><div className="text-[10px] text-medical-muted">{r.wardOrDepartment || r.hospitalName} · {r.contactPhone}</div></td>
                    <td className="py-3.5 px-5 font-bold"><span className="text-status-error font-black">{r.bloodGroup}</span> · {r.component}</td>
                    <td className="py-3.5 px-5 font-black">{r.unitsNeeded} / {r.issuedUnits || 0}</td>
                    <td className="py-3.5 px-5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.urgency === 'Emergency' ? 'bg-red-600 text-white animate-pulse' : r.urgency === 'Urgent' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-secondary'}`}>{r.urgency}</span></td>
                    <td className="py-3.5 px-5"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-secondary font-bold text-[10px]">{r.status}</span></td>
                    <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                      {r.status === 'Submitted' && <button onClick={() => changeRequestStatus(r, 'Under Review')} className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold hover:bg-amber-600 hover:text-white text-[10px]">Review</button>}
                      {(r.status === 'Submitted' || r.status === 'Under Review') && <button onClick={() => changeRequestStatus(r, 'Approved')} className="px-2.5 py-1 rounded bg-green-50 text-status-success font-bold hover:bg-status-success hover:text-white text-[10px]">Approve</button>}
                      {['Approved', 'Available', 'Partially Available'].includes(r.status) && <button onClick={() => openIssueModal(r)} className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold hover:bg-blue-700 hover:text-white text-[10px] inline-flex items-center gap-1"><Send className="w-3 h-3" /> Issue</button>}
                      {!['Completed', 'Rejected'].includes(r.status) && <button onClick={() => changeRequestStatus(r, 'Rejected')} className="px-2.5 py-1 rounded bg-red-50 text-status-error font-bold hover:bg-status-error hover:text-white text-[10px]">Reject</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Donations / Applications */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Application</th>
                  <th className="py-3.5 px-5 font-bold">Donor</th>
                  <th className="py-3.5 px-5 font-bold">Group</th>
                  <th className="py-3.5 px-5 font-bold">Contact</th>
                  <th className="py-3.5 px-5 font-bold">App Status</th>
                  <th className="py-3.5 px-5 font-bold">Screening</th>
                  <th className="py-3.5 px-5 font-bold text-right">Staff Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {donations.map((d) => (
                  <tr key={d.donationId} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary">{d.donationId}</td>
                    <td className="py-3.5 px-5"><div className="font-bold text-secondary">{d.donorName}</div><div className="text-[10px] text-medical-muted">{d.donorAge || '—'} Yrs · {d.gender}</div></td>
                    <td className="py-3.5 px-5"><span className="w-7 h-7 rounded-full bg-red-100 text-status-error font-bold flex items-center justify-center">{d.bloodGroup}</span></td>
                    <td className="py-3.5 px-5">{d.donorPhone}</td>
                    <td className="py-3.5 px-5"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-secondary font-bold text-[10px]">{d.applicationStatus || 'Submitted'}</span></td>
                    <td className="py-3.5 px-5"><span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${d.screeningStatus === 'Passed' ? 'bg-green-100 text-status-success' : d.screeningStatus === 'Deferred' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-medical-muted'}`}>{d.screeningStatus || 'Pending'}</span></td>
                    <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                      {d.applicationStatus === 'Submitted' && <button onClick={() => changeDonationStatus(d, 'Under Review')} className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold hover:bg-amber-600 hover:text-white text-[10px]">Review</button>}
                      {!['Eligible', 'Collected', 'Rejected', 'Deferred'].includes(d.applicationStatus) && <button onClick={() => changeDonationStatus(d, 'Eligible', 'Passed')} className="px-2.5 py-1 rounded bg-green-50 text-status-success font-bold hover:bg-status-success hover:text-white text-[10px] inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Mark Eligible</button>}
                      {['Eligible', 'Scheduled'].includes(d.applicationStatus) && d.screeningStatus === 'Passed' && <button onClick={() => openCollectModal(d)} className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold hover:bg-blue-700 hover:text-white text-[10px] inline-flex items-center gap-1"><ClipboardCheck className="w-3 h-3" /> Collect</button>}
                      {!['Rejected', 'Collected'].includes(d.applicationStatus) && <button onClick={() => changeDonationStatus(d, 'Deferred', 'Deferred')} className="px-2.5 py-1 rounded bg-slate-100 text-secondary font-bold hover:bg-slate-300 text-[10px]">Defer</button>}
                      {!['Rejected', 'Collected'].includes(d.applicationStatus) && <button onClick={() => changeDonationStatus(d, 'Rejected')} className="px-2.5 py-1 rounded bg-red-50 text-status-error font-bold hover:bg-status-error hover:text-white text-[10px] inline-flex items-center gap-1"><Ban className="w-3 h-3" /> Reject</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-[10px] text-medical-muted border-t border-medical-border flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> Eligibility and screening are staff decisions. Inventory is credited only when a donation is marked Eligible/Passed and collected.</div>
        </div>
      )}

      {/* Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Time</th>
                  <th className="py-3.5 px-5 font-bold">Type</th>
                  <th className="py-3.5 px-5 font-bold">Group · Component</th>
                  <th className="py-3.5 px-5 font-bold">Units</th>
                  <th className="py-3.5 px-5 font-bold">Balance</th>
                  <th className="py-3.5 px-5 font-bold">By</th>
                  <th className="py-3.5 px-5 font-bold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {transactions.map((t, i) => (
                  <tr key={i} className="hover:bg-medical-coolgray">
                    <td className="py-3 px-5 text-[10px] text-medical-muted whitespace-nowrap">{t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}</td>
                    <td className="py-3 px-5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.units >= 0 ? 'bg-green-100 text-status-success' : 'bg-red-100 text-status-error'}`}>{t.type}</span></td>
                    <td className="py-3 px-5 font-bold">{t.bloodGroup} · {t.component}</td>
                    <td className="py-3 px-5 font-black">{t.units > 0 ? `+${t.units}` : t.units}</td>
                    <td className="py-3 px-5 font-bold">{t.balanceAfter}</td>
                    <td className="py-3 px-5 text-[10px]">{t.performedBy || 'system'}</td>
                    <td className="py-3 px-5 text-[10px] text-medical-muted">{t.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {stockModalOpen && selectedItem && (
        <Modal title={stockMode === 'add' ? 'Add Received Units' : 'Set Stock Level'} onClose={() => setStockModalOpen(false)}>
          <form onSubmit={handleSubmitStock} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-medical-coolgray"><div className="font-bold text-secondary text-sm">{selectedItem.bloodGroup} — {selectedItem.component}</div><div className="text-[10px] text-medical-muted">Current: {selectedItem.unitsAvailable} unit(s) · Batch {selectedItem.batchNo || '—'}</div></div>
            <Field label={stockMode === 'add' ? 'Units to Add' : 'Total Units Available'}><input type="number" min="0" value={stockUnits} onChange={(e) => setStockUnits(e.target.value)} required className={inp} /></Field>
            <Field label="Batch No (optional)"><input value={stockBatch} onChange={(e) => setStockBatch(e.target.value)} className={inp} placeholder="e.g. B-2026-001" /></Field>
            <Field label="Expiry Date (optional)"><input type="date" value={stockExpiry} onChange={(e) => setStockExpiry(e.target.value)} className={inp} /></Field>
            <ModalActions onClose={() => setStockModalOpen(false)} label={stockMode === 'add' ? 'Add Units' : 'Save'} />
          </form>
        </Modal>
      )}

      {/* Issue Modal */}
      {issueModalOpen && issueTarget && (
        <Modal title="Issue Blood Units" onClose={() => setIssueModalOpen(false)}>
          <form onSubmit={handleIssue} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-medical-coolgray"><div className="font-bold text-secondary">{issueTarget.patientName} — {issueTarget.bloodGroup} {issueTarget.component}</div><div className="text-[10px] text-medical-muted">Needed {issueTarget.unitsNeeded} · Already issued {issueTarget.issuedUnits || 0}</div></div>
            <Field label="Units to Issue"><input type="number" min="1" value={issueUnits} onChange={(e) => setIssueUnits(e.target.value)} required className={inp} /></Field>
            <p className="text-[10px] text-medical-muted flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Expired or insufficient stock is rejected automatically by the server.</p>
            <ModalActions onClose={() => setIssueModalOpen(false)} label="Confirm Issue" tone="error" />
          </form>
        </Modal>
      )}

      {/* Collect Modal */}
      {collectModalOpen && collectTarget && (
        <Modal title="Record Donation Collection" onClose={() => setCollectModalOpen(false)}>
          <form onSubmit={handleCollect} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-medical-coolgray"><div className="font-bold text-secondary">{collectTarget.donorName} — {collectTarget.bloodGroup}</div><div className="text-[10px] text-medical-muted">Screening: {collectTarget.screeningStatus}. Crediting stock requires Eligible + Passed.</div></div>
            <Field label="Units Collected"><input type="number" min="1" value={collectUnits} onChange={(e) => setCollectUnits(e.target.value)} required className={inp} /></Field>
            <Field label="Batch No (optional)"><input value={collectBatch} onChange={(e) => setCollectBatch(e.target.value)} className={inp} /></Field>
            <ModalActions onClose={() => setCollectModalOpen(false)} label="Collect & Credit" />
          </form>
        </Modal>
      )}
    </div>
  );
};

const inp = 'w-full p-2.5 rounded-xl border border-medical-border font-bold text-secondary focus:border-primary focus:outline-hidden';
const Field = ({ label, children }) => <div className="space-y-1"><label className="font-bold uppercase text-medical-muted text-[10px]">{label}</label>{children}</div>;
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl">
      <div className="flex items-center justify-between border-b border-medical-border pb-3"><h3 className="text-base font-bold text-secondary">{title}</h3><button onClick={onClose} className="text-medical-muted font-bold text-sm">✕</button></div>
      {children}
    </div>
  </div>
);
const ModalActions = ({ onClose, label, tone = 'primary' }) => (
  <div className="pt-2 flex justify-end gap-3">
    <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-secondary text-secondary font-bold">{label === 'Confirm Issue' ? 'Cancel' : 'Cancel'}</button>
    <button type="submit" className={`px-5 py-2 rounded-xl text-white font-bold shadow-md ${tone === 'error' ? 'bg-status-error hover:bg-red-700' : 'bg-primary hover:bg-primary-hover'}`}>{label}</button>
  </div>
);

export default BloodBankManagementPage;
