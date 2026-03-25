import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import designRoutes from './designRoutes.js';

export const setupRoutes = (app) => {
  const router = Router();
  
  // API routes
  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/designs', designRoutes);
  
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
