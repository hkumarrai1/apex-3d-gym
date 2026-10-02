import React from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = GYM_CONFIG.OWNER.whatsapp;
  const gymName = GYM_CONFIG.GYM_NAME;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hi ${GYM_CONFIG.OWNER.name}! I am interested in joining ${gymName} in New Delhi. Please send me membership details and free trial booking info.`
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Direct Chat"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-110 border border-white/20"
    >
      <div className="relative">
        <MessageSquare className="w-6 h-6 fill-black text-black" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></span>
      </div>
      <span className="hidden sm:inline-block font-extrabold text-xs uppercase tracking-wider font-heading">
        WhatsApp Chat Direct
      </span>
    </a>
  );
}
