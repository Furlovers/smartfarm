import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Database connected');
  } catch (err) {
    console.error('Failed to connect to database: ', err.message);
    process.exit(1);
  }
};
