import React, { useState, useEffect } from 'react';
import {
  Pill,
  Plus,
  Search,
  Filter,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Package,
  Calendar,
  IndianRupee
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PharmacyManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('Antibiotics');
  const [manufacturer, setManufacturer] = useState('');
  const [dosage, setDosage] = useState('');
  const [price, setPrice] = useState('150');
  const [stock, setStock] = useState('100');
  const [batchNo, setBatchNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [requiresPrescription, setRequiresPrescription] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/pharmacy/products', {
        params: {
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: search || undefined
        }
      });
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching pharmacy products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setGenericName('');
    setCategory('Antibiotics');
    setManufacturer('Standard Pharmaceuticals');
    setDosage('500 mg, Oral Tablet');
    setPrice('150');
    setStock('100');
    setBatchNo(`BATCH-${Date.now().toString().slice(-4)}`);
    setExpiryDate('2028-12-31');
    setRequiresPrescription(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setGenericName(p.genericName);
    setCategory(p.category);
    setManufacturer(p.manufacturer);
    setDosage(p.dosage);
    setPrice(String(p.price));
    setStock(String(p.stock));
    setBatchNo(p.batchNo);
    setExpiryDate(p.expiryDate);
    setRequiresPrescription(Boolean(p.requiresPrescription));
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !genericName || !price) {
      toast.error('Product name, generic name, and price are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        genericName,
        category,
        manufacturer,
        dosage,
        price: Number(price),
        stock: Number(stock),
        batchNo,
        expiryDate,
        requiresPrescription
      };

      if (editingProduct) {
        await api.put(`/pharmacy/products/${editingProduct.productId}`, payload);
        toast.success('Pharmacy product updated successfully');
      } else {
        await api.post('/pharmacy/products', payload);
        toast.success('New formulation added to hospital pharmacy');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockCount = products.filter(p => p.stock <= 25).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Pharmacy Store & Inventory</h2>
          <p className="text-xs text-medical-muted">
            Manage pharmaceutical formularies, batch numbers, expiry dates, and real-time stock alerts.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Low Stock Warning */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between text-amber-900 font-bold">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>{lowStockCount} Drugs currently below minimum safety stock threshold (&le; 25 units)</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-amber-700 hidden sm:block">
            Auto Purchase Requisition Active
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-medical-border shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-medical-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            placeholder="Search brand, generic name, or batch number..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-medical-border focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
          <span className="text-medical-muted font-bold">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 rounded-xl border border-medical-border font-medium text-secondary focus:border-primary focus:outline-hidden text-xs"
          >
            <option value="all">All Formularies</option>
            {[
              'Antibiotics',
              'Cardiac & Hypertensive Care',
              'Diabetes & Endocrinology',
              'Gastrointestinal & Antacids',
              'Analgesics & Pain Relief',
              'Respiratory & Asthma',
              'Vitamins & Supplements',
              'Critical Care & Injections'
            ].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
      ) : (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Brand & Generic Name</th>
                  <th className="py-3.5 px-5 font-bold">Category</th>
                  <th className="py-3.5 px-5 font-bold">Batch & Expiry</th>
                  <th className="py-3.5 px-5 font-bold">Stock In Hand</th>
                  <th className="py-3.5 px-5 font-bold">Price (₹)</th>
                  <th className="py-3.5 px-5 font-bold">Rx Policy</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {products.map((p) => (
                  <tr key={p.productId} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-secondary text-sm">{p.name}</div>
                      <div className="text-[10px] text-medical-muted italic">{p.genericName} · {p.manufacturer}</div>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-primary">
                      {p.category}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-medium text-secondary">{p.batchNo}</div>
                      <div className="text-[10px] text-medical-muted">Exp: {p.expiryDate}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`font-black text-sm ${p.stock <= 25 ? 'text-status-error' : 'text-secondary'}`}>
                        {p.stock}
                      </span>
                      <span className="text-[10px] text-medical-muted ml-1">Units</span>
                    </td>
                    <td className="py-3.5 px-5 font-black text-secondary">
                      ₹{p.price}
                    </td>
                    <td className="py-3.5 px-5">
                      {p.requiresPrescription ? (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-status-error text-[10px] font-black uppercase">
                          Rx Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-green-100 text-status-success text-[10px] font-bold uppercase">
                          OTC
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenEditModal(p)}
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

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <h3 className="text-lg font-bold text-secondary">
                {editingProduct ? 'Edit Pharmacy Product' : 'Add New Drug Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Brand Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Augmentin 625 Duo"
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Generic Formulation Name</label>
                <input
                  type="text"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  placeholder="Amoxicillin + Clavulanate"
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  >
                    {[
                      'Antibiotics',
                      'Cardiac & Hypertensive Care',
                      'Diabetes & Endocrinology',
                      'Gastrointestinal & Antacids',
                      'Analgesics & Pain Relief',
                      'Respiratory & Asthma',
                      'Vitamins & Supplements',
                      'Critical Care & Injections',
                      'Dermatology & Topicals'
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Manufacturer</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="Cipla / Sun Pharma"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary font-bold focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary font-bold focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Batch No.</label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Dosage Specification</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="500 mg, Strip of 10"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-medical-coolgray flex items-center justify-between">
                <span className="font-bold text-secondary">Schedule H / Rx Prescription Mandate</span>
                <input
                  type="checkbox"
                  checked={requiresPrescription}
                  onChange={(e) => setRequiresPrescription(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
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
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyManagementPage;
