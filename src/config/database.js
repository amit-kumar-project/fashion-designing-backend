import mongoose from 'mongoose';
import config from './env.js';

const getConnectionOptions = () => {
  const baseOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4
  };

  if (config.env === 'production') {
    return {
      ...baseOptions,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority'
    };
  }

  return baseOptions;
};

export const connectDB = async () => {
  try {
    const uri = config.mongoUri;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(uri, getConnectionOptions());
    
    console.log('✅ Connected to MongoDB with Mongoose');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌍 Environment: ${config.env}`);
    
    return mongoose.connection.db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

export const getDB = () => {
  return mongoose.connection.db;
};

export const closeDB = async () => {
  await mongoose.connection.close();
};
