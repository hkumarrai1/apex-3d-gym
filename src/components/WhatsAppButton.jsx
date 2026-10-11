import React from 'react';
import { useGymConfig } from '../context/GymConfigContext';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const { config } = useGymConfig();
  const c = config || {};
  const owner = c.OWNER || {};
  const phone = owner.whatsapp || "919971284797";
  const gymName = c.GYM_NAME || "APEX 3D Gym";

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hi ${owner.name || 'Team'}! I am interested in joining ${gymName}. Please send me membership details and free trial booking info.`
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
