import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
