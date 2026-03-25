import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variable or fallback to MongoDB Atlas
const uri = process.env.MONGODB_URI || 'mongodb+srv://kanish20229_db_user:mTcSHCxtFMvhacw9@cluster0.ymbkanw.mongodb.net/fashion_app?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    console.log('Connected to MongoDB with Mongoose');
    return mongoose.connection.db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const getDB = () => {
  return mongoose.connection.db;
};

export const closeDB = async () => {
  await mongoose.connection.close();
};
