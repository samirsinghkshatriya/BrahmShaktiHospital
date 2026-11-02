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
      enum: ['Adequate', 'Low Stock', 'Critical'],
      default: 'Adequate'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

bloodInventorySchema.pre('save', function (next) {
  if (this.unitsAvailable <= 3) {
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
