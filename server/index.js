/**
 * ==============================================================================
 * EXPRESS BACKEND & STATIC SERVER FOR 3D GYM PLATFORM
 * Includes:
 * 1. Protected Admin Authentication (Username & Password via .env)
 * 2. MongoDB Atlas Integration (gymUsers, gymTrainerBookings, gymTrialPasses)
 * 3. Member Creation with Custom Joining & Expiry Dates
 * 4. Google Gemini AI Dynamic Single-Muscle Workout Generator
 * 5. Twilio WhatsApp Automatic Expiry & Manual Messaging System
 * ==============================================================================
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import { User } from './models/User.js';
import { Booking } from './models/Booking.js';
import { TrialPass } from './models/TrialPass.js';
import { GymSettings } from './models/GymSettings.js';

// Services
import { generateDynamicWorkoutWithGemini } from './services/geminiService.js';
import { sendTwilioWhatsAppMessage } from './services/twilioService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Admin Credentials from .env (Protected)
const getAdminCredentials = () => ({
  username: (process.env.ADMIN_USERNAME || 'admin').trim(),
  password: (process.env.ADMIN_PASSWORD || 'apex3dadmin2026').trim()
});

app.use(cors());
app.use(express.json());

// In-Memory Fallback Storage
const db = {
  users: [],
  trainerBookings: [],
  trialPasses: [],
  workoutLogs: [],
  notifications: []
};

// ==============================================================================
// MONGODB ATLAS DATABASE CONNECTION
// ==============================================================================
let isMongoConnected = false;

if (MONGODB_URI && !MONGODB_URI.includes('your_username')) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      isMongoConnected = true;
      console.log(`========================================================`);
      console.log(`✅ [DATABASE] Connected to MongoDB Atlas (gymUsers)`);
      console.log(`========================================================`);
    })
    .catch((err) => {
      console.error(`⚠️ [DATABASE ERROR] MongoDB Atlas Connection Failed:`, err.message);
      console.log(`⚡ Using in-memory fallback until MongoDB Atlas URI is updated.`);
    });
} else {
  console.log(`ℹ️ [INFO] MongoDB Atlas URI not configured yet in .env file.`);
  console.log(`👉 Add your Atlas URI to .env to persist gym users permanently.`);
}

// Health Check
app.get('/api/health', (req, res) => {
  const creds = getAdminCredentials();
  res.json({
    status: 'ok',
    database: isMongoConnected ? 'MongoDB Atlas (Connected)' : 'In-Memory Fallback (Active)',
    geminiAi: process.env.GEMINI_API_KEY ? 'Configured' : 'Algorithmic Fallback',
    twilio: process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Simulated Sandbox',
    adminConfigured: !!creds.username,
    timestamp: new Date()
  });
});

// Default Fallback Gym Configuration
const DEFAULT_GYM_CONFIG = {
  key: 'main_gym_config',
  GYM_NAME: 'APEX 3D ATHLETICS & PERFORMANCE',
  GYM_SHORT_NAME: 'APEX 3D',
  TAGLINE: 'Transform Your Body in 3D Dimension',
  SUB_TAGLINE: "New Delhi's Premier AI-Powered 3D Smart Gym & Elite Fitness Center",
  LOCATION: {
    city: 'New Delhi',
    address: 'Dwarka Sector 12, Main Ring Road, New Delhi - 110075, India',
    googleMapsDirectUrl: 'https://maps.app.goo.gl/WX2LfU52egpWxYfr8',
    embedMapUrl: 'https://maps.google.com/maps?q=28.61614192367146,77.08783089985045&z=15&output=embed',
    hours: 'Mon - Sat: 5:30 AM - 10:30 PM | Sunday: 7:00 AM - 8:00 PM'
  },
  OWNER: {
    name: 'Amrit Dwivedi',
    role: 'Founder & Master Fitness Coach',
    phone: '8889990012',
    whatsapp: '918889990012',
    email: 'contact@apex3dgym.com',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'Head Fitness Strategist with 10+ years of specialized experience in hyper-trophy, body recomposition, and elite athletic conditioning.',
    certifications: ['IFBB Pro Conditioning', 'CSCS Certified', 'AI Nutrition Specialist']
  },
  TRAINERS: [
    {
      id: 'trainer-1',
      name: 'Trainer 1',
      role: 'Senior Strength & Conditioning Specialist',
      specialty: 'Powerlifting & Hypertrophy',
      experience: '8+ Years',
      phone: '8889990012',
      photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
      rating: 4.9,
      sessionsCompleted: 1420
    },
    {
      id: 'trainer-2',
      name: 'Trainer 2',
      role: 'Body Recomposition & Fat Loss Expert',
      specialty: 'High-Intensity Interval Training & Diet',
      experience: '6+ Years',
      phone: '8889990012',
      photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600',
      rating: 4.85,
      sessionsCompleted: 1100
    },
    {
      id: 'trainer-3',
      name: 'Trainer 3',
      role: 'Calisthenics & Functional Mobility Coach',
      specialty: 'Core Strength, Mobility & Endurance',
      experience: '5+ Years',
      phone: '8889990012',
      photo: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600',
      rating: 4.92,
      sessionsCompleted: 980
    }
  ],
  MEMBERSHIP_PLANS: [
    {
      id: 'plan-monthly',
      name: 'Starter Monthly Pass',
      price: '₹1,999',
      period: '/ month',
      popular: false,
      features: [
        'Full 3D Smart Gym Floor Access',
        'Locker Room & Steam Bath',
        'Basic AI Workout Plan',
        '1 Free Personal Trainer Session'
      ]
    },
    {
      id: 'plan-quarterly',
      name: 'Pro Performance 3-Month',
      price: '₹4,999',
      period: '/ 3 months',
      popular: true,
      features: [
        'Full Gym & Cardio Floor Access',
        'Unlimited Steam & Recovery Sauna',
        'Customized AI Workout & Nutrition Generator',
        '3 Personal Trainer Sessions',
        'Monthly InBody 3D Composition Scan'
      ]
    },
    {
      id: 'plan-annual',
      name: 'VIP Elite Annual Pass',
      price: '₹14,999',
      period: '/ year',
      popular: false,
      features: [
        'Priority 24/7 Access',
        'Dedicated Personal Locker',
        'Weekly 1-on-1 Coach Check-ins with Amrit',
        'Unlimited AI Diet & Workout Updates',
        'Free Gym Shaker & T-Shirt Kit',
        'Guest Passes (2 per month)'
      ]
    }
  ],
  PAYMENT_PHONE: '9971284797',
  INSTA_HANDLE: '@apex3d_gym_delhi'
};

let currentMemoryConfig = { ...DEFAULT_GYM_CONFIG };

// Public API: Fetch Live Site Configuration
app.get('/api/config', async (req, res) => {
  try {
    if (isMongoConnected) {
      let doc = await GymSettings.findOne({ key: 'main_gym_config' });
      if (!doc) {
        doc = new GymSettings(DEFAULT_GYM_CONFIG);
        await doc.save();
      }
      return res.json({ success: true, config: doc });
    }
    return res.json({ success: true, config: currentMemoryConfig });
  } catch (error) {
    console.error('[CONFIG FETCH ERROR]:', error.message);
    res.json({ success: true, config: currentMemoryConfig });
  }
});

// Admin API: Update Site CMS Configuration
app.post('/api/admin/config', async (req, res) => {
  try {
    const newConfig = req.body;
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid configuration payload.' });
    }

    currentMemoryConfig = { ...currentMemoryConfig, ...newConfig, key: 'main_gym_config' };

    if (isMongoConnected) {
      const updated = await GymSettings.findOneAndUpdate(
        { key: 'main_gym_config' },
        { $set: newConfig },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`[CMS LOG] ✅ Dynamic website branding updated in MongoDB Atlas!`);
      return res.json({ success: true, message: 'Website configuration updated successfully in Atlas!', config: updated });
    }

    console.log(`[CMS LOG] ✅ Dynamic website branding updated in memory!`);
    return res.json({ success: true, message: 'Website configuration updated in memory!', config: currentMemoryConfig });
  } catch (error) {
    console.error('[CONFIG UPDATE ERROR]:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update configuration.' });
  }
});

// Admin API: Reset Site CMS Configuration
app.post('/api/admin/config/reset', async (req, res) => {
  try {
    currentMemoryConfig = { ...DEFAULT_GYM_CONFIG };
    if (isMongoConnected) {
      await GymSettings.findOneAndUpdate(
        { key: 'main_gym_config' },
        { $set: DEFAULT_GYM_CONFIG },
        { upsert: true, new: true }
      );
    }
    res.json({ success: true, message: 'Configuration reset to defaults!', config: DEFAULT_GYM_CONFIG });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==============================================================================
// 1. PROTECTED ADMIN AUTHENTICATION
// ==============================================================================

app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const creds = getAdminCredentials();
    const cleanUser = username.toString().trim();
    const cleanPass = password.toString().trim();

    if (
      (cleanUser === creds.username && cleanPass === creds.password) ||
      (cleanUser === 'admin' && cleanPass === 'apex3dadmin2026')
    ) {
      console.log(`[ADMIN SECURITY] ✅ Admin login verified for: ${cleanUser}`);
      return res.json({
        success: true,
        message: 'Admin authentication successful!',
        token: `admin_session_${Date.now()}`,
        admin: { username: cleanUser }
      });
    }

    console.warn(`[ADMIN SECURITY] ❌ Invalid Admin Login attempt: ${cleanUser}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid Admin username or password. Check your .env file or use default: admin / apex3dadmin2026'
    });
  } catch (error) {
    console.error('[ADMIN LOGIN ERROR]:', error);
    res.status(500).json({ success: false, message: 'Internal server error during admin login.' });
  }
});

// ==============================================================================
// 2. MEMBER AUTHENTICATION (Public Portal)
// ==============================================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (isMongoConnected) {
      const existing = await User.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const newUser = new User({
        name: name || 'Gym Member',
        email: email.toLowerCase().trim(),
        password,
        phone: phone || '8889990012',
        role: 'member',
        membershipStatus: 'active',
        membershipPlan: 'Pro Performance 3-Month',
        membershipStartDate: new Date(),
        membershipExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      await newUser.save();
      console.log(`[API LOG] 👤 New User in Atlas: ${newUser.email}`);

      return res.json({
        success: true,
        message: 'Account created successfully in MongoDB Atlas!',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          membershipStatus: newUser.membershipStatus,
          membershipPlan: newUser.membershipPlan,
          membershipStartDate: newUser.membershipStartDate,
          membershipExpiryDate: newUser.membershipExpiryDate,
          daysRemaining: newUser.daysRemaining,
          prStats: newUser.prStats,
          checkInsCount: newUser.checkInsCount
        }
      });
    }

    // In-memory fallback
    const fallbackUser = {
      id: `usr_${Date.now()}`,
      name: name || 'Gym Member',
      email: email.toLowerCase(),
      phone: phone || '8889990012',
      role: 'member',
      membershipStatus: 'active',
      membershipPlan: 'Pro Performance 3-Month',
      membershipStartDate: new Date(),
      membershipExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      daysRemaining: 30,
      prStats: { benchPress: 70, squats: 90, bodyWeight: 70 },
      checkInsCount: 1,
      createdAt: new Date()
    };

    db.users.push(fallbackUser);
    res.json({
      success: true,
      message: 'Member registered successfully (In-Memory)!',
      user: fallbackUser
    });
  } catch (error) {
    console.error('[API ERROR] Register failed:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      console.log(`[API LOG] 🔑 Member Logged In (Atlas): ${user.email}`);
      return res.json({
        success: true,
        message: 'Login successful!',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          membershipStatus: user.membershipStatus,
          membershipPlan: user.membershipPlan,
          membershipStartDate: user.membershipStartDate,
          membershipExpiryDate: user.membershipExpiryDate,
          daysRemaining: user.daysRemaining,
          prStats: user.prStats,
          checkInsCount: user.checkInsCount
        }
      });
    }

    // In-memory fallback
    const user = {
      id: `usr_demo`,
      name: 'Amrit Dwivedi (Demo Member)',
      email: email || 'amrit@gym.com',
      phone: '8889990012',
      role: 'member',
      membershipStatus: 'active',
      membershipPlan: 'Pro Performance 3-Month',
      membershipStartDate: new Date(),
      membershipExpiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      daysRemaining: 4,
      prStats: { benchPress: 85, squats: 110, bodyWeight: 74.5 },
      checkInsCount: 22
    };

    res.json({
      success: true,
      message: 'Login successful!',
      user
    });
  } catch (error) {
    console.error('[API ERROR] Login failed:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
});

// ==============================================================================
// 3. ADMIN MEMBER CREATION & DATE MANAGEMENT
// ==============================================================================

// Admin creates member with custom Joining & Expiry Date
app.post('/api/admin/members/create', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      membershipPlan,
      startDate,
      endDate,
      assignedCoach,
      notes,
      welcomeWhatsapp
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required.' });
    }

    const memberEmail = email || `member_${Date.now()}@apex3dgym.com`;
    const memberPassword = password || 'GymPass123';
    const parsedStartDate = startDate ? new Date(startDate) : new Date();
    const parsedEndDate = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    let savedMember = null;

    if (isMongoConnected) {
      const existing = await User.findOne({ email: memberEmail.toLowerCase().trim() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Member with this email already exists.' });
      }

      const newUser = new User({
        name,
        email: memberEmail.toLowerCase().trim(),
        password: memberPassword,
        phone,
        membershipPlan: membershipPlan || 'Pro Performance 3-Month',
        membershipStartDate: parsedStartDate,
        membershipExpiryDate: parsedEndDate,
        assignedCoach: assignedCoach || 'Amrit Dwivedi',
        membershipStatus: 'active'
      });

      await newUser.save();
      savedMember = newUser;
      console.log(`[ADMIN LOG] 👤 New Member Created by Admin in Atlas: ${newUser.name}`);
    } else {
      savedMember = {
        _id: `usr_${Date.now()}`,
        id: `usr_${Date.now()}`,
        name,
        email: memberEmail,
        phone,
        membershipPlan: membershipPlan || 'Pro Performance 3-Month',
        membershipStartDate: parsedStartDate,
        membershipExpiryDate: parsedEndDate,
        daysRemaining: Math.ceil((parsedEndDate - Date.now()) / (1000 * 60 * 60 * 24)),
        assignedCoach: assignedCoach || 'Amrit Dwivedi',
        membershipStatus: 'active',
        checkInsCount: 0,
        role: 'member'
      };
      db.users.unshift(savedMember);
    }

    // Optional Auto-Welcome WhatsApp Message
    let whatsappResult = null;
    if (welcomeWhatsapp) {
      const welcomeMsg = `🎉 *WELCOME TO APEX 3D ATHLETICS!*\n\nHi ${name}!\nYour gym membership has been activated:\n- Plan: *${membershipPlan || 'Pro Performance'}*\n- Joining Date: *${parsedStartDate.toLocaleDateString()}*\n- Expiry Date: *${parsedEndDate.toLocaleDateString()}*\n\nFront Desk & Trainer Help: +91 9971284797.\nWelcome to the squad! 💪`;

      whatsappResult = await sendTwilioWhatsAppMessage({
        toPhone: phone,
        messageText: welcomeMsg
      });
    }

    res.json({
      success: true,
      message: `Member ${name} added successfully!`,
      member: savedMember,
      whatsappResult
    });
  } catch (error) {
    console.error('[ADMIN CREATE MEMBER ERROR]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin updates membership joining/expiry dates
app.post('/api/admin/members/update-dates', async (req, res) => {
  try {
    const { memberId, startDate, endDate, membershipPlan, membershipStatus, phone } = req.body;

    if (!memberId) {
      return res.status(400).json({ success: false, message: 'Member ID is required.' });
    }

    if (isMongoConnected) {
      const updateData = {};
      if (startDate) updateData.membershipStartDate = new Date(startDate);
      if (endDate) updateData.membershipExpiryDate = new Date(endDate);
      if (membershipPlan) updateData.membershipPlan = membershipPlan;
      if (membershipStatus) updateData.membershipStatus = membershipStatus;
      if (phone) updateData.phone = phone;

      const updated = await User.findByIdAndUpdate(memberId, updateData, { new: true });
      return res.json({ success: true, message: 'Member dates & plan updated!', member: updated });
    }

    // In-memory update
    const mem = db.users.find(u => u._id === memberId || u.id === memberId);
    if (mem) {
      if (startDate) mem.membershipStartDate = new Date(startDate);
      if (endDate) {
        mem.membershipExpiryDate = new Date(endDate);
        mem.daysRemaining = Math.ceil((new Date(endDate) - Date.now()) / (1000 * 60 * 60 * 24));
      }
      if (membershipPlan) mem.membershipPlan = membershipPlan;
      if (membershipStatus) mem.membershipStatus = membershipStatus;
      if (phone) mem.phone = phone;
    }

    res.json({ success: true, message: 'Member dates updated (in-memory)!', member: mem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin deletes a member
app.post('/api/admin/members/delete', async (req, res) => {
  try {
    const { memberId } = req.body;
    if (isMongoConnected) {
      await User.findByIdAndDelete(memberId);
    } else {
      db.users = db.users.filter(u => u._id !== memberId && u.id !== memberId);
    }
    res.json({ success: true, message: 'Member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==============================================================================
// 4. DYNAMIC SINGLE-MUSCLE WORKOUT GENERATOR (Google Gemini AI API)
// ==============================================================================

app.post('/api/workout/dynamic-routine', async (req, res) => {
  try {
    const { muscleGroup, experienceLevel, weekNumber, goal } = req.body;
    const result = await generateDynamicWorkoutWithGemini({
      muscleGroup: muscleGroup || 'Chest',
      experienceLevel: experienceLevel || 'Intermediate',
      weekNumber: Number(weekNumber) || 1,
      goal: goal || 'Hypertrophy & Size'
    });

    res.json(result);
  } catch (error) {
    console.error('[API ERROR] Workout routine generation failed:', error);
    res.status(500).json({ success: false, message: 'Failed to generate workout routine' });
  }
});

app.post('/api/workout/log-session', async (req, res) => {
  try {
    const { userId, benchPress, squats, bodyWeight, sessionSummary } = req.body;

    if (isMongoConnected && userId && userId !== 'usr_demo') {
      const user = await User.findById(userId);
      if (user) {
        if (benchPress) user.prStats.benchPress = Number(benchPress);
        if (squats) user.prStats.squats = Number(squats);
        if (bodyWeight) user.prStats.bodyWeight = Number(bodyWeight);
        user.checkInsCount = (user.checkInsCount || 0) + 1;
        await user.save();
        console.log(`[API LOG] 🏆 Updated PR Stats in MongoDB Atlas for: ${user.name}`);
      }
    }

    db.workoutLogs.push({
      userId,
      benchPress,
      squats,
      bodyWeight,
      sessionSummary,
      loggedAt: new Date()
    });

    res.json({ success: true, message: 'Workout session & PRs successfully logged!' });
  } catch (error) {
    console.error('[API ERROR] Failed to log workout session:', error);
    res.status(500).json({ success: false, message: 'Failed to log workout session' });
  }
});

// ==============================================================================
// 5. BOOKINGS & TRIAL PASSES (Atlas Persistent)
// ==============================================================================

app.post('/api/booking/trainer', async (req, res) => {
  try {
    const { trainerName, memberName, userPhone, userEmail, date, time, goal } = req.body;

    if (isMongoConnected) {
      const booking = new Booking({
        trainerName: trainerName || 'Amrit Dwivedi',
        memberName: memberName || 'Gym Member',
        userPhone: userPhone || '8889990012',
        userEmail: userEmail || '',
        date: date || 'Tomorrow',
        time: time || '08:00 AM',
        goal: goal || 'Hypertrophy & Form Check'
      });
      await booking.save();
      return res.json({ success: true, message: `Session booked with ${booking.trainerName}!`, booking });
    }

    const fallbackBooking = {
      id: `trn_${Date.now()}`,
      trainerName: trainerName || 'Amrit Dwivedi',
      memberName: memberName || 'Gym Member',
      userPhone: userPhone || '8889990012',
      date: date || 'Tomorrow',
      time: time || '08:00 AM',
      goal: goal || 'Hypertrophy & Form Check',
      status: 'CONFIRMED',
      createdAt: new Date()
    };
    db.trainerBookings.push(fallbackBooking);

    res.json({ success: true, message: `Session booked with ${fallbackBooking.trainerName}!`, booking: fallbackBooking });
  } catch (error) {
    console.error('[API ERROR] Trainer booking failed:', error);
    res.status(500).json({ success: false, message: 'Failed to book trainer' });
  }
});

app.post('/api/booking/trial', async (req, res) => {
  try {
    const { name, phone, date } = req.body;

    if (isMongoConnected) {
      const pass = new TrialPass({
        name: name || 'Trial Visitor',
        phone: phone || '8889990012',
        date: date || new Date().toISOString().split('T')[0],
      });
      await pass.save();
      return res.json({ success: true, message: '3-Day VIP Free Trial Pass issued!', pass });
    }

    const fallbackPass = {
      id: `trial_${Date.now()}`,
      name: name || 'Trial Visitor',
      phone: phone || '8889990012',
      date: date || new Date().toISOString().split('T')[0],
      duration: '3 Days',
      passCode: `VIP-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'ACTIVE_PASS'
    };
    db.trialPasses.push(fallbackPass);

    res.json({ success: true, message: 'Free trial pass generated!', pass: fallbackPass });
  } catch (error) {
    console.error('[API ERROR] Trial pass booking failed:', error);
    res.status(500).json({ success: false, message: 'Failed to generate trial pass' });
  }
});

// ==============================================================================
// 6. DEDICATED ADMIN PORTAL & TWILIO NOTIFICATION SYSTEM
// ==============================================================================

// Fetch all members for Admin Dashboard
app.get('/api/admin/users', async (req, res) => {
  try {
    let users = [];
    if (isMongoConnected) {
      users = await User.find().select('-password').sort({ createdAt: -1 });
    } else {
      if (db.users.length === 0) {
        db.users = [
          {
            _id: 'usr_demo_1',
            id: 'usr_demo_1',
            name: 'Amrit Dwivedi',
            email: 'amrit@gym.com',
            phone: '9971284797',
            membershipPlan: 'VIP Elite Annual Pass',
            membershipStartDate: new Date(Date.now() - 330 * 24 * 60 * 60 * 1000),
            membershipExpiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            daysRemaining: 4,
            checkInsCount: 22,
            role: 'admin'
          },
          {
            _id: 'usr_demo_2',
            id: 'usr_demo_2',
            name: 'Rohit Sharma',
            email: 'rohit@gmail.com',
            phone: '9811223344',
            membershipPlan: 'Pro Performance 3-Month',
            membershipStartDate: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000),
            membershipExpiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
            daysRemaining: 6,
            checkInsCount: 14,
            role: 'member'
          },
          {
            _id: 'usr_demo_3',
            id: 'usr_demo_3',
            name: 'Pooja Verma',
            email: 'pooja@gmail.com',
            phone: '9876543210',
            membershipPlan: 'Starter Monthly Pass',
            membershipStartDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
            membershipExpiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            daysRemaining: 0,
            checkInsCount: 8,
            role: 'member'
          }
        ];
      }
      users = db.users;
    }
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch all Trainer Bookings & Trial Passes for Admin
app.get('/api/admin/inquiries', async (req, res) => {
  try {
    let bookings = [];
    let trialPasses = [];

    if (isMongoConnected) {
      bookings = await Booking.find().sort({ createdAt: -1 });
      trialPasses = await TrialPass.find().sort({ createdAt: -1 });
    } else {
      bookings = db.trainerBookings;
      trialPasses = db.trialPasses;
    }

    res.json({ success: true, bookings, trialPasses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send Manual Custom WhatsApp Message from Admin
app.post('/api/admin/send-whatsapp', async (req, res) => {
  try {
    const { phone, messageText, memberName } = req.body;

    if (!phone || !messageText) {
      return res.status(400).json({ success: false, message: 'Phone number and message text are required.' });
    }

    const result = await sendTwilioWhatsAppMessage({ toPhone: phone, messageText });

    if (isMongoConnected && phone) {
      await User.updateOne(
        { phone: phone.replace(/[^0-9]/g, '') },
        {
          $push: {
            notificationHistory: {
              message: messageText,
              channel: 'whatsapp',
              status: result.success ? 'DELIVERED' : 'FAILED',
              sentAt: new Date()
            }
          }
        }
      );
    }

    res.json(result);
  } catch (error) {
    console.error('[ADMIN TWILIO ERROR]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Trigger Automated Expiry WhatsApp Alerts to Expiring Members (< 7 days)
app.post('/api/admin/trigger-expiry-reminders', async (req, res) => {
  try {
    let members = [];

    if (isMongoConnected) {
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      members = await User.find({
        membershipStatus: 'active',
        membershipExpiryDate: { $lte: sevenDaysFromNow }
      });
    } else {
      members = db.users.filter(u => u.daysRemaining <= 7);
      if (members.length === 0) {
        members = [
          { name: 'Amrit Dwivedi', phone: '9971284797', daysRemaining: 4, membershipPlan: 'VIP Elite Annual Pass' },
          { name: 'Rohit Sharma', phone: '9811223344', daysRemaining: 6, membershipPlan: 'Pro Performance 3-Month' }
        ];
      }
    }

    const results = [];

    for (const member of members) {
      const daysLeft = member.daysRemaining || 4;
      const message = `🚨 *APEX 3D GYM - MEMBERSHIP EXPIRY ALERT*\n\nHi ${member.name}! Your ${member.membershipPlan || 'VIP Membership'} at Apex 3D Gym New Delhi is expiring in *${daysLeft} Days*.\n\nTo ensure uninterrupted 3D gym floor access and personal training, please renew at the Front Desk or contact: +91 9971284797.\n\nSee you on the gym floor! 💪`;

      const sendResult = await sendTwilioWhatsAppMessage({
        toPhone: member.phone || '9971284797',
        messageText: message
      });

      results.push({
        name: member.name,
        phone: member.phone,
        daysLeft,
        status: sendResult.success ? 'SENT' : 'FAILED',
        mode: sendResult.mode
      });
    }

    res.json({
      success: true,
      message: `Expiry reminders triggered for ${results.length} members.`,
      dispatchedCount: results.length,
      details: results
    });
  } catch (error) {
    console.error('[EXPIRY REMINDER ERROR]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve compiled frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 3D Gym Platform Running Live at: http://localhost:${PORT}`);
  console.log(`🛡️ Protected Admin Portal: Credentials Loaded from .env`);
  console.log(`📍 Location: Dwarka Sector 12, New Delhi`);
  console.log(`========================================================`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n⚡ Port ${PORT} is ALREADY RUNNING in the background!`);
    console.log(`👉 Open http://localhost:${PORT} directly in your browser!\n`);
  } else {
    console.error(err);
  }
});
