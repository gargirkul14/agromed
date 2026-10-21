import { Router } from 'express';
import { getPPERecommendations } from '../controllers/ppeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Optional auth so farmers get personal comparison, while public visitors can still view general PPE
router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateToken(req, res, next);
  }
  next();
}, getPPERecommendations);

export default router;
