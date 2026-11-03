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
    patientAge: {
      type: Number,
      default: null
    },
    patientGender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: ''
    },
    patientUid: {
      type: String,
      default: ''
    },
    hospitalName: {
      type: String,
      default: 'Brahm Shakti Hospital'
    },
    wardOrDepartment: {
      type: String,
      default: ''
    },
    prescribingDoctor: {
      type: String,
      default: ''
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
      default: 'Pending verification by Blood Bank Medical Officer'
    },
    prescriptionDocUrl: {
      type: String,
      default: ''
    },
    // Full request lifecycle. Final clinical/stock decisions are made by
    // authorized blood bank personnel, never automatically.
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Approved',
        'Partially Available',
        'Available',
        'Issued',
        'Completed',
        'Rejected'
      ],
      default: 'Submitted'
    },
    allocatedUnits: {
      type: Number,
      default: 0
    },
    issuedUnits: {
      type: Number,
      default: 0
    },
    reviewedBy: {
      type: String,
      default: ''
    },
    reviewNotes: {
      type: String,
      default: ''
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
