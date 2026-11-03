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
    dateOfBirth: {
      type: String,
      default: ''
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
    email: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown'
    },
    previousDonations: {
      type: String,
      default: ''
    },
    preferredDonationDate: {
      type: String,
      default: ''
    },
    // Donor-declared medical eligibility responses. These are informational
    // only — they NEVER auto-declare a donor eligible. Final eligibility is
    // determined exclusively by qualified blood bank personnel.
    eligibilityAnswers: [
      {
        question: String,
        answer: String
      }
    ],
    consentGiven: {
      type: Boolean,
      default: false
    },
    // Donation application lifecycle (public submission -> staff review)
    applicationStatus: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Scheduled', 'Eligible', 'Deferred', 'Collected', 'Rejected'],
      default: 'Submitted'
    },
    scheduledDonationDate: {
      type: String,
      default: ''
    },
    unitsDonated: {
      type: Number,
      default: 1
    },
    donationDate: {
      type: String,
      default: ''
    },
    certificateNo: {
      type: String,
      default: ''
    },
    // Staff-determined screening result. Defaults to Pending — never auto-passed.
    screeningStatus: {
      type: String,
      enum: ['Pending', 'Passed', 'Deferred'],
      default: 'Pending'
    },
    screenedBy: {
      type: String,
      default: ''
    },
    batchNo: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const BloodDonation =
  mongoose.models.BloodDonation || mongoose.model('BloodDonation', bloodDonationSchema);
export default BloodDonation;
