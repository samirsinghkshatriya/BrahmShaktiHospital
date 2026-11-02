import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  FileCheck,
  Search,
  Package,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PharmacistDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dispense simulator state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [dispenseQty, setDispenseQty] = useState(1);
  const [patientName, setPatientName] = useState('');
  const [rxVerified, setRxVerified] = useState(true);
  const [dispensing, setDispensing] = useState(false);

  const fetchPharmacyData = async () => {
    try {
      const [prodRes, alertRes] = await Promise.all([
        api.get('/pharmacy/products'),
        api.get('/pharmacy/alerts')
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (alertRes.data.success) {
        setAlerts(alertRes.data.data);
        if (prodRes.data.data.length > 0) setSelectedProduct(prodRes.data.data[0].productId);
      }
    } catch (err) {
      console.error('Error fetching pharmacist data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacyData();
  }, []);

  const handleDispense = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !patientName) {
      toast.error('Please select product and enter patient name');
      return;
    }

    setDispensing(true);
    try {
      const res = await api.post('/pharmacy/dispense', {
        items: [{ productId: selectedProduct, quantity: Number(dispenseQty) }],
        patientName,
        prescriptionVerified: rxVerified
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setPatientName('');
        fetchPharmacyData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Dispensing failed');
    } finally {
      setDispensing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-secondary to-teal-800 p-6 sm:p-8 rounded-3xl text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs text-accent font-bold uppercase tracking-wider">
            Hospital Dispensary & Formularies
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Pharmacy Control Desk
          </h2>
          <p className="text-xs text-slate-200">
            Dispense verified medications, inspect batch expirations, and track drug safety reserves.
          </p>
        </div>
        <Link
          to="/admin/pharmacy"
          className="px-5 py-3 rounded-xl bg-white text-secondary font-bold text-xs hover:bg-accent transition-colors shadow-sm self-start md:self-auto"
        >
          Manage All Products
        </Link>
      </div>

      {/* Stock Alerts Warning Bar */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between text-amber-900 font-bold">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              {alerts.length} Drugs Require Re-ordering: ({alerts.map(a => a.name).slice(0, 3).join(', ')}...)
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-amber-700">Stock &le; 25 units</span>
        </div>
      )}

      {/* Grid: Dispense Simulation & Inventory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dispense Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-4">
          <div className="flex items-center gap-2 font-bold text-secondary text-sm border-b border-medical-border pb-3">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <span>Dispense Medication at Counter</span>
          </div>

          <form onSubmit={handleDispense} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold uppercase text-medical-muted">Select Formulation</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-medical-border text-secondary font-semibold focus:border-primary"
              >
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.name} (Stock: {p.stock} units) — ₹{p.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Quantity to Dispense</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border font-bold text-secondary"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Patient Name / OPD Token</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient name"
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-medical-coolgray border border-medical-border flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-secondary block">Schedule H Prescription Verified</span>
                <span className="text-[10px] text-medical-muted">Stamp confirmed by attending physician</span>
              </div>
              <input
                type="checkbox"
                checked={rxVerified}
                onChange={(e) => setRxVerified(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <button
              type="submit"
              disabled={dispensing}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md transition-all disabled:opacity-50"
            >
              {dispensing ? 'Dispensing...' : 'Record Dispense & Adjust Stock'}
            </button>
          </form>
        </div>

        {/* Current Active Formulary Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-medical-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-medical-border">
            <h3 className="text-sm font-bold text-secondary">Drug Inventory Status</h3>
            <span className="text-xs text-medical-muted">{products.length} Formulations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-medical-coolgray text-secondary uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Brand & Generic</th>
                  <th className="py-2.5 px-3 font-bold">Category</th>
                  <th className="py-2.5 px-3 font-bold">Stock</th>
                  <th className="py-2.5 px-3 font-bold">Price</th>
                  <th className="py-2.5 px-3 font-bold">Batch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {products.slice(0, 7).map((p) => (
                  <tr key={p.productId} className="hover:bg-medical-coolgray/50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-secondary">{p.name}</div>
                      <div className="text-[10px] text-medical-muted">{p.genericName}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-primary">{p.category}</td>
                    <td className="py-2.5 px-3 font-black">
                      <span className={p.stock <= 25 ? 'text-status-error' : 'text-secondary'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold">₹{p.price}</td>
                    <td className="py-2.5 px-3 text-medical-muted text-[10px]">{p.batchNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboardPage;
