import { Router } from 'express';
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import { requireBodyFields } from '../middleware/validateRequest.js';

const router = Router();

// POST /api/auth/signup - Create account
router.post('/signup', requireBodyFields(['name', 'email', 'phoneNumber', 'password', 'confirmPassword']), signup);

// POST /api/auth/login - Login to account
router.post('/login', requireBodyFields(['email', 'password']), login);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', requireBodyFields(['email']), forgotPassword);

// POST /api/auth/reset-password - Reset password
router.post('/reset-password', requireBodyFields(['email', 'newPassword', 'confirmPassword']), resetPassword);

export default router;
