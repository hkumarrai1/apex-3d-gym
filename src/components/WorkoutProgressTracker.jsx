import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Bot, Sparkles, Play, Pause, RotateCcw, CheckCircle2, ChevronRight, Trophy, Flame, Clock, Award, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WorkoutProgressTracker({ user }) {
  const [selectedMuscle, setSelectedMuscle] = useState('Chest');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [weekNumber, setWeekNumber] = useState(1);
  const [goal, setGoal] = useState('Hypertrophy & Size');
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState(null);
  const [activeExIdx, setActiveExIdx] = useState(0);

  // Live Workout Session State
  const [completedSets, setCompletedSets] = useState({});
  const [loggedWeights, setLoggedWeights] = useState({});

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const muscleGroups = [
    { name: 'Chest', icon: '⚡' },
    { name: 'Back', icon: '🦅' },
    { name: 'Shoulders', icon: '🛡️' },
    { name: 'Legs', icon: '🦵' },
    { name: 'Arms', icon: '💪' },
    { name: 'Core', icon: '🔥' }
  ];

  // Rest Countdown Timer Effect
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerSeconds]);

  const startTimer = (seconds = 60) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const handleGenerateRoutine = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setCompletedSets({});
    setActiveExIdx(0);

    try {
      const res = await fetch('/api/workout/dynamic-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          muscleGroup: selectedMuscle,
          experienceLevel,
          weekNumber,
          goal
        })
      });
      const data = await res.json();
      if (data.workout) {
        setRoutine(data.workout);
      }
    } catch (err) {
      console.warn("Failed to fetch routine from API:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSetComplete = (exId, setNum, defaultRest = 60) => {
    const key = `${exId}_set_${setNum}`;
    const wasCompleted = !!completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: !wasCompleted }));

    if (!wasCompleted) {
      // Auto trigger rest timer
      startTimer(defaultRest);
    }
  };

  const handleFinishWorkout = async () => {
    try {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      await fetch('/api/workout/log-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user ? user.id || user._id : 'usr_demo',
          benchPress: selectedMuscle === 'Chest' ? loggedWeights['ex-1_set_3'] || 85 : undefined,
          squats: selectedMuscle === 'Legs' ? loggedWeights['leg-1_set_3'] || 115 : undefined,
          sessionSummary: `${selectedMuscle} Week ${weekNumber} Session Completed`
        })
      });
      alert(`🎉 Fantastic Job! Your ${selectedMuscle} session has been saved to your account!`);
    } catch (e) {
      console.error(e);
    }
  };

  const currentExercise = routine?.exercises?.[activeExIdx];

  return (
    <section id="ai-tracker" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase">
            <Bot className="w-4 h-4 animate-bounce" /> Dynamic AI Single-Muscle Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
            Adaptive <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-lime-400">Workout & Rep Tracker</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Target specific muscle groups with dynamically generated progressive rep schemes (e.g. 12 &rarr; 10 &rarr; 8 reps), weekly exercise variations, and live interactive rest timers.
          </p>
        </div>

        {/* 1. Muscle Selector Pills */}
        <div className="flex justify-center flex-wrap gap-2.5 mb-8">
          {muscleGroups.map(m => (
            <button
              key={m.name}
              onClick={() => setSelectedMuscle(m.name)}
              className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                selectedMuscle === m.name
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/30 scale-105'
                  : 'bg-gym-card text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.name} Focus</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (4 cols) */}
          <div className="lg:col-span-4 bg-gym-card/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-400" /> Session Configuration
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Cycle Week (Progression)</label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-cyan-400"
              >
                <option value={1} className="bg-gym-card">Week 1 - Strength & Volume Foundation</option>
                <option value={2} className="bg-gym-card">Week 2 - Mechanical Tension & Angles</option>
                <option value={3} className="bg-gym-card">Week 3 - Heavy Overload & Intensity</option>
                <option value={4} className="bg-gym-card">Week 4 - Deload / Peak Hypertrophy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Training Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-cyan-400"
              >
                <option value="Hypertrophy & Size" className="bg-gym-card">Hypertrophy & Muscle Density</option>
                <option value="Strength & Power" className="bg-gym-card">Pure Strength & Explosive Power</option>
                <option value="Fat Loss & Endurance" className="bg-gym-card">Fat Burn & High Volume Conditioning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-cyan-400"
              >
                <option value="Beginner" className="bg-gym-card">Beginner (1-2 Years)</option>
                <option value="Intermediate" className="bg-gym-card">Intermediate (2-4 Years)</option>
                <option value="Advanced" className="bg-gym-card">Elite / Advanced (5+ Years)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateRoutine}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-lime-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              {loading ? 'GENERATING PROTOCOL...' : '⚡ GENERATE ADAPTIVE ROUTINE'}
            </button>

            {/* In-Dashboard Live Rest Timer Widget */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Rest Countdown Timer
                </span>
                <span className={`text-2xl font-extrabold font-mono ${timerSeconds <= 10 && timerRunning ? 'text-red-400 animate-pulse' : 'text-lime-400'}`}>
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1"
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => startTimer(60)}
                  className="px-3 py-2 rounded-lg bg-cyan-400/20 text-cyan-400 font-mono text-xs hover:bg-cyan-400/30"
                >
                  60s
                </button>
                <button
                  onClick={() => startTimer(90)}
                  className="px-3 py-2 rounded-lg bg-lime-400/20 text-lime-400 font-mono text-xs hover:bg-lime-400/30"
                >
                  90s
                </button>
                <button
                  onClick={() => { setTimerRunning(false); setTimerSeconds(60); }}
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Workout Runner (8 cols) */}
          <div className="lg:col-span-8 bg-gym-card/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl min-h-[520px]">
            {routine ? (
              <div className="space-y-6">
                
                {/* Routine Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-lime-400 uppercase tracking-widest">
                      {routine.muscleTarget} &bull; Week {weekNumber} Protocol
                    </span>
                    <h3 className="text-2xl font-extrabold text-white font-heading mt-1">
                      {routine.routineTitle}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                      ⏱️ {routine.estimatedDurationMinutes} Mins
                    </span>
                  </div>
                </div>

                {/* Exercise Step Navigation Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {routine.exercises.map((ex, idx) => (
                    <button
                      key={ex.id || idx}
                      onClick={() => setActiveExIdx(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeExIdx === idx
                          ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/20'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <span>0{idx + 1}.</span> {ex.name.split('(')[0]}
                    </button>
                  ))}
                </div>

                {/* Active Exercise Detail Card */}
                {currentExercise && (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6 animate-fadeIn">
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                          Exercise 0{activeExIdx + 1} of {routine.exercises.length}
                        </span>
                        <span className="text-xs font-mono text-slate-400">Tempo: {currentExercise.tempo}</span>
                      </div>
                      <h4 className="text-xl md:text-2xl font-extrabold text-white font-heading mt-1">
                        {currentExercise.name}
                      </h4>
                      <p className="text-xs text-lime-400 font-mono mt-1">Equipment: {currentExercise.equipment}</p>
                      <p className="text-xs text-slate-300 mt-2 bg-black/40 p-3 rounded-xl border border-white/5">
                        💡 <strong>Biomechanical Form Tip:</strong> {currentExercise.formTip}
                      </p>
                    </div>

                    {/* Progressive Sets Checklist Table */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                        Progressive Reps & Set Execution Tracker
                      </h5>

                      <div className="space-y-2">
                        {currentExercise.sets.map((s) => {
                          const key = `${currentExercise.id}_set_${s.setNumber}`;
                          const isDone = !!completedSets[key];

                          return (
                            <div
                              key={s.setNumber}
                              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                                isDone
                                  ? 'bg-lime-400/10 border-lime-400/40 text-white'
                                  : 'bg-black/40 border-white/10 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-white/5 font-mono font-bold text-xs flex items-center justify-center text-cyan-400">
                                  S{s.setNumber}
                                </span>
                                <div>
                                  <span className="font-bold text-sm text-white">Target: {s.targetReps} Reps</span>
                                  <span className="text-xs text-slate-400 font-mono ml-3">Rest: {s.restSeconds}s</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="text-slate-400">Weight:</span>
                                  <input
                                    type="number"
                                    placeholder={`${s.targetWeightKg}kg`}
                                    defaultValue={s.targetWeightKg}
                                    onChange={(e) => setLoggedWeights({ ...loggedWeights, [key]: e.target.value })}
                                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-center text-white text-xs"
                                  />
                                  <span className="text-slate-400 font-mono">KG</span>
                                </div>

                                <button
                                  onClick={() => toggleSetComplete(currentExercise.id, s.setNumber, s.restSeconds)}
                                  className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 ${
                                    isDone
                                      ? 'bg-lime-400 text-black shadow-md shadow-lime-400/20'
                                      : 'bg-white/10 hover:bg-cyan-400 hover:text-black text-white'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {isDone ? 'Completed' : 'Mark Done'}
                                </button>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <button
                        disabled={activeExIdx === 0}
                        onClick={() => setActiveExIdx(prev => Math.max(0, prev - 1))}
                        className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 disabled:opacity-30 text-xs font-bold"
                      >
                        &larr; Previous Exercise
                      </button>

                      {activeExIdx < routine.exercises.length - 1 ? (
                        <button
                          onClick={() => setActiveExIdx(prev => prev + 1)}
                          className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-md shadow-cyan-400/20"
                        >
                          Next Exercise <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleFinishWorkout}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-lg shadow-lime-400/30"
                        >
                          <Trophy className="w-4 h-4" /> Complete & Save Session
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 min-h-[400px]">
                <Dumbbell className="w-16 h-16 mb-4 text-slate-600 animate-pulse" />
                <h4 className="text-xl font-bold text-white font-heading">
                  Select a Muscle Group & Click Generate
                </h4>
                <p className="text-xs max-w-md mt-2 text-slate-400">
                  Our Gemini-powered engine will design a custom single-muscle protocol with progressive reps (12 &rarr; 10 &rarr; 8) and week-to-week variations.
                </p>
                <button
                  onClick={() => handleGenerateRoutine()}
                  className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20"
                >
                  Start {selectedMuscle} Routine Now
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
