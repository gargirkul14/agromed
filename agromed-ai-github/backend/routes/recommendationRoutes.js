import { Router } from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getRecommendations);

export default router;
