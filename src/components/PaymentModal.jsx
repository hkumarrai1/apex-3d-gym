import React from 'react';
import { useGymConfig } from '../context/GymConfigContext';
import { X, Phone, MessageSquare, MapPin, Clock, Banknote, ShieldCheck, Check } from 'lucide-react';

export default function PaymentModal({ plan, onClose }) {
  const { config } = useGymConfig();
  if (!plan) return null;

  const c = config || {};
  const paymentContactPhone = c.OWNER?.phone || "9971284797";
  const whatsappUrl = `https://wa.me/91${paymentContactPhone}?text=${encodeURIComponent(
    `Hi! I want to join ${c.GYM_NAME || 'the gym'} with the "${plan.name}" (${plan.price}${plan.period}). Please provide details on how to pay via Cash or UPI at the front desk.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-lg w-full bg-gym-card border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-lime-400 uppercase tracking-widest bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/30">
            <Banknote className="w-3.5 h-3.5" /> Front Desk Payment Information
          </span>
          <h3 className="text-2xl font-extrabold text-white font-heading mt-3">{plan.name}</h3>
          <div className="mt-1 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400 font-heading">
              {plan.price}
            </span>
            <span className="text-xs text-slate-400 font-mono">{plan.period}</span>
          </div>
        </div>

        {/* Cash & Front Desk Payment Notice Card */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2 mb-6">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Payment Notice: Cash / UPI at Front Desk</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            Online card payments are currently offline. We accept <strong className="text-white">Cash & Direct UPI (GPay / PhonePe / Paytm)</strong> directly at our Gym Front Desk upon arrival.
          </p>
          <p className="text-amber-300 font-semibold pt-1">
            For more information about how to pay and to lock in your membership slot, please contact our help desk:
          </p>
        </div>

        {/* Primary Contact Action Buttons */}
        <div className="space-y-3 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/25"
          >
            <MessageSquare className="w-4 h-4 fill-black" />
            WhatsApp Payment Enquiry (+91 {paymentContactPhone})
          </a>

          <a
            href={`tel:+91${paymentContactPhone}`}
            className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 flex items-center justify-center gap-2 transition-all"
          >
            <Phone className="w-4 h-4 text-cyan-400" />
            Call Payment Desk: +91 {paymentContactPhone}
          </a>
        </div>

        {/* Location & Desk Info */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{c.LOCATION?.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-lime-400 shrink-0" />
            <span>Front Desk Hours: {c.LOCATION?.hours}</span>
          </div>
        </div>

        {/* Plan Included Highlights */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>Includes Full 3D Gym Floor Access</span>
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Instant Activation
          </span>
        </div>

      </div>
    </div>
  );
}
