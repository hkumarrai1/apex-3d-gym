import React, { useState } from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import PaymentModal from './PaymentModal';
import { Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function MembershipPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = GYM_CONFIG.MEMBERSHIP_PLANS;

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-mono uppercase tracking-widest">
            <Zap className="w-4 h-4" /> Transparent Pricing, No Hidden Fees
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
            Membership <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">Plans & Passes</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Choose a plan that matches your training ambition. Instant activation with digital QR check-in.
          </p>
        </div>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`bg-gym-card/90 rounded-3xl p-8 backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                p.popular
                  ? 'border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.25)] md:-translate-y-4'
                  : 'border-white/10 hover:border-cyan-500/40 hover:-translate-y-2'
              }`}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-400 to-blue-500 text-black px-4 py-1 rounded-bl-xl font-extrabold text-[10px] uppercase tracking-widest">
                  MOST POPULAR &bull; BEST VALUE
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white font-heading">{p.name}</h3>
                
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-white font-heading">{p.price}</span>
                  <span className="text-xs text-slate-400 font-mono">{p.period}</span>
                </div>

                <div className="my-6 border-t border-white/10"></div>

                <ul className="space-y-3">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => setSelectedPlan(p)}
                  className={`w-full py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                    p.popular
                      ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-lime-400 text-black shadow-cyan-500/30 hover:scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> SELECT & JOIN ONLINE
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => setSelectedPlan(null)}
        />
      )}

    </section>
  );
}
