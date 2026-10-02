import mongoose from 'mongoose';

const trialPassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: '3 Days',
    },
    status: {
      type: String,
      enum: ['ACTIVE_PASS', 'USED', 'EXPIRED'],
      default: 'ACTIVE_PASS',
    },
    passCode: {
      type: String,
      default: () => `VIP-${Math.floor(100000 + Math.random() * 900000)}`,
    },
  },
  {
    timestamps: true,
  }
);

export const TrialPass = mongoose.model('TrialPass', trialPassSchema, 'gymTrialPasses');
