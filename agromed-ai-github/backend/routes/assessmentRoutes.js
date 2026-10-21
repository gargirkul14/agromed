import { Router } from 'express';
import { submitAssessment, getFarmerAssessments, getAssessmentById } from '../controllers/assessmentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, submitAssessment);
router.get('/', authenticateToken, getFarmerAssessments);
router.get('/:id', authenticateToken, getAssessmentById);

export default router;
