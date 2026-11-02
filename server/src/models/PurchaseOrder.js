import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    supplierId: {
      type: String,
      default: ''
    },
    supplierName: {
      type: String,
      required: true
    },
    supplierEmail: {
      type: String,
      default: ''
    },
    items: [
      {
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitCost: { type: Number, required: true },
        totalCost: { type: Number, required: true }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    orderDate: {
      type: String,
      required: true
    },
    expectedDelivery: {
      type: String,
      required: true
    },
    deliveryAddress: {
      type: String,
      default: 'Central Medical Stores, Brahm Shakti Hospital, Budh Vihar, New Delhi - 110085'
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    paymentTerms: {
      type: String,
      default: '30 Days Net from Delivery'
    }
  },
  { timestamps: true }
);

export const PurchaseOrder =
  mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', purchaseOrderSchema);
export default PurchaseOrder;
