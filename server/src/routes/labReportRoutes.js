import express from 'express';
import { getPatientLabReports, getLabReportById } from '../controllers/labReportController.js';

const router = express.Router();

// Public lab report retrieval - verified by UHID + registered mobile number
router.get('/', getPatientLabReports);
router.get('/:reportId', getLabReportById);

export default router;
