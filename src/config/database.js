import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://kanish20229_db_user:mTcSHCxtFMvhacw9@cluster0.ymbkanw.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri);

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
