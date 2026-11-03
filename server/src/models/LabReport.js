import mongoose from 'mongoose';

const labParameterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String, default: '' },
    normalRange: { type: String, default: '' },
    flag: { type: String, enum: ['Normal', 'Abnormal', 'Critical'], default: 'Normal' }
  },
  { _id: false }
);

const labReportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true },
    uhid: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, default: '' },
    departmentName: { type: String, default: '' },
    testName: { type: String, required: true },
    category: { type: String, default: 'Biochemistry' },
    sampleType: { type: String, default: 'Blood' },
    orderedDate: { type: String, required: true },
    collectedDate: { type: String, default: '' },
    resultDate: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Sample Collected', 'Result Ready'],
      default: 'Pending'
    },
    price: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    parameters: [labParameterSchema]
  },
  { timestamps: true }
);

export const LabReport = mongoose.models.LabReport || mongoose.model('LabReport', labReportSchema);
export default LabReport;
