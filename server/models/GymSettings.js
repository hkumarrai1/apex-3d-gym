import mongoose from 'mongoose';

const gymSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_gym_config',
      unique: true,
    },
    GYM_NAME: {
      type: String,
      default: 'APEX 3D ATHLETICS & PERFORMANCE',
    },
    GYM_SHORT_NAME: {
      type: String,
      default: 'APEX 3D',
    },
    TAGLINE: {
      type: String,
      default: 'Transform Your Body in 3D Dimension',
    },
    SUB_TAGLINE: {
      type: String,
      default: "New Delhi's Premier AI-Powered 3D Smart Gym & Elite Fitness Center",
    },
    LOCATION: {
      city: { type: String, default: 'New Delhi' },
      address: {
        type: String,
        default: 'Dwarka Sector 12, Main Ring Road, New Delhi - 110075, India',
      },
      googleMapsDirectUrl: {
        type: String,
        default: 'https://maps.app.goo.gl/WX2LfU52egpWxYfr8',
      },
      embedMapUrl: {
        type: String,
        default: 'https://maps.google.com/maps?q=28.61614192367146,77.08783089985045&z=15&output=embed',
      },
      hours: {
        type: String,
        default: 'Mon - Sat: 5:30 AM - 10:30 PM | Sunday: 7:00 AM - 8:00 PM',
      },
    },
    OWNER: {
      name: { type: String, default: 'Amrit Dwivedi' },
      role: { type: String, default: 'Founder & Master Fitness Coach' },
      phone: { type: String, default: '8889990012' },
      whatsapp: { type: String, default: '918889990012' },
      email: { type: String, default: 'contact@apex3dgym.com' },
      photo: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      },
      bio: {
        type: String,
        default:
          'Head Fitness Strategist with 10+ years of specialized experience in hyper-trophy, body recomposition, and elite athletic conditioning.',
      },
      certifications: {
        type: [String],
        default: ['IFBB Pro Conditioning', 'CSCS Certified', 'AI Nutrition Specialist'],
      },
    },
    TRAINERS: [
      {
        id: String,
        name: String,
        role: String,
        specialty: String,
        experience: String,
        phone: String,
        photo: String,
        rating: Number,
        sessionsCompleted: Number,
      },
    ],
    MEMBERSHIP_PLANS: [
      {
        id: String,
        name: String,
        price: String,
        period: String,
        popular: Boolean,
        features: [String],
      },
    ],
    PAYMENT_PHONE: {
      type: String,
      default: '9971284797',
    },
    INSTA_HANDLE: {
      type: String,
      default: '@apex3d_gym_delhi',
    },
  },
  {
    timestamps: true,
  }
);

export const GymSettings = mongoose.model('GymSettings', gymSettingsSchema, 'gymSettings');
