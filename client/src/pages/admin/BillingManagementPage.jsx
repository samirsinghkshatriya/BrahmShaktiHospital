import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Printer,
  Eye,
  IndianRupee,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Phone,
  Trash2
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const BillingManagementPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Create Bill Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('38');
  const [billType, setBillType] = useState('OPD Consultation');
  const [items, setItems] = useState([
    { description: 'Specialist Consultation - Brahm Shakti Hospital', category: 'Doctor Consultation', qty: 1, unitPrice: 800 }
  ]);
  const [discount, setDiscount] = useState('0');
  const [tax, setTax] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);

  // View / Print Invoice Modal
  const [viewInvoice, setViewInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/billing/invoices', {
        params: {
          search: search || undefined,
          paymentStatus: statusFilter !== 'all' ? statusFilter : undefined
        }
      });
      if (res.data.success) {
        setInvoices(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching billing invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const handleAddItemRow = () => {
    setItems([
      ...items,
      { description: 'Clinical Service / Procedure', category: 'Doctor Consultation', qty: 1, unitPrice: 500 }
    ]);
  };

  const handleRemoveItemRow = (idx) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, val) => {
    const updated = [...items];
    updated[idx][field] = val;
    setItems(updated);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.unitPrice) * (Number(item.qty) || 1)), 0);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return Math.max(0, sub + Number(tax) - Number(discount));
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!patientName || !patientPhone || items.length === 0) {
      toast.error('Patient name, phone, and at least one item required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/billing/invoices', {
        patientName,
        patientPhone,
        patientAge: Number(patientAge),
        billType,
        items,
        discount: Number(discount),
        tax: Number(tax),
        paymentMethod,
        paymentStatus: 'Paid'
      });

      if (res.data.success) {
        toast.success(`Invoice Generated: ${res.data.data.invoiceNumber}`);
        setCreateModalOpen(false);
        fetchInvoices();
        setViewInvoice(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invoice generation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Hospital Billing & Invoicing</h2>
          <p className="text-xs text-medical-muted">
            Generate itemized patient invoices for OPD, IPD, Pharmacy, and Diagnostics under Brahm Shakti Trust guidelines.
          </p>
        </div>
        <button
          onClick={() => {
            setItems([{ description: 'Specialist Consultation - Brahm Shakti Hospital', category: 'Doctor Consultation', qty: 1, unitPrice: 800 }]);
            setCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-medical-border shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-medical-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInvoices()}
            placeholder="Search by invoice number, patient name, or mobile..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-medical-border focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="font-bold text-medical-muted">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-medical-border font-medium text-secondary focus:border-primary focus:outline-hidden"
          >
            <option value="all">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
      ) : (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Invoice No.</th>
                  <th className="py-3.5 px-5 font-bold">Patient Details</th>
                  <th className="py-3.5 px-5 font-bold">Bill Category</th>
                  <th className="py-3.5 px-5 font-bold">Billing Date</th>
                  <th className="py-3.5 px-5 font-bold">Total Amount</th>
                  <th className="py-3.5 px-5 font-bold">Payment Method</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold text-right">Invoice Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {invoices.map((inv) => (
                  <tr key={inv.invoiceNumber} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-secondary">{inv.patientName}</div>
                      <div className="text-[10px] text-medical-muted">{inv.patientPhone}</div>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-secondary">
                      {inv.billType}
                    </td>
                    <td className="py-3.5 px-5 text-medical-muted">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-5 font-black text-secondary text-sm">
                      ₹{inv.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-secondary">
                      {inv.paymentMethod}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-full bg-green-100 text-status-success font-bold text-[10px]">
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setViewInvoice(inv)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-medical-coolgray hover:bg-primary hover:text-white text-secondary font-bold transition-all text-[11px] border border-medical-border"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Print Bill</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto print:shadow-none print:p-0 print:border-none">
            {/* Header: Hospital Logo & Details */}
            <div className="flex items-start justify-between border-b-2 border-secondary pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                    BSH
                  </div>
                  <h3 className="text-xl font-black text-secondary tracking-tight">BRAHM SHAKTI HOSPITAL</h3>
                </div>
                <p className="text-[11px] text-medical-muted mt-0.5">
                  Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi - 110085
                </p>
                <p className="text-[10px] text-primary font-bold">
                  Managed by Brahm Shakti Trust (Regd.) · NABH & NABL Accredited
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-medical-muted block">Tax Invoice / Receipt</span>
                <strong className="text-sm font-black text-secondary block">{viewInvoice.invoiceNumber}</strong>
                <span className="text-[10px] text-medical-muted">Date: {viewInvoice.date}</span>
              </div>
            </div>

            {/* Patient Details Strip */}
            <div className="p-4 rounded-xl bg-medical-coolgray border border-medical-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Patient Name</span>
                <strong className="text-secondary">{viewInvoice.patientName}</strong>
              </div>
              <div>
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Contact</span>
                <strong className="text-secondary">{viewInvoice.patientPhone}</strong>
              </div>
              <div>
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Service Type</span>
                <strong className="text-primary">{viewInvoice.billType}</strong>
              </div>
              <div>
                <span className="text-medical-muted block text-[10px] uppercase font-bold">Payment Status</span>
                <strong className="text-status-success">{viewInvoice.paymentStatus} ({viewInvoice.paymentMethod})</strong>
              </div>
            </div>

            {/* Itemized Services Table */}
            <div className="border border-medical-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary text-white text-[10px] uppercase">
                  <tr>
                    <th className="p-3 font-bold">Item Description</th>
                    <th className="p-3 font-bold">Category</th>
                    <th className="p-3 font-bold text-center">Qty</th>
                    <th className="p-3 font-bold text-right">Unit Price</th>
                    <th className="p-3 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-medical-border text-secondary">
                  {viewInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium">{item.description}</td>
                      <td className="p-3 text-medical-muted text-[11px]">{item.category}</td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-right">₹{item.unitPrice}</td>
                      <td className="p-3 text-right font-bold">₹{item.amount || item.unitPrice * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Calculations */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-medical-muted">
                  <span>Subtotal Amount:</span>
                  <span className="font-semibold text-secondary">₹{viewInvoice.subtotal}</span>
                </div>
                {viewInvoice.discount > 0 && (
                  <div className="flex justify-between text-status-success font-bold">
                    <span>Trust Subsidy Discount:</span>
                    <span>-₹{viewInvoice.discount}</span>
                  </div>
                )}
                {viewInvoice.tax > 0 && (
                  <div className="flex justify-between text-medical-muted">
                    <span>GST / Taxes:</span>
                    <span>+₹{viewInvoice.tax}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-medical-border flex justify-between text-sm font-black text-secondary">
                  <span>Net Total Paid:</span>
                  <span className="text-primary text-base">₹{viewInvoice.totalAmount}</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-medical-muted text-center italic border-t border-medical-border pt-3">
              {viewInvoice.notes || 'Subsidised healthcare tariff applied under Brahm Shakti Trust (Regd.) guidelines.'}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 print:hidden">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-bold text-xs"
              >
                Close View
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Bill Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <h3 className="text-lg font-bold text-secondary">Generate Patient Hospital Bill</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient full name"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Phone Number</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91-98XXXXXXXX"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Billing Category</label>
                  <select
                    value={billType}
                    onChange={(e) => setBillType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  >
                    <option value="OPD Consultation">OPD Consultation</option>
                    <option value="IPD Inpatient">IPD Inpatient Hospitalization</option>
                    <option value="Pharmacy Sales">Pharmacy Medication</option>
                    <option value="Diagnostic & Lab">Diagnostic Pathology & Radiology</option>
                    <option value="Emergency Trauma">Emergency Casualty Resuscitation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Online payment">Online Portal Netbanking</option>
                  </select>
                </div>
              </div>

              {/* Itemized Services Builder */}
              <div className="space-y-2 pt-2 border-t border-medical-border">
                <div className="flex items-center justify-between font-bold text-secondary">
                  <span>Itemized Charges</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Service description"
                        required
                        className="col-span-5 p-2 rounded-xl border border-medical-border text-secondary focus:border-primary"
                      />
                      <select
                        value={item.category}
                        onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                        className="col-span-3 p-2 rounded-xl border border-medical-border text-secondary text-[11px]"
                      >
                        <option value="Doctor Consultation">Consultation</option>
                        <option value="IPD Room">IPD Room</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Diagnostic Lab">Diagnostic</option>
                        <option value="Procedure">Procedure</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        placeholder="Qty"
                        required
                        className="col-span-1 p-2 rounded-xl border border-medical-border text-center text-secondary"
                      />
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                        placeholder="Price"
                        required
                        className="col-span-2 p-2 rounded-xl border border-medical-border text-right font-bold text-secondary"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="col-span-1 text-red-500 hover:text-red-700 text-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discounts & Total */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-medical-border">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Trust Concession / Discount (₹)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full p-2 rounded-xl border border-medical-border text-secondary font-bold"
                  />
                </div>
                <div className="p-3 rounded-xl bg-medical-coolgray flex items-center justify-between">
                  <span className="font-bold text-secondary">Final Net Total:</span>
                  <span className="text-base font-black text-primary">₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Generating...' : 'Save & Print Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingManagementPage;
