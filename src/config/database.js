import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Use environment variable or fallback to a simple connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_app';

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
});

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  return client.db();
};

export const closeDB = async () => {
  await client.close();
};
