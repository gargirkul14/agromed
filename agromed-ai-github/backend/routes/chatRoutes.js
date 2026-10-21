import { Router } from 'express';
import { askChatbot, getChatHistory, clearChatHistory } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, askChatbot);
router.get('/history', authenticateToken, getChatHistory);
router.delete('/history', authenticateToken, clearChatHistory);

export default router;
