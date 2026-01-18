import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    visitorKey: { type: String, required: true, index: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    resolvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
