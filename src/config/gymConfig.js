/**
 * ==============================================================================
 * GLOBAL GYM CONFIGURATION SOURCE OF TRUTH
 * ==============================================================================
 * You can change ANY value here (Gym Name, Owner, Phone, Photos, Location, etc.)
 * and the entire application UI and Backend will update automatically!
 * ==============================================================================
 */

export const GYM_CONFIG = {
  // ---------------------------------------------------------------------------
  // 1. MAIN BRANDING & NAME (Change 'GYM_NAME' once here to rename everywhere!)
  // ---------------------------------------------------------------------------
  GYM_NAME: "APEX 3D ATHLETICS & PERFORMANCE", // <-- EDIT THIS TO CHANGE TOTAL GYM NAME
  GYM_SHORT_NAME: "APEX 3D",
  TAGLINE: "Transform Your Body in 3D Dimension",
  SUB_TAGLINE: "New Delhi's Premier AI-Powered 3D Smart Gym & Elite Fitness Center",
  
  // ---------------------------------------------------------------------------
  // 2. LOCATION & MAP COORDINATES
  // ---------------------------------------------------------------------------
  LOCATION: {
    city: "New Delhi",
    address: "Dwarka Sector 12, Main Ring Road, New Delhi - 110075, India",
    coordinates: {
      lat: 28.61614192367146,
      lng: 77.08783089985045
    },
    // Direct Google Maps Link provided by user:
    googleMapsDirectUrl: "https://maps.app.goo.gl/WX2LfU52egpWxYfr8",
    embedMapUrl: "https://maps.google.com/maps?q=28.61614192367146,77.08783089985045&z=15&output=embed",
    hours: "Mon - Sat: 5:30 AM - 10:30 PM | Sunday: 7:00 AM - 8:00 PM",
  },

  // ---------------------------------------------------------------------------
  // 3. OWNER & MANAGEMENT DETAILS
  // ---------------------------------------------------------------------------
  OWNER: {
    name: "Amrit Dwivedi",
    role: "Founder & Master Fitness Coach",
    phone: "8889990012",
    whatsapp: "918889990012",
    email: "contact@apex3dgym.com",
    // You can replace this profile photo URL anytime:
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    bio: "Head Fitness Strategist with 10+ years of specialized experience in hyper-trophy, body recomposition, and elite athletic conditioning.",
    certifications: ["IFBB Pro Conditioning", "CSCS Certified", "AI Nutrition Specialist"]
  },

  // ---------------------------------------------------------------------------
  // 4. TRAINERS (Up to 3 Trainers - Change names, photos, & roles here)
  // ---------------------------------------------------------------------------
  TRAINERS: [
    {
      id: "trainer-1",
      name: "Trainer 1", // <-- Rename here (e.g. "Vikram Sharma")
      role: "Senior Strength & Conditioning Specialist",
      specialty: "Powerlifting & Hypertrophy",
      experience: "8+ Years",
      phone: "8889990012",
      photo: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      sessionsCompleted: 1420
    },
    {
      id: "trainer-2",
      name: "Trainer 2", // <-- Rename here (e.g. "Rohan Malhotra")
      role: "Body Recomposition & Fat Loss Expert",
      specialty: "High-Intensity Interval Training & Diet",
      experience: "6+ Years",
      phone: "8889990012",
      photo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600",
      rating: 4.85,
      sessionsCompleted: 1100
    },
    {
      id: "trainer-3",
      name: "Trainer 3", // <-- Rename here (e.g. "Ananya Roy")
      role: "Calisthenics & Functional Mobility Coach",
      specialty: "Core Strength, Mobility & Endurance",
      experience: "5+ Years",
      phone: "8889990012",
      photo: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600",
      rating: 4.92,
      sessionsCompleted: 980
    }
  ],

  // ---------------------------------------------------------------------------
  // 5. GYM AMBIANCE & FACILITY PHOTOS (User Github raw links)
  // ---------------------------------------------------------------------------
  GYM_PHOTOS: [
    {
      id: "photo1",
      url: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/gym1.png",
      title: "Main Weight & Dumbbell Zone",
      desc: "State of the art heavy iron & polyurethane dumbbell station"
    },
    {
      id: "photo2",
      url: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/gym2.png",
      title: "Advanced Cardio & Endurance Arena",
      desc: "Interactive 3D treadmills, rowers & stairmasters"
    },
    {
      id: "photo3",
      url: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/gym3.png",
      title: "Power Racks & Cable Crossover Station",
      desc: "Olympic benches, squat cages & multi-angle cable machines"
    },
    {
      id: "photo4",
      url: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/gym4.png",
      title: "Personal Coaching & Recovery Lounge",
      desc: "Dedicated 1-on-1 personal training zone & protein bar"
    }
  ],

  // ---------------------------------------------------------------------------
  // 6. BEFORE & AFTER TRANSFORMATION PHOTOS (User Github raw links)
  // ---------------------------------------------------------------------------
  TRANSFORMATION_PHOTOS: {
    before: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformbefore1.png",
    after1: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter1.png",
    after2: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter2.png",
    after3: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter3.png",
    list: [
      {
        id: "trans1",
        name: "Transformation Phase 1",
        before: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformbefore1.png",
        after: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter1.png",
        duration: "12 Weeks",
        result: "-18 kg Fat Loss & Sculpted Muscle"
      },
      {
        id: "trans2",
        name: "Transformation Phase 2",
        before: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformbefore1.png",
        after: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter2.png",
        duration: "16 Weeks",
        result: "Six-Pack Abs & Athletic Conditioning"
      },
      {
        id: "trans3",
        name: "Transformation Phase 3",
        before: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformbefore1.png",
        after: "https://raw.githubusercontent.com/amritdwivedi1/gym/main/transformafter3.png",
        duration: "24 Weeks",
        result: "Elite Competition Physique"
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 7. PRICING & MEMBERSHIP PLANS
  // ---------------------------------------------------------------------------
  MEMBERSHIP_PLANS: [
    {
      id: "plan-monthly",
      name: "Starter Monthly Pass",
      price: "₹1,999",
      period: "/ month",
      popular: false,
      features: [
        "Full 3D Smart Gym Floor Access",
        "Locker Room & Steam Bath",
        "Basic AI Workout Plan",
        "1 Free Personal Trainer Session"
      ]
    },
    {
      id: "plan-quarterly",
      name: "Pro Performance 3-Month",
      price: "₹4,999",
      period: "/ 3 months",
      popular: true,
      features: [
        "Full Gym & Cardio Floor Access",
        "Unlimited Steam & Recovery Sauna",
        "Customized AI Workout & Nutrition Generator",
        "3 Personal Trainer Sessions",
        "Monthly InBody 3D Composition Scan"
      ]
    },
    {
      id: "plan-annual",
      name: "VIP Elite Annual Pass",
      price: "₹14,999",
      period: "/ year",
      popular: false,
      features: [
        "Priority 24/7 Access",
        "Dedicated Personal Locker",
        "Weekly 1-on-1 Coach Check-ins with Amrit",
        "Unlimited AI Diet & Workout Updates",
        "Free Gym Shaker & T-Shirt Kit",
        "Guest Passes (2 per month)"
      ]
    }
  ]
};
