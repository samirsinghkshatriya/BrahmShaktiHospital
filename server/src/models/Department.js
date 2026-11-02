import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, default: 'Stethoscope' },
    image: { type: String, default: '' },
    shortDescription: { type: String, required: true },
    description: { type: String, default: '' },
    headOfDepartment: { type: String },
    features: [{ type: String }],
    services: [{ type: String }],
    opdTimings: { type: String, default: 'Mon - Sat: 09:00 AM - 05:00 PM' },
    consultationCharges: { type: Number, default: 800 },
    floorLocation: { type: String, default: 'Main Hospital Building' },
    emergencyAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
export default Department;
