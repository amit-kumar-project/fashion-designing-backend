import { Router } from 'express';

export const createAuthRoutes = (authController) => {
  const router = Router();

  // POST /api/auth/signup - Create account
  router.post('/signup', authController.signup.bind(authController));

  // POST /api/auth/login - Login to account
  router.post('/login', authController.login.bind(authController));

  // POST /api/auth/forgot-password - Request password reset
  router.post('/forgot-password', authController.forgotPassword.bind(authController));

  // POST /api/auth/reset-password - Reset password
  router.post('/reset-password', authController.resetPassword.bind(authController));

  return router;
};
