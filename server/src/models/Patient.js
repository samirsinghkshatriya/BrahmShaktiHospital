import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
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
