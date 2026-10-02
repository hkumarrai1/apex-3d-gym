import React from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import { Instagram, Heart, MessageCircle, ExternalLink, Play } from 'lucide-react';

export default function InstaFeed() {
  const posts = [
    {
      id: 'ig-1',
      image: GYM_CONFIG.GYM_PHOTOS[0].url,
      likes: '1,420',
      comments: '88',
      caption: 'Heavy dumbbell rows session at New Delhi HQ! 🔥 Who is smashing back today? #Apex3DGym',
      type: 'image'
    },
    {
      id: 'ig-2',
      image: GYM_CONFIG.TRANSFORMATION_PHOTOS.after1,
      likes: '2,950',
      comments: '164',
      caption: '12-week fat loss transformation under master coach Amrit Dwivedi! 🏆 #FitnessGoal',
      type: 'image'
    },
    {
      id: 'ig-3',
      image: GYM_CONFIG.GYM_PHOTOS[1].url,
      likes: '890',
      comments: '45',
      caption: 'Late night cardio grind under cyber neon lights. Open till 10:30 PM! ⚡',
      type: 'image'
    },
    {
      id: 'ig-4',
      image: GYM_CONFIG.GYM_PHOTOS[2].url,
      likes: '3,120',
      comments: '210',
      caption: 'New Olympic squat cages delivered to sector 12 Dwarka branch! Come hit your PRs.',
      type: 'image'
    }
  ];

  return (
    <section id="instafeed" className="py-20 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono uppercase tracking-widest">
              <Instagram className="w-4 h-4" /> Live Social Feed
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white mt-2">
              Follow Us on <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400">Instagram</span>
            </h2>
          </div>
          
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-transform shrink-0 shadow-lg shadow-pink-500/25"
          >
            <Instagram className="w-4 h-4" /> @apex3d_gym_delhi <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gym-card border border-white/10 rounded-2xl overflow-hidden group hover:border-pink-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-black">
                <img
                  src={post.image}
                  alt="Insta Post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Hover overlay with likes */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5" /> {post.comments}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-300 line-clamp-2">{post.caption}</p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-white/5">
                  <span>NEW DELHI HQ</span>
                  <span className="text-pink-400 font-bold">#APEX3D</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
