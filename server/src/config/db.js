import mongoose from 'mongoose';

export async function connectDb(mongoUri = process.env.MONGODB_URI) {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('MongoDB connected');
  } catch (err) {
    const message =
      `Failed to connect to MongoDB at ${mongoUri}. ` +
      'Make sure MongoDB is running (or update MONGODB_URI in server/.env).';
    const wrapped = new Error(message);
    wrapped.cause = err;
    throw wrapped;
  }
}
