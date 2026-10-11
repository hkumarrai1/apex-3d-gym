import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    phone: {
      type: String,
      default: '8889990012',
      trim: true,
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'expired', 'trial', 'pending'],
      default: 'active',
    },
    membershipPlan: {
      type: String,
      default: 'Pro Performance 3-Month',
    },
    membershipStartDate: {
      type: Date,
      default: Date.now,
    },
    membershipExpiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    },
    assignedCoach: {
      type: String,
      default: 'Amrit Dwivedi',
    },
    checkInsCount: {
      type: Number,
      default: 0,
    },
    prStats: {
      benchPress: { type: Number, default: 70 },
      squats: { type: Number, default: 90 },
      bodyWeight: { type: Number, default: 70 },
    },
    notificationHistory: [
      {
        message: String,
        channel: { type: String, default: 'whatsapp' },
        status: String,
        sentAt: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate days remaining virtual
userSchema.virtual('daysRemaining').get(function () {
  if (!this.membershipExpiryDate) return 0;
  const diffTime = this.membershipExpiryDate.getTime() - Date.now();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Ensure virtuals are included in toJSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const User = mongoose.model('User', userSchema, 'gymUsers');
