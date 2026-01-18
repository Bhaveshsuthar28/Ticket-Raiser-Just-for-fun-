import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDb } from './config/db.js';
import { notFoundHandler, errorHandler } from './middleware/errors.js';

import ticketsRouter from './routes/tickets.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, date: new Date().toISOString() });
});

app.use('/api/tickets', ticketsRouter);
app.use('/api/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5000;

await connectDb(process.env.MONGODB_URI);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
