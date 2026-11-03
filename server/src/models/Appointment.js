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
      enum: [
        'In-person Consultation',
        'Video Consultation',
        'Private OPD',
        'General OPD',
        'Follow-up Consultation',
        'OPD Consultation',
        'Emergency Consultation'
      ],
      default: 'General OPD'
    },
    // Hospital registration number (UHID) once the patient is registered
    uhid: {
      type: String,
      default: ''
    },
    // Link to Patient record (patientId string) when registered
    patientId: {
      type: String,
      default: ''
    },
    // Link to the authenticated User account (if registered via account)
    patientUserId: {
      type: String,
      default: ''
    },
    // Back-reference to the concrete AppointmentSlot that was booked
    slotId: {
      type: String,
      default: ''
    },
    // OPD queue / waiting token generated at confirmation
    tokenNumber: {
      type: String,
      default: ''
    },
    // If this appointment was moved from an earlier slot, keep the original ref
    rescheduledFrom: {
      type: String,
      default: ''
    },
    cancellationReason: {
      type: String,
      default: ''
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

// Prevent double booking at the database level for active appointments on the
// same doctor + date + time window (cancelled/rescheduled rows are excluded).
appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['Pending', 'Confirmed'] } }
  }
);

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
export default Appointment;
