import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true
    },
    patientName: {
      type: String,
      required: true
    },
    hospitalName: {
      type: String,
      default: 'Brahm Shakti Hospital'
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true
    },
    component: {
      type: String,
      required: true
    },
    unitsNeeded: {
      type: Number,
      required: true,
      default: 1
    },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Emergency'],
      default: 'Urgent'
    },
    contactPhone: {
      type: String,
      required: true
    },
    doctorPrescription: {
      type: String,
      default: 'Verified by Attending Medical Officer'
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'],
      default: 'Pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const BloodRequest =
  mongoose.models.BloodRequest || mongoose.model('BloodRequest', bloodRequestSchema);
export default BloodRequest;
