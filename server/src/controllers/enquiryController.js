import { Enquiry } from '../models/Enquiry.js';
import { isMongoConnected } from '../config/db.js';

// In-memory store for demonstration requests if MongoDB is offline
const demonstrationEnquiries = [];

export const createEnquiry = async (req, res, next) => {
  try {
    const {
      type = 'appointment_consultation',
      fullName,
      phone,
      email,
      department,
      doctorName,
      preferredDate,
      country = 'India',
      message
    } = req.body;

    // Validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient or contact full name.'
      });
    }

    if (!phone || !phone.trim() || phone.replace(/\D/g, '').length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contact telephone number.'
      });
    }

    const referenceNumber = `SGRH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const enquiryPayload = {
      type,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      department: department || 'General Medicine',
      doctorName: doctorName || 'Attending Specialist',
      preferredDate: preferredDate || 'Earliest Available',
      country,
      message: message ? message.trim() : '',
      referenceNumber,
      status: 'received',
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected) {
      try {
        const saved = await Enquiry.create(enquiryPayload);
        return res.status(201).json({
          success: true,
          message: 'Enquiry received by hospital coordination desk.',
          referenceNumber,
          source: 'mongodb',
          data: {
            referenceNumber: saved.referenceNumber,
            fullName: saved.fullName,
            type: saved.type,
            status: saved.status,
            createdAt: saved.createdAt
          }
        });
      } catch (err) {
        console.error('[Enquiry] MongoDB save error, falling back to memory store:', err.message);
      }
    }

    // Memory store fallback
    demonstrationEnquiries.unshift(enquiryPayload);
    if (demonstrationEnquiries.length > 50) demonstrationEnquiries.pop();

    return res.status(201).json({
      success: true,
      message: 'Consultation request logged with SGRH Patient Services.',
      referenceNumber,
      source: 'demonstration_buffer',
      data: {
        referenceNumber,
        fullName: enquiryPayload.fullName,
        type: enquiryPayload.type,
        status: enquiryPayload.status,
        createdAt: enquiryPayload.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
