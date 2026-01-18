import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { Admin } from '../models/Admin.js';
import { Ticket } from '../models/Ticket.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const admin = await Admin.findOne({ username: parsed.data.username });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { username: admin.username },
      process.env.JWT_SECRET,
      { subject: admin._id.toString(), expiresIn: '7d' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    next(err);
  }
});

// Admin: list all tickets
router.get('/tickets', requireAdmin, async (req, res, next) => {
  try {
    const tickets = await Ticket.find({}).sort({ createdAt: -1 }).lean();
    res.json(tickets);
  } catch (err) {
    next(err);
  }
});

// Admin: resolve ticket
router.patch('/tickets/:id/resolve', requireAdmin, async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    ticket.status = 'resolved';
    ticket.resolvedAt = new Date();
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

// Admin: delete ticket
router.delete('/tickets/:id', requireAdmin, async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    await Ticket.deleteOne({ _id: ticket._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
