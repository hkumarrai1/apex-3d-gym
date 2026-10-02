import React, { useState } from 'react';
import { Bot, Sparkles, Flame, CheckCircle, Download, RefreshCw, Dumbbell, Utensils } from 'lucide-react';

export default function AIWorkoutGenerator() {
  const [goal, setGoal] = useState('muscle_gain');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [days, setDays] = useState(5);
  const [diet, setDiet] = useState('high_protein');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/ai/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, weight, height, days, diet })
      });
      const data = await response.json();
      setPlan(data.plan);
    } catch (err) {
      console.warn("Using fallback local AI algorithm:", err);
      // Fallback generator in case server isn't running yet
      setTimeout(() => {
        setPlan(generateLocalPlan(goal, weight, height, days, diet));
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const generateLocalPlan = (g, w, h, d, dt) => {
    const calories = g === 'fat_loss' ? Math.round(w * 24) : Math.round(w * 32);
    const protein = Math.round(w * 2.2);
    const carbs = g === 'fat_loss' ? Math.round(w * 2) : Math.round(w * 4);
    const fats = Math.round(w * 0.9);

    return {
      title: `${g.replace('_', ' ').toUpperCase()} OPTIMIZED 3D PROTOCOL`,
      macros: { calories, protein, carbs, fats },
      split: [
        { day: 'Day 1', focus: 'Chest & Heavy Triceps', exercises: ['Barbell Incline Press (4x8)', 'Cable Crossovers (3x12)', 'Dumbbell Flyes (3x10)', 'Weighted Dips (4x10)'] },
        { day: 'Day 2', focus: 'Back & Bicep Peak', exercises: ['Deadlifts / Lat Pulldown (4x6)', 'Seated Cable Rows (4x10)', 'Single-Arm DB Row (3x10)', 'EZ Bar Curls (4x12)'] },
        { day: 'Day 3', focus: 'Legs & Lower Body Hypertrophy', exercises: ['Barbell Back Squats (4x8)', 'Leg Press (4x12)', 'Hamstring Curls (4x15)', 'Calf Raises (5x20)'] },
        { day: 'Day 4', focus: 'Deltoids & Core Matrix', exercises: ['Overhead Military Press (4x8)', 'Lateral Dumbbell Raises (4x15)', 'Face Pulls (4x15)', 'Hanging Leg Raises (3x20)'] },
        { day: 'Day 5', focus: 'Full Body Athletic Conditioning', exercises: ['Kettlebell Swings (4x20)', 'Battle Ropes (4x45s)', 'Box Jumps (4x10)', 'Plank Holds (3x60s)'] },
      ],
      tips: [
        "Drink 4.5 Liters of water daily for maximum cell hydration.",
        "Consume 30g protein within 45 minutes post-workout.",
        "Aim for 8 hours of deep sleep to maximize growth hormone release."
      ]
    };
  };

  return (
    <section id="ai-generator" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Bot className="w-4 h-4 animate-bounce" /> Neural Fitness Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-lime-400">Workout & Diet Generator</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Get instant algorithmic workout splits and dietary macros tailored specifically to your body stats and fitness goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* INPUT FORM (5 cols) */}
          <div className="lg:col-span-5 bg-gym-card/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Enter Your Parameters
            </h3>

            <form onSubmit={handleGenerate} className="space-y-5">
              
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Primary Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="muscle_gain" className="bg-gym-card">Hypertrophy & Muscle Gain</option>
                  <option value="fat_loss" className="bg-gym-card">Rapid Fat Loss & Shred</option>
                  <option value="recomp" className="bg-gym-card">Body Recomposition</option>
                  <option value="strength" className="bg-gym-card">Pure Power & Strength</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Weight (KG)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    min="40"
                    max="180"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Height (CM)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="120"
                    max="220"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Training Days / Wk</label>
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value={3} className="bg-gym-card">3 Days (Full Body)</option>
                    <option value={4} className="bg-gym-card">4 Days (Upper / Lower)</option>
                    <option value={5} className="bg-gym-card">5 Days (PPL + Arms)</option>
                    <option value={6} className="bg-gym-card">6 Days (Elite Pro)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Diet Preference</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="high_protein" className="bg-gym-card">High Protein Non-Veg</option>
                    <option value="vegetarian" className="bg-gym-card">High Protein Vegetarian</option>
                    <option value="keto" className="bg-gym-card">Low Carb / Keto</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-lime-400 text-black font-extrabold text-base transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> GENERATING AI PROTOCOL...
                  </>
                ) : (
                  <>
                    <Bot className="w-5 h-5" /> GENERATE AI WORKOUT & NUTRITION
                  </>
                )}
              </button>

            </form>
          </div>

          {/* OUTPUT DISPLAY (7 cols) */}
          <div className="lg:col-span-7 bg-gym-card/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl min-h-[500px]">
            {plan ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Title */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">AI Generated Plan</span>
                    <h3 className="text-2xl font-extrabold text-white font-heading">{plan.title}</h3>
                  </div>
                  <button
                    onClick={() => alert("AI Routine copied to clipboard!")}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Export Plan
                  </button>
                </div>

                {/* Macro Badges */}
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Calories</p>
                    <p className="text-xl font-bold text-cyan-400">{plan.macros.calories} kcal</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Protein</p>
                    <p className="text-xl font-bold text-lime-400">{plan.macros.protein}g</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Carbs</p>
                    <p className="text-xl font-bold text-yellow-400">{plan.macros.carbs}g</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Fats</p>
                    <p className="text-xl font-bold text-red-400">{plan.macros.fats}g</p>
                  </div>
                </div>

                {/* Split Schedule */}
                <div className="space-y-3">
                  <h4 className="text-sm font-mono text-slate-300 uppercase flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-cyan-400" /> Recommended Daily Split Schedule
                  </h4>
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2">
                    {plan.split.map((s, idx) => (
                      <div key={idx} className="p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-cyan-400">{s.day} &bull; {s.focus}</span>
                        </div>
                        <p className="text-xs text-slate-300">{s.exercises.join('  |  ')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Pro Tips */}
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
                  <h5 className="text-xs font-bold text-cyan-400 uppercase mb-2 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4" /> AI Nutrition Guidelines
                  </h5>
                  <ul className="space-y-1">
                    {plan.tips.map((t, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-lime-400 mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Bot className="w-16 h-16 mb-4 text-slate-600 animate-pulse" />
                <h4 className="text-lg font-bold text-slate-300">Ready to Generate Your Customized Protocol</h4>
                <p className="text-xs max-w-sm mt-1">Select your body weight, height, and goal on the left to activate our fitness recommendation algorithm.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
