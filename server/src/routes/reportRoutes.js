import express from 'express';
import { getDashboardStats } from '../controllers/reportController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard-stats', verifyToken, requireRole('admin', 'superadmin'), getDashboardStats);

export default router;
