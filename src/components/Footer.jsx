import React from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import { Dumbbell, MapPin, Phone, Mail, Instagram, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gym-darker border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-400 text-black flex items-center justify-center font-bold">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white font-heading">{GYM_CONFIG.GYM_NAME}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {GYM_CONFIG.SUB_TAGLINE}. Redefining human physical performance through 3D biomechanics and personal coaching.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#3d-spotlight" className="hover:text-cyan-400 transition-colors">3D Equipment Stage</a></li>
              <li><a href="#transformations" className="hover:text-cyan-400 transition-colors">Client Transformations</a></li>
              <li><a href="#gallery" className="hover:text-cyan-400 transition-colors">Gym Facility Photos</a></li>
              <li><a href="#ai-generator" className="hover:text-cyan-400 transition-colors">AI Workout Generator</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Membership Pricing</a></li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">New Delhi HQ</h4>
            <div className="space-y-2 text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{GYM_CONFIG.LOCATION.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-lime-400 shrink-0" />
                <a href={`tel:${GYM_CONFIG.OWNER.phone}`} className="hover:underline text-white font-bold">
                  +91 {GYM_CONFIG.OWNER.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{GYM_CONFIG.OWNER.email}</span>
              </p>
            </div>
          </div>

          {/* Owner Desk */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider font-mono">Management</h4>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <p className="text-white font-bold text-sm">{GYM_CONFIG.OWNER.name}</p>
              <p className="text-[11px] text-cyan-400 font-mono">{GYM_CONFIG.OWNER.role}</p>
              <a
                href={GYM_CONFIG.LOCATION.googleMapsDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-lime-400 font-bold hover:underline pt-1"
              >
                Google Maps Location <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} {GYM_CONFIG.GYM_NAME}. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href={`https://wa.me/${GYM_CONFIG.OWNER.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-emerald-400">WhatsApp Desk</a>
            <span>&bull;</span>
            <a href="#location" className="hover:text-cyan-400">Dwarka Sector 12, New Delhi</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
