import mongoose from 'mongoose';

/**
 * AppointmentSlot
 * ---------------
 * A concrete, bookable slot for a doctor on a specific date & time window.
 * Availability is derived from real records (capacity vs bookedCount) so that
 * booking is atomic and double-booking is prevented at the database level.
 *
 * This model is the source of truth for "available time slots" — the public
 * booking UI must never rely on hardcoded slot arrays.
 */
const appointmentSlotSchema = new mongoose.Schema(
  {
    doctorId: { type: String, required: true, index: true },
    doctorName: { type: String, default: '' },
    departmentId: { type: String, default: '' },
    departmentName: { type: String, default: '' },
    // ISO date string "YYYY-MM-DD" (kept as string to match Appointment.date)
    date: { type: String, required: true, index: true },
    // Human readable window "10:00 AM - 10:30 AM" (matches Appointment.timeSlot)
    timeSlot: { type: String, required: true },
    // Consultation types this slot accepts
    appointmentTypes: {
      type: [String],
      default: ['In-person Consultation', 'General OPD', 'Follow-up Consultation']
    },
    capacity: { type: Number, default: 1, min: 1 },
    bookedCount: { type: Number, default: 0, min: 0 },
    isClosed: { type: Boolean, default: false },
    reason: { type: String, default: '' }
  },
  { timestamps: true }
);

// One slot record per doctor + date + time window
appointmentSlotSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: true });

// Virtual: remaining bookable seats
appointmentSlotSchema.virtual('remaining').get(function () {
  return Math.max(0, this.capacity - this.bookedCount);
});

appointmentSlotSchema.set('toJSON', { virtuals: true });
appointmentSlotSchema.set('toObject', { virtuals: true });

export const AppointmentSlot =
  mongoose.models.AppointmentSlot || mongoose.model('AppointmentSlot', appointmentSlotSchema);
export default AppointmentSlot;
