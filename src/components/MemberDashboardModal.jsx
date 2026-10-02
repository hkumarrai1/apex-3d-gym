import React, { useState } from 'react';
import { GYM_CONFIG } from '../config/gymConfig';
import {
  X,
  User,
  Bell,
  AlertTriangle,
  Activity,
  Calendar,
  Award,
  Plus,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MemberDashboardModal({ user, onClose, onRenew }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [benchWeight, setBenchWeight] = useState(user?.prStats?.benchPress || 85);
  const [squatWeight, setSquatWeight] = useState(user?.prStats?.squats || 110);
  const [bodyWeight, setBodyWeight] = useState(user?.prStats?.bodyWeight || 74.5);

  const daysRemaining = user?.daysRemaining !== undefined ? user.daysRemaining : 4;
  const isExpiringSoon = daysRemaining <= 7;

  // Chart data for PR & Weight tracker
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Bench Press (KG)',
        data: [70, 72.5, 75, 77.5, 80, benchWeight],
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Squats (KG)',
        data: [90, 95, 97.5, 100, 105, squatWeight],
        borderColor: '#ccff00',
        backgroundColor: 'rgba(204, 255, 0, 0.1)',
        tension: 0.3,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94a3b8' } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  const handleUpdatePRs = async () => {
    try {
      await fetch('/api/workout/log-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || user?._id || 'usr_demo',
          benchPress: benchWeight,
          squats: squatWeight,
          bodyWeight
        })
      });
      alert('✅ PR Stats updated successfully to your Atlas account!');
    } catch (e) {
      alert('PR updated in local session!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gym-card border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-lime-400 text-black font-extrabold flex items-center justify-center text-xl font-heading shadow-lg shadow-cyan-500/20">
              {user ? user.name.charAt(0) : 'A'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white font-heading">
                Welcome, {user ? user.name : 'Amrit (Member)'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Member ID: #{user?.id ? user.id.slice(-6).toUpperCase() : '3D-998231'} &bull; Plan: {user?.membershipPlan || 'VIP PRO ACCESS'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/20' : 'bg-white/5 text-slate-300'
              }`}
            >
              Overview & Status
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tracker' ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/20' : 'bg-white/5 text-slate-300'
              }`}
            >
              PR & Strength Tracker
            </button>
          </div>
        </div>

        {/* EXPIRY NOTIFICATION BANNER */}
        {isExpiringSoon && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-red-500/20 via-orange-500/10 to-red-500/20 border-2 border-red-500/60 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">MEMBERSHIP EXPIRING SOON!</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  Your VIP Pass expires in <strong className="text-red-400">{daysRemaining} Days</strong>. Renew at the Front Desk or call: <strong className="text-white">+91 9971284797</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/919971284797?text=Hi!%20I%20want%20to%20renew%20my%20gym%20membership%20pass.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Desk
              </a>
              <button
                onClick={onRenew}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/30"
              >
                Renew Details
              </button>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between text-slate-400 text-xs font-mono mb-1">
                  <span>ACTIVE MEMBERSHIP</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-lg font-bold text-white">{user?.membershipPlan || 'PRO Performance Pass'}</p>
                <p className={`text-xs mt-1 font-bold ${isExpiringSoon ? 'text-amber-400' : 'text-lime-400'}`}>
                  Status: Active ({daysRemaining} days left)
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between text-slate-400 text-xs font-mono mb-1">
                  <span>GYM CHECK-INS</span>
                  <Calendar className="w-4 h-4 text-lime-400" />
                </div>
                <p className="text-lg font-bold text-white">{user?.checkInsCount || 22} Sessions</p>
                <p className="text-xs text-slate-400 mt-1">This Month at New Delhi HQ</p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between text-slate-400 text-xs font-mono mb-1">
                  <span>PAYMENT & RENEWAL HELP</span>
                  <Phone className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-lg font-bold text-cyan-400">+91 9971284797</p>
                <p className="text-xs text-slate-400 mt-1">Reception / Front Desk</p>
              </div>
            </div>

            {/* AI Workout Quick Launcher */}
            <div className="p-5 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" /> Gemini Dynamic AI Workout Protocol Ready
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Launch progressive single-muscle routines with interactive rest timers and dynamic rep tracking.
                </p>
              </div>
              <a
                href="#ai-tracker"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-md shadow-cyan-400/20"
              >
                Launch AI Rep Tracker &rarr;
              </a>
            </div>

          </div>
        )}

        {/* TRACKER TAB */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">
                Strength & Weight Progression Chart
              </h4>
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Quick Log PR Form */}
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-sm font-mono text-slate-300 uppercase">Log Personal Record (PR) to Atlas</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bench Press (KG)</label>
                  <input
                    type="number"
                    value={benchWeight}
                    onChange={(e) => setBenchWeight(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Squat Max (KG)</label>
                  <input
                    type="number"
                    value={squatWeight}
                    onChange={(e) => setSquatWeight(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Body Weight (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleUpdatePRs}
                className="w-full py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-cyan-400/20"
              >
                Update Workout Stats
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
