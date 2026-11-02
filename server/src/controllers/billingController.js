import Billing from '../models/Billing.js';
import { isMongoConnected } from '../config/db.js';
import { billingsData } from '../data/seedData.js';

let inMemoryBillings = [...billingsData];

export const getInvoices = async (req, res, next) => {
  try {
    const { paymentStatus, billType, search } = req.query;

    if (isMongoConnected) {
      let filter = {};

      // If logged in as patient, scope to patient phone or email
      if (req.user && req.user.role === 'patient') {
        filter.$or = [
          { patientPhone: req.user.phone },
          { patientName: req.user.name }
        ];
      }

      if (paymentStatus && paymentStatus !== 'all') filter.paymentStatus = paymentStatus;
      if (billType && billType !== 'all') filter.billType = billType;

      if (search) {
        filter.$or = [
          { invoiceNumber: { $regex: search, $options: 'i' } },
          { patientName: { $regex: search, $options: 'i' } },
          { patientPhone: { $regex: search, $options: 'i' } }
        ];
      }

      const invoices = await Billing.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: invoices.length, data: invoices });
    }

    let filtered = [...inMemoryBillings];
    if (req.user && req.user.role === 'patient') {
      filtered = filtered.filter(
        b => b.patientPhone === req.user.phone || b.patientName.toLowerCase().includes(req.user.name.toLowerCase())
      );
    }
    if (paymentStatus && paymentStatus !== 'all') filtered = filtered.filter(b => b.paymentStatus === paymentStatus);
    if (billType && billType !== 'all') filtered = filtered.filter(b => b.billType === billType);

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.invoiceNumber.toLowerCase().includes(q) ||
          b.patientName.toLowerCase().includes(q) ||
          b.patientPhone.includes(q)
      );
    }

    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const invoice = await Billing.findOne({
        $or: [{ invoiceNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (invoice) return res.status(200).json({ success: true, data: invoice });
    }

    const invoice = inMemoryBillings.find(b => b.invoiceNumber === id || b._id === id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const {
      patientName,
      patientPhone,
      patientId,
      patientAge = 35,
      billType = 'OPD Consultation',
      items = [],
      discount = 0,
      tax = 0,
      paymentMethod = 'UPI',
      paymentStatus = 'Paid',
      notes
    } = req.body;

    if (!patientName || !patientPhone || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Patient name, phone, and at least one billing item are required.'
      });
    }

    const subtotal = items.reduce((acc, curr) => acc + (Number(curr.unitPrice) * Number(curr.qty || 1)), 0);
    const totalAmount = Math.max(0, subtotal + Number(tax) - Number(discount));
    const invoiceNumber = `INV-BSH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice = {
      invoiceNumber,
      patientId: patientId || `BSH-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      patientPhone,
      patientAge: Number(patientAge),
      billType,
      items: items.map(item => ({
        description: item.description,
        category: item.category || 'Doctor Consultation',
        qty: Number(item.qty) || 1,
        unitPrice: Number(item.unitPrice),
        amount: Number(item.unitPrice) * (Number(item.qty) || 1)
      })),
      subtotal,
      tax: Number(tax),
      discount: Number(discount),
      totalAmount,
      paymentMethod,
      paymentStatus,
      generatedBy: req.user ? req.user.name : 'Hospital Billing Desk',
      date: new Date().toISOString().split('T')[0],
      notes: notes || 'Subsidised healthcare tariff applied under Brahm Shakti Trust (Regd.) guidelines.'
    };

    if (isMongoConnected) {
      const created = await Billing.create(newInvoice);
      return res.status(201).json({ success: true, message: 'Invoice generated successfully', data: created });
    }

    inMemoryBillings.unshift({ ...newInvoice, _id: `inv-${Date.now()}` });
    return res.status(201).json({ success: true, message: 'Invoice generated successfully', data: inMemoryBillings[0] });
  } catch (error) {
    next(error);
  }
};

export const updateInvoicePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    if (isMongoConnected) {
      const updated = await Billing.findOneAndUpdate(
        { $or: [{ invoiceNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { paymentStatus, paymentMethod },
        { new: true }
      );
      if (updated) return res.status(200).json({ success: true, message: 'Payment recorded', data: updated });
    }

    const idx = inMemoryBillings.findIndex(b => b.invoiceNumber === id || b._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Invoice not found' });
    inMemoryBillings[idx].paymentStatus = paymentStatus || inMemoryBillings[idx].paymentStatus;
    inMemoryBillings[idx].paymentMethod = paymentMethod || inMemoryBillings[idx].paymentMethod;
    return res.status(200).json({ success: true, message: 'Payment recorded', data: inMemoryBillings[idx] });
  } catch (error) {
    next(error);
  }
};
