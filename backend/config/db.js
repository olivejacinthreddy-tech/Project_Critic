import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
const fallbackDbFile = path.join(dataDir, 'projects.json');

// Ensure data directory and fallback JSON file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(fallbackDbFile)) {
  fs.writeFileSync(fallbackDbFile, JSON.stringify([], null, 2), 'utf-8');
}

export const dbState = {
  isConnected: false,
  isFallback: false,
  type: 'none',
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/critic_agent',
  message: 'Initializing database...'
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/critic_agent';
  dbState.uri = uri;

  try {
    // Attempt Mongoose connection with a short timeout so local startups don't hang if MongoDB is not installed
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });

    dbState.isConnected = true;
    dbState.isFallback = false;
    dbState.type = 'MongoDB';
    dbState.message = `Connected to MongoDB successfully: ${conn.connection.host}/${conn.connection.name}`;
    console.log(`[Database] ${dbState.message}`);
    return true;
  } catch (error) {
    dbState.isConnected = false;
    dbState.isFallback = true;
    dbState.type = 'File-Backed LocalStore';
    dbState.message = `MongoDB connection unavailable (${error.message}). Using persistent JSON database at: ${fallbackDbFile}`;
    console.warn(`[Database Warning] ${dbState.message}`);
    return false;
  }
};
