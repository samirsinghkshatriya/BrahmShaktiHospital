import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    qualification: { type: String, required: true },
    designation: { type: String, required: true },
    departmentId: { type: String, required: true },
    departmentName: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    specializations: [{ type: String }],
    consultationFee: { type: Number, default: 800 },
    availableDays: [{ type: String }],
    availableTimings: { type: String, default: '09:00 AM - 02:00 PM' },
    opdSchedule: { type: String, required: true },
    room: { type: String, default: 'OPD Chamber' },
    languages: [{ type: String }],
    birthdate: { type: String, default: '' },
    image: { type: String },
    bio: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 }
  },
  { timestamps: true }
);

export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;
