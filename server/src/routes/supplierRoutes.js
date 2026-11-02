import express from 'express';
import {
  getPurchaseOrders,
  createPurchaseOrder,
  updateOrderStatus
} from '../controllers/supplierController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/orders', verifyToken, getPurchaseOrders);
router.post('/orders', verifyToken, requireRole('admin', 'superadmin', 'pharmacist'), createPurchaseOrder);
router.put('/orders/:id/status', verifyToken, requireRole('admin', 'superadmin', 'supplier'), updateOrderStatus);

export default router;
