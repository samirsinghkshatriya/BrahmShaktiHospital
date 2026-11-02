import express from 'express';
import { getPatients, getPatientById, createPatient, updatePatient } from '../controllers/patientController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getPatients);
router.get('/:id', verifyToken, getPatientById);
router.post('/', verifyToken, requireRole('admin', 'superadmin', 'receptionist'), createPatient);
router.put('/:id', verifyToken, requireRole('admin', 'superadmin', 'receptionist', 'doctor'), updatePatient);

export default router;
