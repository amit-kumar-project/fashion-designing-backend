import express from 'express';
import config from './src/config/env.js';
import { connectDB } from './src/config/database.js';
import { setupMiddleware } from './src/middleware/index.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';
import { setupRoutes } from './src/routes/index.js';

const app = express();
const port = config.port;

// Setup middleware
setupMiddleware(app);

// Database connection and routes setup
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Setup routes
    setupRoutes(app);
    
    // Error handling middleware (must be after routes)
    app.use(notFound);
    app.use(errorHandler);
    
    // Start server
    app.listen(port, () => {
      console.log(`🚀 Fashion Design API Server running on port ${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/api`);
      console.log(`🏥 Health Check: http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();