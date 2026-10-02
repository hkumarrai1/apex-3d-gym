import React from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import { UserCheck, Phone, Calendar, Award, Star, MessageSquare } from 'lucide-react';

export default function OwnerTrainerSection({ onBookTrainer }) {
  const owner = GYM_CONFIG.OWNER;
  const trainers = GYM_CONFIG.TRAINERS;

  return (
    <section id="trainers" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <UserCheck className="w-4 h-4" /> Elite Leadership & Coaching Staff
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
            Meet the Masters Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">{GYM_CONFIG.GYM_SHORT_NAME}</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Guided by founder Amrit Dwivedi and our team of 3 elite certified personal trainers in New Delhi.
          </p>
        </div>

        {/* OWNER CARD (VIP HIGHLIGHT) */}
        <div className="bg-gradient-to-r from-gym-card via-black to-gym-card border-2 border-cyan-400/40 rounded-3xl p-6 md:p-10 mb-16 shadow-[0_0_40px_rgba(0,240,255,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-400 to-lime-400 text-black px-6 py-1.5 rounded-bl-2xl font-extrabold text-xs uppercase tracking-widest shadow-lg">
            FOUNDER & MASTER HEAD COACH
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            
            {/* Owner Photo */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden border-2 border-cyan-400 shadow-2xl shrink-0 relative group">
              <img
                src={owner.photo}
                alt={owner.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-mono text-cyan-400 bg-black/70 py-1 rounded-md">
                AMRIT DWIVEDI &bull; FOUNDER
              </div>
            </div>

            {/* Owner Details */}
            <div className="space-y-4 text-center lg:text-left flex-1">
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white font-heading">{owner.name}</h3>
                <p className="text-cyan-400 font-semibold text-base mt-1">{owner.role}</p>
              </div>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {owner.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                {owner.certifications.map((cert, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-lime-400">
                    &bull; {cert}
                  </span>
                ))}
              </div>

              {/* Owner Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href={`https://wa.me/${owner.whatsapp}?text=Hi%20Amrit!%20I%20want%20to%20consult%20you%20regarding%20gym%20training.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-sm transition-all flex items-center gap-2 shadow-lg shadow-lime-400/20"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp Direct Chat
                </a>
                <a
                  href={`tel:${owner.phone}`}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all flex items-center gap-2 border border-white/10"
                >
                  <Phone className="w-4 h-4 text-cyan-400" /> Call: {owner.phone}
                </a>
                <button
                  onClick={() => onBookTrainer(owner)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Session with Amrit
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* 3 TRAINERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="bg-gym-card/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl hover:border-cyan-500/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Trainer Image */}
                <div className="w-full h-64 rounded-2xl overflow-hidden mb-5 border border-white/10 relative">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {t.rating}
                  </div>
                </div>

                {/* Info */}
                <h4 className="text-2xl font-bold text-white font-heading">{t.name}</h4>
                <p className="text-xs font-mono text-cyan-400 mt-1">{t.role}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Specialty:</span>
                    <span className="font-semibold text-lime-400">{t.specialty}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-semibold text-white">{t.experience}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Sessions Completed:</span>
                    <span className="font-semibold text-cyan-400">{t.sessionsCompleted}+</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={() => onBookTrainer(t)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Trainer
                </button>
                <a
                  href={`tel:${t.phone}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  title="Call Trainer"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
