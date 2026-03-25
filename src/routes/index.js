import { Router } from 'express';
import { createUserRoutes } from './userRoutes.js';
import { createDesignRoutes } from './designRoutes.js';
import { createAuthRoutes } from './authRoutes.js';
import { UserController } from '../controllers/userController.js';
import { DesignController } from '../controllers/designController.js';
import { AuthController } from '../controllers/authController.js';

export const setupRoutes = (app, db) => {
  const router = Router();
  
  // Initialize controllers (Mongoose handles connection)
  const userController = new UserController();
  const designController = new DesignController();
  const authController = new AuthController();
  
  // API routes
  router.use('/auth', createAuthRoutes(authController));
  router.use('/users', createUserRoutes(userController));
  router.use('/designs', createDesignRoutes(designController));
  
  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString()
    });
  });
  
  // API info endpoint
  router.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Fashion Design App API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        designs: '/api/designs',
        health: '/api/health'
      }
    });
  });
  
  // Mount API routes
  app.use('/api', router);
};
