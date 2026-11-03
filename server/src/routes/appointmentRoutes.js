import express from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
  getAvailableSlots
} from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public: check real doctor availability for a date (DB-backed slots)
router.get('/slots', getAvailableSlots);

// Public / Patient can book an appointment (atomic, double-booking safe)
router.post('/', createAppointment);

// Listing requires authentication and is role-scoped inside the controller
router.get('/', verifyToken, getAppointments);
router.get('/:id', verifyToken, getAppointmentById);

// Status changes / cancellation / rescheduling require authentication
router.put('/:id', verifyToken, updateAppointmentStatus);
router.put('/:id/cancel', verifyToken, cancelAppointment);
router.put('/:id/reschedule', verifyToken, rescheduleAppointment);

export default router;
