import { Router } from 'express';
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = Router();

// POST /api/auth/signup - Create account
router.post('/signup', signup);

// POST /api/auth/login - Login to account
router.post('/login', login);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password - Reset password
router.post('/reset-password', resetPassword);

export default router;
