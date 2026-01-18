import express from 'express';
import { z } from 'zod';
import { Ticket } from '../models/Ticket.js';

const router = express.Router();

function getVisitorKey(req) {
  return (req.headers['x-visitor-key'] || '').toString().trim();
}

const createTicketSchema = z.object({
  name: z.string().min(1).max(80),
  message: z.string().min(1).max(2000)
});

// Visitor: create ticket (allowed)
router.post('/', async (req, res, next) => {
  try {
    const visitorKey = getVisitorKey(req);
    if (!visitorKey) return res.status(400).json({ error: 'Missing x-visitor-key' });

    const parsed = createTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid input' });
    }

    const ticket = await Ticket.create({
      name: parsed.data.name,
      message: parsed.data.message,
      visitorKey
    });

    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
});

// Visitor: listing and deletion are intentionally disabled.

export default router;
