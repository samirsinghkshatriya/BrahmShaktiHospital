import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['appointment_consultation', 'general_enquiry', 'international_patient', 'callback_request'],
      default: 'general_enquiry'
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    department: { type: String },
    doctorName: { type: String },
    preferredDate: { type: String },
    country: { type: String, default: 'India' },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['received', 'acknowledged', 'in_review', 'resolved'],
      default: 'received'
    },
    referenceNumber: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
