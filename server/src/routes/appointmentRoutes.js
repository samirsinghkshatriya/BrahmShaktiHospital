import express from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Allow public or authenticated appointment booking
router.post('/', createAppointment);
// Get appointments (role filtered if token present, or open for authorized users)
router.get('/', verifyToken, getAppointments);
router.get('/:id', verifyToken, getAppointmentById);
router.put('/:id', verifyToken, updateAppointmentStatus);

export default router;
