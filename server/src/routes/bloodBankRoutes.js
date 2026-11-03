import express from 'express';
import {
  getBloodInventory,
  getBloodInventoryAdmin,
  updateBloodStock,
  addInventoryUnits,
  issueBloodUnits,
  getInventoryTransactions,
  getLowStockAlerts,
  getBloodRequests,
  createBloodRequest,
  updateBloodRequestStatus,
  getBloodDonations,
  submitDonationApplication,
  updateDonationApplicationStatus,
  recordDonationCollection,
  recordBloodDonation
} from '../controllers/bloodBankController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const BLOOD_STAFF = ['admin', 'superadmin', 'blood_bank_technician'];

// ---- Public: availability, donate application, request submission ----
router.get('/inventory', getBloodInventory);
router.post('/requests', createBloodRequest);
router.post('/donation-applications', submitDonationApplication);

// ---- Authorized blood bank personnel ----
router.get('/inventory/admin', verifyToken, requireRole(...BLOOD_STAFF), getBloodInventoryAdmin);
router.get('/inventory/transactions', verifyToken, requireRole(...BLOOD_STAFF), getInventoryTransactions);
router.get('/alerts/low-stock', verifyToken, requireRole(...BLOOD_STAFF), getLowStockAlerts);
router.put('/inventory', verifyToken, requireRole(...BLOOD_STAFF), updateBloodStock);
router.post('/inventory/add', verifyToken, requireRole(...BLOOD_STAFF), addInventoryUnits);
router.post('/inventory/issue', verifyToken, requireRole(...BLOOD_STAFF), issueBloodUnits);

router.get('/requests', verifyToken, requireRole(...BLOOD_STAFF), getBloodRequests);
router.put('/requests/:id/status', verifyToken, requireRole(...BLOOD_STAFF), updateBloodRequestStatus);

router.get('/donations', verifyToken, requireRole(...BLOOD_STAFF), getBloodDonations);
router.put('/donations/:id/status', verifyToken, requireRole(...BLOOD_STAFF), updateDonationApplicationStatus);
router.post('/donations/collect', verifyToken, requireRole(...BLOOD_STAFF), recordDonationCollection);
// Legacy manual donation entry (admin/superadmin only)
router.post('/donations', verifyToken, requireRole(...BLOOD_STAFF), recordBloodDonation);

export default router;
