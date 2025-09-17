import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // MongoDB connection string - you can use local MongoDB or MongoDB Atlas
    const mongoURI = process.env.MONGODB_URI;

    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
