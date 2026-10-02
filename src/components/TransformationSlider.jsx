import React, { useState, useRef, useEffect } from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import { Sparkles, MoveHorizontal, Flame, Award } from 'lucide-react';

export default function TransformationSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeAfterIdx, setActiveAfterIdx] = useState(0);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const transformations = GYM_CONFIG.TRANSFORMATION_PHOTOS.list;
  const currentTrans = transformations[activeAfterIdx];

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section id="transformations" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-4 h-4" /> Real Results, Real Bodies
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">3D Transformations</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Drag the interactive slider below to reveal the drastic physique shifts achieved under master coaching.
          </p>
        </div>

        {/* Transformation Stage Selector */}
        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {transformations.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveAfterIdx(idx)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeAfterIdx === idx
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold shadow-lg shadow-cyan-500/25 scale-105'
                  : 'bg-gym-card text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Flame className="w-4 h-4 text-lime-400" />
              {item.name} ({item.duration})
            </button>
          ))}
        </div>

        {/* Interactive Before/After Card */}
        <div className="bg-gym-card/80 border border-white/10 rounded-3xl p-4 md:p-8 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto">
          
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[380px] md:h-[500px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/20 shadow-inner"
          >
            {/* AFTER Image (Full background) */}
            <img
              src={currentTrans.after}
              alt="After Transformation"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />
            <div className="absolute top-4 right-4 bg-lime-400 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
              AFTER ({currentTrans.duration})
            </div>

            {/* BEFORE Image (Clipped overlay) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={currentTrans.before}
                alt="Before Transformation"
                className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                BEFORE
              </div>
            </div>

            {/* SLIDER DIVIDER LINE */}
            <div
              className="absolute inset-y-0 w-1 bg-gradient-to-b from-cyan-400 via-white to-lime-400 pointer-events-none z-20 shadow-[0_0_15px_rgba(0,240,255,1)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-cyan-400 text-black font-bold flex items-center justify-center border-2 border-white shadow-xl">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Metric details */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">{currentTrans.result}</h4>
                <p className="text-slate-400 text-xs">Achieved in {currentTrans.duration} at {GYM_CONFIG.GYM_SHORT_NAME} New Delhi</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 italic">
              * Individual results may vary based on personal commitment and dietary adherence.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
