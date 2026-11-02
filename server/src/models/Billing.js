import mongoose from 'mongoose';

const billingItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['OPD', 'IPD Room', 'Doctor Consultation', 'Pharmacy', 'Diagnostic Lab', 'Radiology', 'Procedure', 'Nursing'],
    default: 'Doctor Consultation'
  },
  qty: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const billingSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    patientId: {
      type: String,
      default: ''
    },
    patientName: {
      type: String,
      required: true
    },
    patientPhone: {
      type: String,
      required: true
    },
    patientAge: {
      type: Number,
      default: 35
    },
    billType: {
      type: String,
      enum: ['OPD Consultation', 'IPD Inpatient', 'Pharmacy Sales', 'Diagnostic & Lab', 'Emergency Trauma'],
      default: 'OPD Consultation'
    },
    items: [billingItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Online payment'],
      default: 'UPI'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partially Paid', 'Cancelled'],
      default: 'Paid'
    },
    generatedBy: {
      type: String,
      default: 'Hospital Billing Desk'
    },
    notes: {
      type: String,
      default: 'Subsidised healthcare tariff applied under Brahm Shakti Trust (Regd.) guidelines.'
    }
  },
  { timestamps: true }
);

export const Billing = mongoose.models.Billing || mongoose.model('Billing', billingSchema);
export default Billing;
