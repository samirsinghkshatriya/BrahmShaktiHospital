import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true
    },
    patientName: {
      type: String,
      required: true
    },
    patientPhone: {
      type: String,
      required: true
    },
    patientEmail: {
      type: String,
      default: ''
    },
    patientAge: {
      type: Number,
      default: 30
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    doctorId: {
      type: String,
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    departmentId: {
      type: String,
      required: true
    },
    departmentName: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    appointmentType: {
      type: String,
      enum: ['OPD Consultation', 'Follow-up Consultation', 'Emergency Consultation'],
      default: 'OPD Consultation'
    },
    symptoms: {
      type: String,
      default: ''
    },
    fee: {
      type: Number,
      default: 800
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Confirmed'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Paid'
    },
    paymentMethod: {
      type: String,
      default: 'UPI / Online'
    },
    doctorNotes: {
      type: String,
      default: ''
    },
    prescriptions: [
      {
        medicine: String,
        dosage: String,
        duration: String,
        instructions: String
      }
    ]
  },
  { timestamps: true }
);

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
export default Appointment;
