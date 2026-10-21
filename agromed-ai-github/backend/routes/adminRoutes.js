import { Router } from 'express';
import {
  getAdminDashboardStats,
  getAllFarmers,
  getAllAssessments,
  createArticle,
  updateArticle,
  deleteArticle,
  createChemical,
  updateChemical,
  deleteChemical
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// Protect all admin endpoints with JWT and ADMIN role check
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/dashboard', getAdminDashboardStats);

// Farmer Management
router.get('/farmers', getAllFarmers);

// Health Assessment Auditing
router.get('/assessments', getAllAssessments);

// Safety Articles CRUD
router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

// Chemical Safety CRUD
router.post('/chemicals', createChemical);
router.put('/chemicals/:id', updateChemical);
router.delete('/chemicals/:id', deleteChemical);

export default router;
