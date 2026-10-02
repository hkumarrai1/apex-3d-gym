import React from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import { MapPin, Navigation, Clock, Phone, ExternalLink, Compass } from 'lucide-react';

export default function LocationMapSection() {
  const location = GYM_CONFIG.LOCATION;

  return (
    <section id="location" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Compass className="w-4 h-4 animate-spin-slow" /> Prime Location in New Delhi
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
            Find Us on <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">Google Maps</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Visit our 3D performance center in Dwarka, New Delhi. One click below opens direct turn-by-turn navigation on your phone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-gym-card/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Gym Name & City */}
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{location.city} HQ</span>
                <h3 className="text-2xl font-extrabold text-white font-heading mt-1">{GYM_CONFIG.GYM_NAME}</h3>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Gym Address</h4>
                  <p className="text-slate-300 text-sm mt-0.5 leading-relaxed">{location.address}</p>
                  <p className="text-xs font-mono text-cyan-400 mt-1">GPS: {location.coordinates.lat}, {location.coordinates.lng}</p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Working Hours</h4>
                  <p className="text-slate-300 text-sm mt-0.5">{location.hours}</p>
                </div>
              </div>

              {/* Owner Direct Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Direct Contact Desk</h4>
                  <a href={`tel:${GYM_CONFIG.OWNER.phone}`} className="text-cyan-400 font-mono text-sm hover:underline">
                    +91 {GYM_CONFIG.OWNER.phone} (Amrit Dwivedi)
                  </a>
                </div>
              </div>

            </div>

            {/* DIRECT MAP NAVIGATION BUTTON */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <a
                href={location.googleMapsDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 text-black font-extrabold text-sm transition-all hover:scale-[1.02] shadow-xl shadow-lime-400/20 flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Navigation className="w-5 h-5" /> Open Direct Google Maps Route
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-center text-xs text-slate-400">
                Clicking opens native Google Maps app with live GPS directions.
              </p>
            </div>

          </div>

          {/* Right Map Preview Frame (7 cols) */}
          <div className="lg:col-span-7 bg-black rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl relative min-h-[380px] lg:min-h-[450px]">
            <iframe
              title="Gym Location Preview Map"
              src={location.embedMapUrl}
              className="w-full h-full min-h-[380px] border-0 filter grayscale contrast-125 invert opacity-85 hover:opacity-100 transition-opacity duration-300"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-xs font-mono text-cyan-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              NEW DELHI HQ MAP &bull; LIVE SATELLITE
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
