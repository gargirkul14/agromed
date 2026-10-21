import { Router } from 'express';
import {
  requestRegistrationOtp,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Registration OTP flow
router.post('/register/request-otp', requestRegistrationOtp);
router.post('/register/verify-otp', verifyRegistrationOtp);
router.post('/register/resend-otp', resendRegistrationOtp);

// Direct registration bypass guard
router.post('/register', register);

// Login and profile
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
