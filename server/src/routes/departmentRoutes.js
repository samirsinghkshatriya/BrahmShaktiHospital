import express from 'express';
import { getDepartments, getDepartmentById, createDepartment, updateDepartment } from '../controllers/departmentController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.post('/', verifyToken, requireRole('admin', 'superadmin'), createDepartment);
router.put('/:id', verifyToken, requireRole('admin', 'superadmin'), updateDepartment);

export default router;
