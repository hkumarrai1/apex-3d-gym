import React, { useState } from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import { Maximize2, X, Camera, Dumbbell, ShieldAlert } from 'lucide-react';

export default function GymGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const photos = GYM_CONFIG.GYM_PHOTOS;

  return (
    <section id="gallery" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase">
              <Camera className="w-4 h-4" /> Facility Spotlight
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white mt-2">
              Inside <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400">{GYM_CONFIG.GYM_SHORT_NAME}</span>
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-sm">
            Take a virtual tour of our state-of-the-art facility in New Delhi equipped with heavy dumbbell racks, biomechanical cardio gear, and private coaching spaces.
          </p>
        </div>

        {/* 4 Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative h-[320px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-gym-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,240,255,0.25)] hover:border-cyan-400/50"
            >
              {/* Photo Image */}
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Dark Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Top Badge */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-cyan-400 font-mono border border-cyan-500/30 flex items-center gap-1.5">
                <Dumbbell className="w-3 h-3 text-lime-400" /> PHOTO 0{idx + 1}
              </div>

              {/* Zoom Button */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cyan-400 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 font-bold">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-0 inset-x-0 p-5 transform transition-transform duration-300">
                <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-xs mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-5xl w-full max-h-[90vh] bg-gym-card rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl flex flex-col">
            <div className="relative flex-1 overflow-hidden bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>
            <div className="p-6 bg-gym-card border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white font-heading">{selectedPhoto.title}</h3>
                <p className="text-slate-400 text-sm">{selectedPhoto.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                  {GYM_CONFIG.LOCATION.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
