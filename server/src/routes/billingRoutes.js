import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoicePayment
} from '../controllers/billingController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/invoices', verifyToken, getInvoices);
router.get('/invoices/:id', verifyToken, getInvoiceById);
router.post('/invoices', verifyToken, requireRole('admin', 'superadmin', 'receptionist', 'pharmacist'), createInvoice);
router.put('/invoices/:id/payment', verifyToken, requireRole('admin', 'superadmin', 'receptionist'), updateInvoicePayment);

export default router;
