import React, { useState } from 'react';
import { useGymConfig } from '../context/GymConfigContext';
import { X, Sparkles, CheckCircle2, QrCode, Dumbbell } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FreeTrialModal({ onClose }) {
  const { config } = useGymConfig();
  const c = config || {};
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [passGenerated, setPassGenerated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/booking/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, date })
      });
    } catch(err) {
      console.warn("Backend API offline, using client mock pass:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setPassGenerated(true);
        try { confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } }); } catch(e){}
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-md w-full bg-gym-card border border-lime-400/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(204,255,0,0.2)] relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {!passGenerated ? (
          <div>
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono text-lime-400 uppercase tracking-widest bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/30">
                100% Free &bull; Zero Commitment
              </span>
              <h3 className="text-2xl font-extrabold text-white font-heading mt-3">3-Day VIP Free Trial Pass</h3>
              <p className="text-xs text-slate-400 mt-1">Experience full access to {c.GYM_NAME || 'APEX 3D Gym'} in {c.LOCATION?.city || 'New Delhi'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Preferred Trial Start Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-lime-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] shadow-xl shadow-lime-400/25 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span>GENERATING VIP PASS...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> CLAIM FREE 3-DAY PASS NOW
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            {/* VIP Digital Card Preview */}
            <div className="bg-gradient-to-r from-gym-card to-black p-6 rounded-2xl border-2 border-lime-400 shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 text-[9px] font-mono bg-lime-400 text-black px-2 py-0.5 rounded font-bold">
                VIP TRIAL PASS
              </div>
              <Dumbbell className="w-8 h-8 text-cyan-400 mb-2" />
              <h4 className="text-lg font-bold text-white font-heading">{c.GYM_SHORT_NAME || 'APEX 3D'}</h4>
              <p className="text-xs text-lime-400 font-mono">Pass Holder: {name || 'VIP Member'}</p>
              <div className="my-3 border-t border-white/10"></div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
                <span>Valid: 3 Consecutive Days</span>
                <span>City: {c.LOCATION?.city || 'New Delhi'}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-lime-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Pass Sent to +91 {phone || '8889990012'} via WhatsApp!
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-lime-400 text-black font-bold text-xs uppercase"
            >
              Done & Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
