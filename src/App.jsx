import React, { useState, useEffect } from 'react';
import { GYM_CONFIG } from './config/gymConfig';
import Navbar from './components/Navbar';
import Hero3DCanvas from './components/Hero3DCanvas';
import GymEquipment3D from './components/GymEquipment3D';
import WorkoutProgressTracker from './components/WorkoutProgressTracker';
import TransformationSlider from './components/TransformationSlider';
import GymGallery from './components/GymGallery';
import AIWorkoutGenerator from './components/AIWorkoutGenerator';
import OwnerTrainerSection from './components/OwnerTrainerSection';
import MembershipPlans from './components/MembershipPlans';
import LocationMapSection from './components/LocationMapSection';
import InstaFeed from './components/InstaFeed';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import ErrorBoundary3D from './components/ErrorBoundary3D';

// Modals
import AuthModal from './components/AuthModal';
import TrainerBookingModal from './components/TrainerBookingModal';
import FreeTrialModal from './components/FreeTrialModal';
import MemberDashboardModal from './components/MemberDashboardModal';
import AdminPortalModal from './components/AdminPortalModal';

import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  // Modal visibility states
  const [showAuth, setShowAuth] = useState(false);
  const [showTrial, setShowTrial] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedTrainerBooking, setSelectedTrainerBooking] = useState(null);

  // Sync dark class on html root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleBookTrainer = (trainerObj) => {
    setSelectedTrainerBooking(trainerObj);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gym-darker text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300 font-sans`}>
      
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAuth={() => setShowAuth(true)}
        onOpenTrial={() => setShowTrial(true)}
        onOpenDashboard={() => setShowDashboard(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        user={user}
      />

      {/* HERO SECTION WITH 3D CANVAS STAGE */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 border-b border-white/5">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase">
                <Sparkles className="w-4 h-4 animate-spin-slow" /> {GYM_CONFIG.SUB_TAGLINE}
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight leading-[1.05]">
                {GYM_CONFIG.TAGLINE.split('in 3D')[0]} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-lime-400 glow-text-cyan">
                  in 3D Dimension
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Welcome to <strong className="text-white">{GYM_CONFIG.GYM_NAME}</strong> in New Delhi. Step into an immersive fitness experience featuring military-grade biomechanical weights, Gemini AI adaptive single-muscle rep tracking, and 1-on-1 personal coaching with founder Amrit Dwivedi.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => setShowTrial(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_25px_rgba(204,255,0,0.3)] flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" /> CLAIM FREE 3-DAY TRIAL PASS
                </button>
                <a
                  href="#pricing"
                  className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider transition-all border border-white/15 flex items-center gap-2 backdrop-blur-md"
                >
                  Explore Memberships <ArrowRight className="w-4 h-4 text-cyan-400" />
                </a>
              </div>

              {/* Quick Stat Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold font-heading text-cyan-400">1,500+</p>
                  <p className="text-[11px] text-slate-400 font-mono">Members Transformed</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold font-heading text-lime-400">100%</p>
                  <p className="text-[11px] text-slate-400 font-mono">3D Biomechanical Gear</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold font-heading text-yellow-400">4.9 ★</p>
                  <p className="text-[11px] text-slate-400 font-mono">New Delhi Rating</p>
                </div>
              </div>

            </div>

            {/* Hero Right 3D Stage (5 cols) */}
            <div className="lg:col-span-5 relative z-10">
              <ErrorBoundary3D>
                <Hero3DCanvas />
              </ErrorBoundary3D>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN SECTION CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Interactive 3D Equipment Spotlight */}
        <div id="3d-spotlight">
          <ErrorBoundary3D>
            <GymEquipment3D />
          </ErrorBoundary3D>
        </div>

        {/* 2. DYNAMIC WORKOUT PROGRESS TRACKER (Single-Muscle Gemini AI + Rep/Timer Runner) */}
        <WorkoutProgressTracker user={user} />

        {/* 3. Before & After Transformation Slider */}
        <TransformationSlider />

        {/* 4. Gym Facility Lightbox Gallery */}
        <GymGallery />

        {/* 5. AI Macro & Diet Generator */}
        <AIWorkoutGenerator />

        {/* 6. Owner Amrit Dwivedi & 3 Trainers Profile Cards */}
        <OwnerTrainerSection onBookTrainer={handleBookTrainer} />

        {/* 7. Membership Plans & Front Desk Cash Notice */}
        <MembershipPlans />

        {/* 8. Location & Interactive Google Maps Section */}
        <LocationMapSection />

        {/* 9. Instagram Social Wall */}
        <InstaFeed />

      </main>

      {/* WhatsApp Floating Chat Widget */}
      <WhatsAppButton />

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLoginSuccess={(userData) => {
            setUser(userData);
            setShowAuth(false);
            setShowDashboard(true);
          }}
        />
      )}

      {showTrial && (
        <FreeTrialModal onClose={() => setShowTrial(false)} />
      )}

      {selectedTrainerBooking && (
        <TrainerBookingModal
          trainer={selectedTrainerBooking}
          onClose={() => setSelectedTrainerBooking(null)}
        />
      )}

      {showDashboard && (
        <MemberDashboardModal
          user={user}
          onClose={() => setShowDashboard(false)}
          onRenew={() => {
            setShowDashboard(false);
            const pricingElem = document.getElementById('pricing');
            if (pricingElem) pricingElem.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {showAdmin && (
        <AdminPortalModal
          onClose={() => setShowAdmin(false)}
        />
      )}

    </div>
  );
}
