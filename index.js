import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import { setupMiddleware } from './src/middleware/index.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';
import { setupRoutes } from './src/routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Setup middleware
setupMiddleware(app);

// Database connection and routes setup
const startServer = async () => {
  try {
    // Connect to database
    let db;
    try {
      db = await connectDB();
    } catch (mongoError) {
      console.log('MongoDB failed, using in-memory database');
      const { connectDB: connectMemoryDB } = await import('./src/config/memoryDB.js');
      db = await connectMemoryDB();
    }
    
    // Setup routes
    setupRoutes(app, db);
    
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