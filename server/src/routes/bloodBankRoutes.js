import express from 'express';
import {
  getBloodInventory,
  updateBloodStock,
  getBloodRequests,
  createBloodRequest,
  updateBloodRequestStatus,
  getBloodDonations,
  recordBloodDonation
} from '../controllers/bloodBankController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public / Patient can view inventory & submit blood request or register donation
router.get('/inventory', getBloodInventory);
router.post('/requests', createBloodRequest);
router.post('/donations', recordBloodDonation);

// Admin / Healthcare staff access
router.put('/inventory', verifyToken, requireRole('admin', 'superadmin'), updateBloodStock);
router.get('/requests', verifyToken, getBloodRequests);
router.put('/requests/:id/status', verifyToken, requireRole('admin', 'superadmin'), updateBloodRequestStatus);
router.get('/donations', verifyToken, getBloodDonations);

export default router;
