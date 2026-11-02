import express from 'express';
import {
  getPharmacyProducts,
  getPharmacyProductById,
  createPharmacyProduct,
  updatePharmacyProduct,
  recordDispenseSale,
  getPharmacyAlerts
} from '../controllers/pharmacyController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', getPharmacyProducts);
router.get('/products/:id', getPharmacyProductById);
router.get('/alerts', verifyToken, getPharmacyAlerts);

router.post('/products', verifyToken, requireRole('admin', 'superadmin', 'pharmacist'), createPharmacyProduct);
router.put('/products/:id', verifyToken, requireRole('admin', 'superadmin', 'pharmacist'), updatePharmacyProduct);
router.post('/dispense', verifyToken, requireRole('admin', 'superadmin', 'pharmacist'), recordDispenseSale);

export default router;
