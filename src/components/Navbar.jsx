import React, { useState } from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import { Dumbbell, Sun, Moon, User, Sparkles, Menu, X, Shield, Activity } from 'lucide-react';

export default function Navbar({
  darkMode,
  setDarkMode,
  onOpenAuth,
  onOpenTrial,
  onOpenDashboard,
  onOpenAdmin,
  user
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: '3D Spotlight', href: '#3d-spotlight' },
    { name: 'AI Rep Tracker', href: '#ai-tracker' },
    { name: 'Transformations', href: '#transformations' },
    { name: 'Gym Photos', href: '#gallery' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-gym-darker/80 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO & BRAND NAME */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-lime-400 p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-gym-darker rounded-[14px] flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-cyan-400 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold font-heading text-white tracking-wider block leading-none">
              {GYM_CONFIG.GYM_SHORT_NAME}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 tracking-widest block uppercase mt-0.5">
              {GYM_CONFIG.LOCATION.city} HQ
            </span>
          </div>
        </a>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-wider"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="hidden sm:flex items-center gap-2.5">
          
          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5 font-mono text-xs"
            title="Open Dedicated Admin Portal & Twilio Center"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline font-bold">Admin</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Free Trial Button */}
          <button
            onClick={onOpenTrial}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-lime-400/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Free Trial
          </button>

          {/* Member Login / Dashboard */}
          {user ? (
            <button
              onClick={onOpenDashboard}
              className="px-4 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-cyan-400/20"
            >
              <User className="w-4 h-4" /> Dashboard
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/10 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" /> Member Portal
            </button>
          )}

        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white/5 text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-white/10 text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden bg-gym-card border-b border-white/10 px-6 py-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-slate-200 hover:text-cyan-400 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={() => { setMobileOpen(false); onOpenAdmin(); }}
              className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> Admin Control & Twilio Center
            </button>
            <button
              onClick={() => { setMobileOpen(false); onOpenTrial(); }}
              className="w-full py-3 rounded-xl bg-lime-400 text-black font-bold text-xs uppercase"
            >
              Free 3-Day Trial Pass
            </button>
            <button
              onClick={() => { setMobileOpen(false); user ? onOpenDashboard() : onOpenAuth(); }}
              className="w-full py-3 rounded-xl bg-cyan-400 text-black font-bold text-xs uppercase"
            >
              {user ? 'Member Dashboard' : 'Member Login / Sign Up'}
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
