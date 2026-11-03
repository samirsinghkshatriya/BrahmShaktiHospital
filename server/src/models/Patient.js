import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  // Unique Hospital Registration ID issued by the hospital registry.
  // Kept distinct from the internal patientId so retrieval by (mobile + UHID)
  // can be validated securely at the public booking flow.
  uhid: {
    type: String,
    unique: true,
    sparse: true
  },
  // Optional link to a login User account
  userId: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  address: {
    type: String,
    default: ''
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  medicalHistory: [
    {
      diagnosis: String,
      date: String,
      doctor: String,
      notes: String
    }
  ],
  admissions: [
    {
      admissionId: String,
      roomType: String,
      admissionDate: String,
      dischargeDate: String,
      status: String
    }
  ],
  status: {
    type: String,
    enum: ['Active', 'Discharged', 'OPD Only'],
    default: 'Active'
  }
}, {
  timestamps: true
});

export default mongoose.models.Patient || mongoose.model('Patient', patientSchema);
