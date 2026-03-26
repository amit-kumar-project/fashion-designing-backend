import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variable or fallback to MongoDB Atlas
const uri = process.env.MONGODB_URI || 'mongodb+srv://kanish20229_db_user:mTcSHCxtFMvhacw9@cluster0.ymbkanw.mongodb.net/fashionDesignDB?retryWrites=true&w=majority';

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('✅ Connected to MongoDB with Mongoose');
    console.log(`📊 Database: ${mongoose.connection.name}`);
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
