import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Droplets, Search, Calendar, ShieldCheck, ArrowRight, Loader2, HeartHandshake } from 'lucide-react';
import api from '../../services/api';
import { submitEnquiry } from '../../lib/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = ['Whole Blood', 'Packed Red Blood Cells', 'Platelets', 'Fresh Frozen Plasma', 'Cryoprecipitate'];

export const BloodAvailabilityPage = () => {
  const [searchParams] = useSearchParams();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(searchParams.get('group') || '');
  const [component, setComponent] = useState('');
  const [enquiry, setEnquiry] = useState({ name: '', phone: '' });
  const [sending, setSending] = useState(false);

  const fetchInventory = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {};
      if (filters.group) params.bloodGroup = filters.group;
      if (filters.component) params.component = filters.component;
      const res = await api.get('/blood-bank/inventory', { params });
      if (res.data.success) setInventory(res.data.data);
    } catch (err) {
      toast.error('Could not load live availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory({ group: searchParams.get('group') || '' }); }, []);

  const lastUpdated = inventory.reduce((acc, i) => {
    const t = i.lastUpdated ? new Date(i.lastUpdated).getTime() : 0;
    return t > acc ? t : acc;
  }, 0);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!enquiry.name || !enquiry.phone) { toast.error('Enter your name and phone'); return; }
    setSending(true);
    try {
      await submitEnquiry({
        fullName: enquiry.name,
        phone: enquiry.phone,
        type: 'blood_availability_enquiry',
        message: `Availability enquiry for ${group || 'any group'} ${component || 'any component'} blood.`
      });
      toast.success('Availability enquiry submitted. Our team will call you.');
      setEnquiry({ name: '', phone: '' });
    } catch (err) {
      toast.error('Failed to submit enquiry');
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-10 pb-20">
      <section className="bg-secondary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
            <Droplets className="w-3.5 h-3.5" /> Live Availability
          </div>
          <h1 className="text-4xl font-black tracking-tight">Blood & Component Availability</h1>
          <p className="text-sm text-slate-300">Real-time stock drawn from the hospital blood bank inventory. No patient or donor details are shown publicly.</p>
          {lastUpdated > 0 && (
            <p className="text-xs text-accent font-semibold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Last updated: {new Date(lastUpdated).toLocaleString()}</p>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select value={group} onChange={(e) => setGroup(e.target.value)} className="p-3 rounded-xl border border-medical-border text-xs font-semibold focus:border-primary focus:outline-hidden">
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={component} onChange={(e) => setComponent(e.target.value)} className="p-3 rounded-xl border border-medical-border text-xs font-semibold focus:border-primary focus:outline-hidden">
            <option value="">All Components</option>
            {COMPONENTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => fetchInventory({ group, component })} className="p-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center justify-center gap-2">
            <Search className="w-4 h-4" /> Check Availability
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-medical-muted"><Loader2 className="w-5 h-5 animate-spin" /> Loading inventory…</div>
        ) : inventory.length === 0 ? (
          <div className="p-8 text-center text-sm text-medical-muted bg-white rounded-2xl border border-medical-border">No matching stock available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-medical-border shadow-soft p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-full bg-red-100 text-status-error flex items-center justify-center font-black">{item.bloodGroup}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'Critical' || item.status === 'Expired' ? 'bg-red-100 text-status-error' : item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-status-success'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-secondary">{item.component}</div>
                <div className="text-2xl font-black text-primary">{item.unitsAvailable} <span className="text-xs font-normal text-medical-muted">units</span></div>
                <div className="text-[11px] text-medical-muted">₹{item.pricePerUnit || 1200} / unit</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
          <div className="flex items-center gap-2 text-secondary font-bold text-sm"><ShieldCheck className="w-4 h-4 text-primary" /> Submit an Availability Enquiry</div>
          <p className="text-xs text-medical-muted">Can't find your requirement? Leave your contact and our blood bank desk will call you with the latest stock status.</p>
          <form onSubmit={handleEnquiry} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })} placeholder="Your name" className="p-3 rounded-xl border border-medical-border text-xs focus:border-primary focus:outline-hidden" />
            <input value={enquiry.phone} onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })} placeholder="Mobile number" className="p-3 rounded-xl border border-medical-border text-xs focus:border-primary focus:outline-hidden" />
            <button disabled={sending} className="p-3 rounded-xl bg-secondary text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} Submit Enquiry
            </button>
          </form>
          <div className="flex flex-wrap gap-3 pt-2 text-xs">
            <Link to="/blood-bank/donate" className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"><HeartHandshake className="w-4 h-4" /> Want to donate instead?</Link>
            <Link to="/blood-bank/request" className="inline-flex items-center gap-1.5 font-bold text-status-error hover:underline"><Droplets className="w-4 h-4" /> Raise a blood request</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BloodAvailabilityPage;
