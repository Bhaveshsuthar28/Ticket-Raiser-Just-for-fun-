import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { connectDb } from '../src/config/db.js';
import { Admin } from '../src/models/Admin.js';

dotenv.config();

const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'admin123';

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Please set it in server/.env');
}

await connectDb(process.env.MONGODB_URI);

const passwordHash = await bcrypt.hash(password, 10);

const admin = await Admin.findOneAndUpdate(
  { username },
  { username, passwordHash },
  { upsert: true, new: true }
);

console.log(`Seeded admin: ${admin.username}`);
process.exit(0);
