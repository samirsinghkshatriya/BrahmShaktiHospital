import mongoose from 'mongoose';

const pharmacyProductSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    genericName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Antibiotics',
        'Analgesics & Pain Relief',
        'Cardiac & Hypertensive Care',
        'Respiratory & Asthma',
        'Diabetes & Endocrinology',
        'Gastrointestinal & Antacids',
        'Dermatology & Topicals',
        'Vitamins & Supplements',
        'Critical Care & Injections'
      ]
    },
    manufacturer: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    minThreshold: {
      type: Number,
      default: 15
    },
    requiresPrescription: {
      type: Boolean,
      default: true
    },
    batchNo: {
      type: String,
      required: true
    },
    expiryDate: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock'
    }
  },
  { timestamps: true }
);

pharmacyProductSchema.pre('save', function (next) {
  if (this.stock <= 0) {
    this.status = 'Out of Stock';
  } else if (this.stock <= this.minThreshold) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

export const PharmacyProduct =
  mongoose.models.PharmacyProduct || mongoose.model('PharmacyProduct', pharmacyProductSchema);
export default PharmacyProduct;
