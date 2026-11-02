import express from 'express';
import { getDoctors, getDoctorById, createDoctor, updateDoctor } from '../controllers/doctorController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', verifyToken, requireRole('admin', 'superadmin'), createDoctor);
router.put('/:id', verifyToken, requireRole('admin', 'superadmin', 'doctor'), updateDoctor);

export default router;
