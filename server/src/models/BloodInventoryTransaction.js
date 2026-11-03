import mongoose from 'mongoose';

/**
 * BloodInventoryTransaction
 * -------------------------
 * Immutable ledger of every change made to blood inventory (donation credit,
 * issue to patient, adjustment, discard of expired units). Provides the
 * "inventory transaction history" required for blood-safety traceability.
 */
const bloodInventoryTransactionSchema = new mongoose.Schema(
  {
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true
    },
    component: {
      type: String,
      enum: [
        'Whole Blood',
        'Packed Red Blood Cells',
        'Platelets',
        'Fresh Frozen Plasma',
        'Cryoprecipitate'
      ],
      required: true
    },
    // Direction of stock movement
    type: {
      type: String,
      enum: ['DONATION_IN', 'ISSUE_OUT', 'ADJUSTMENT', 'DISCARD_EXPIRED'],
      required: true
    },
    // Signed change applied to unitsAvailable (+ credit / - debit)
    units: { type: Number, required: true },
    balanceAfter: { type: Number, default: 0 },
    batchNo: { type: String, default: '' },
    // Related record ids for traceability
    donationId: { type: String, default: '' },
    requestId: { type: String, default: '' },
    // Authorized user who performed the movement
    performedBy: { type: String, default: '' },
    performedByRole: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

bloodInventoryTransactionSchema.index({ bloodGroup: 1, component: 1, createdAt: -1 });

export const BloodInventoryTransaction =
  mongoose.models.BloodInventoryTransaction ||
  mongoose.model('BloodInventoryTransaction', bloodInventoryTransactionSchema);
export default BloodInventoryTransaction;
