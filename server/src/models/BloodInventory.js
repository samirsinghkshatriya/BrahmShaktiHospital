import mongoose from 'mongoose';

const bloodInventorySchema = new mongoose.Schema(
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
    unitsAvailable: {
      type: Number,
      required: true,
      default: 10
    },
    minThreshold: {
      type: Number,
      default: 5
    },
    pricePerUnit: {
      type: Number,
      default: 1200
    },
    storageTemp: {
      type: String,
      default: '2°C to 6°C'
    },
    status: {
      type: String,
      enum: ['Adequate', 'Low Stock', 'Critical', 'Expired'],
      default: 'Adequate'
    },
    // Batch & expiry awareness (represents the oldest active batch for this
    // group + component). Expired stock must never be issued to a patient.
    batchNo: {
      type: String,
      default: ''
    },
    collectedDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      default: null
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

bloodInventorySchema.virtual('isExpired').get(function () {
  return !!this.expiryDate && new Date(this.expiryDate).getTime() < Date.now();
});

bloodInventorySchema.virtual('daysToExpiry').get(function () {
  if (!this.expiryDate) return null;
  const diff = new Date(this.expiryDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

bloodInventorySchema.set('toJSON', { virtuals: true });
bloodInventorySchema.set('toObject', { virtuals: true });

bloodInventorySchema.pre('save', function (next) {
  if (this.isExpired) {
    this.status = 'Expired';
  } else if (this.unitsAvailable <= 3) {
    this.status = 'Critical';
  } else if (this.unitsAvailable <= this.minThreshold) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Adequate';
  }
  this.lastUpdated = new Date();
  next();
});

export const BloodInventory =
  mongoose.models.BloodInventory || mongoose.model('BloodInventory', bloodInventorySchema);
export default BloodInventory;
