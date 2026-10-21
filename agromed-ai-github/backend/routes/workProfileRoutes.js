import { Router } from 'express';
import { getWorkProfile, saveWorkProfile } from '../controllers/workProfileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getWorkProfile);
router.post('/', authenticateToken, saveWorkProfile);
router.put('/', authenticateToken, saveWorkProfile);

export default router;
