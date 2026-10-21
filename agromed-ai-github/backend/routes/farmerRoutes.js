import { Router } from 'express';
import { getFarmerProfile, updateFarmerProfile } from '../controllers/farmerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', authenticateToken, getFarmerProfile);
router.put('/profile', authenticateToken, updateFarmerProfile);

export default router;
