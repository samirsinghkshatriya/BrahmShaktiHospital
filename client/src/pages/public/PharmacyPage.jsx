import React, { useState, useEffect } from 'react';
import {
  Pill,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ShoppingCart,
  Clock,
  Sparkles,
  PhoneCall,
  FileCheck
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PharmacyPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Cart & Prescription State
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [rxVerified, setRxVerified] = useState(false);
  const [patientName, setPatientName] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/pharmacy/products', {
        params: {
          category: category !== 'all' ? category : undefined,
          search: search || undefined,
          sortBy,
          sortOrder
        }
      });
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching pharmacy items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = [
    'all',
    'Antibiotics',
    'Cardiac & Hypertensive Care',
    'Diabetes & Endocrinology',
    'Gastrointestinal & Antacids',
    'Analgesics & Pain Relief',
    'Respiratory & Asthma',
    'Vitamins & Supplements',
    'Critical Care & Injections',
    'Dermatology & Topicals'
  ];

  const addToCart = (product) => {
    if (product.stock <= 0) {
      toast.error('Product is currently out of stock.');
      return;
    }

    setCart((prev) => {
      const exists = prev.find((p) => p.productId === product.productId);
      if (exists) {
        return prev.map((p) =>
          p.productId === product.productId ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast.success(`${product.name} added to pharmacy order`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const hasRxItems = cart.some((p) => p.requiresPrescription);

  const handleDispenseCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your order cart is empty');
      return;
    }

    if (hasRxItems && !rxVerified) {
      toast.error('Schedule H/X prescription verification is legally required for Rx medicines.');
      return;
    }

    toast.success('Pharmacy reservation confirmed! Collect at Counter 1.');
    setCart([]);
    setCartOpen(false);
    setRxVerified(false);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Top Banner */}
      <section className="bg-secondary text-white py-14 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
              <Pill className="w-3.5 h-3.5" />
              <span>24x7 In-Hospital Pharmacy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Hospital Pharmacy & Formulary
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Authentic drugs, vaccines, and surgical consumables procured directly from certified manufacturers at subsidized Brahm Shakti Trust prices.
            </p>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Medication Cart ({cart.length})</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent text-accent-dark font-black text-[10px] flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-medical-border shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-medical-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand or generic name..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-medical-border focus:border-primary focus:outline-hidden"
            />
          </form>

          {/* Sorting */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs text-medical-muted font-bold">Sort:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="p-2 text-xs rounded-xl border border-medical-border font-medium text-secondary focus:border-primary focus:outline-hidden"
            >
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stock-desc">Stock (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white text-secondary border border-medical-border hover:border-primary'
              }`}
            >
              {cat === 'all' ? 'All Formularies' : cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-medical-border space-y-3">
            <Pill className="w-10 h-10 text-medical-muted mx-auto" />
            <h3 className="text-lg font-bold text-secondary">No Medication Matches Found</h3>
            <p className="text-xs text-medical-muted">Try searching with a generic formulation name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="bg-white rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 rounded-xl bg-slate-100 overflow-hidden relative mb-3">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.requiresPrescription ? (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        Rx Required
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-green-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                        OTC General
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-bold text-secondary mt-1 leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-medical-muted italic mt-0.5 line-clamp-1">
                    {product.genericName}
                  </p>

                  <div className="mt-3 text-[11px] text-medical-slate space-y-1">
                    <div>Mfg: <strong className="text-secondary">{product.manufacturer}</strong></div>
                    <div>Dosage: <span>{product.dosage}</span></div>
                    <div className="flex items-center justify-between pt-1">
                      <span>Stock: <strong>{product.stock} units</strong></span>
                      <span className="text-status-success font-bold text-[10px]">{product.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-medical-border flex items-center justify-between">
                  <div className="text-base font-black text-secondary">
                    ₹{product.price}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart Drawer / Slide-over */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-medical-border pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-secondary">Pharmacy Order Bag</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1 rounded text-medical-muted hover:text-secondary font-bold"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-medical-muted text-xs">
                  Your medication bag is currently empty.
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 rounded-xl bg-medical-coolgray border border-medical-border">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-secondary">{item.name}</div>
                        <div className="text-[10px] text-medical-muted">Qty: {item.qty} × ₹{item.price}</div>
                        {item.requiresPrescription && (
                          <span className="text-[9px] font-bold text-status-error uppercase">Rx Verification Required</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-secondary">₹{item.price * item.qty}</span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 text-xs hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Prescription Check Policy Notice */}
                  {hasRxItems && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-status-error space-y-2">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Prescription Requirement Verification</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-red-700">
                        Government drugs policy prohibits dispensing prescription medications without clinical verification by a registered physician.
                      </p>
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={rxVerified}
                          onChange={(e) => setRxVerified(e.target.checked)}
                          className="accent-primary rounded"
                        />
                        <span className="text-[11px] font-bold text-red-900">
                          I confirm I possess an authorized valid Doctor's Prescription
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-medical-border space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-secondary">
                  <span>Subtotal Amount:</span>
                  <span className="text-lg font-black text-primary">₹{cartTotal}</span>
                </div>
                <button
                  onClick={handleDispenseCheckout}
                  disabled={hasRxItems && !rxVerified}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-all disabled:opacity-40"
                >
                  Reserve Medications at Counter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyPage;
