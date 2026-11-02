import mongoose from 'mongoose';

const bloodDonationSchema = new mongoose.Schema(
  {
    donationId: {
      type: String,
      required: true,
      unique: true
    },
    donorName: {
      type: String,
      required: true
    },
    donorPhone: {
      type: String,
      required: true
    },
    donorAge: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true
    },
    unitsDonated: {
      type: Number,
      default: 1
    },
    donationDate: {
      type: String,
      required: true
    },
    certificateNo: {
      type: String,
      default: ''
    },
    screeningStatus: {
      type: String,
      enum: ['Passed', 'Pending', 'Deferred'],
      default: 'Passed'
    }
  },
  { timestamps: true }
);

export const BloodDonation =
  mongoose.models.BloodDonation || mongoose.model('BloodDonation', bloodDonationSchema);
export default BloodDonation;
