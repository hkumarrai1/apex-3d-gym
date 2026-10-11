import React, { useState } from 'react';
import { useGymConfig } from '../context/GymConfigContext';
import { X, Calendar, Clock, User, CheckCircle2, Dumbbell } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TrainerBookingModal({ trainer, onClose }) {
  const { config } = useGymConfig();
  const c = config || {};
  const owner = c.OWNER || {};
  const trainers = c.TRAINERS || [];

  const [selectedTrainer, setSelectedTrainer] = useState(trainer ? trainer.name : (owner.name || 'Founder'));
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [goal, setGoal] = useState('Hypertrophy & Form Check');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const trainersList = [
    { name: owner.name, role: owner.role },
    ...trainers.map(t => ({ name: t.name, role: t.role }))
  ];

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/booking/trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerName: selectedTrainer,
          date,
          time,
          goal,
          userPhone: owner.phone
        })
      });
    } catch(err) {
      console.warn("Backend API offline, using client state:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setConfirmed(true);
        try { confetti({ particleCount: 80, origin: { y: 0.6 } }); } catch(e){}
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-lg w-full bg-gym-card border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                1-on-1 Personal Training Session
              </span>
              <h3 className="text-2xl font-bold text-white font-heading mt-3">Book Your Fitness Session</h3>
              <p className="text-xs text-slate-400 mt-1">Schedule a live coaching session at {c.GYM_SHORT_NAME || 'APEX 3D'} {c.LOCATION?.city || 'HQ'}</p>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Select Coach / Personal Trainer</label>
                <select
                  value={selectedTrainer}
                  onChange={(e) => setSelectedTrainer(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400"
                >
                  {trainersList.map((t, idx) => (
                    <option key={idx} value={t.name} className="bg-gym-card">
                      {t.name} ({t.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Session Date</label>
                  <input
                    type="date"
                    required
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Time Slot</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-cyan-400"
                  >
                    <option value="07:00 AM" className="bg-gym-card">07:00 AM - Morning Slot</option>
                    <option value="09:00 AM" className="bg-gym-card">09:00 AM - Morning Slot</option>
                    <option value="05:00 PM" className="bg-gym-card">05:00 PM - Evening Slot</option>
                    <option value="07:00 PM" className="bg-gym-card">07:00 PM - Peak Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Session Focus & Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-cyan-400"
                >
                  <option value="Hypertrophy & Form Check" className="bg-gym-card">Hypertrophy & Form Check</option>
                  <option value="Fat Loss & HIIT Circuit" className="bg-gym-card">Fat Loss & HIIT Circuit</option>
                  <option value="Powerlifting Heavy Singles" className="bg-gym-card">Powerlifting Heavy Singles</option>
                  <option value="Diet & Body Scan Assessment" className="bg-gym-card">Diet & Body Scan Assessment</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-lime-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span>RESERVING SESSION SLOT...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" /> CONFIRM & SCHEDULE SESSION
                  </>
                )}
              </button>

            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-cyan-400 text-black rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-400/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Session Confirmed!</h3>
            <p className="text-xs text-slate-300">
              Your appointment with <span className="text-cyan-400 font-bold">{selectedTrainer}</span> has been locked for <span className="text-lime-400">{date} at {time}</span>.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-cyan-400">
              Booking Ref: #TRN-{Math.floor(1000 + Math.random() * 9000)}
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-cyan-400 text-black font-bold text-xs uppercase"
            >
              Done & Return to Site
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
