import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    trainerName: {
      type: String,
      required: true,
      default: 'Amrit Dwivedi',
    },
    memberName: {
      type: String,
      default: 'Gym Member',
    },
    userPhone: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
      default: '08:00 AM',
    },
    goal: {
      type: String,
      default: 'Hypertrophy & Form Check',
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model('Booking', bookingSchema, 'gymTrainerBookings');
