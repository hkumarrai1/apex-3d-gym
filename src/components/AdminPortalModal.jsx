import React, { useState, useEffect } from 'react';
import { useGymConfig } from '../context/GymConfigContext';
import {
  X,
  Shield,
  Lock,
  User,
  Users,
  MessageSquare,
  Calendar,
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Database,
  Bot,
  LogOut,
  Clock,
  Settings,
  Save,
  RotateCcw,
  MapPin,
  Globe,
  Award,
  Image,
  CreditCard,
  Tag
} from 'lucide-react';

export default function AdminPortalModal({ onClose }) {
  const { config: globalConfig, updateConfig, resetConfig, loading: configLoading } = useGymConfig();

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('gym_admin_auth') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [inquiries, setInquiries] = useState({ bookings: [], trialPasses: [] });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // CMS Brand Settings Form State
  const [cmsForm, setCmsForm] = useState(globalConfig);
  const [savingCms, setSavingCms] = useState(false);

  // Keep cmsForm synced with globalConfig
  useEffect(() => {
    if (globalConfig) {
      setCmsForm(globalConfig);
    }
  }, [globalConfig]);

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState('Pro Performance 3-Month');
  const [newMemberStartDate, setNewMemberStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMemberEndDate, setNewMemberEndDate] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newMemberCoach, setNewMemberCoach] = useState('');
  const [sendWelcomeWhatsapp, setSendWelcomeWhatsapp] = useState(true);
  const [creatingMember, setCreatingMember] = useState(false);

  // Set default coach to founder when cmsForm is loaded
  useEffect(() => {
    if (!newMemberCoach && cmsForm?.OWNER?.name) {
      setNewMemberCoach(cmsForm.OWNER.name);
    }
  }, [cmsForm, newMemberCoach]);

  // Edit Member Dates State
  const [editingMember, setEditingMember] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editPlan, setEditPlan] = useState('');

  // Manual WhatsApp Composer State
  const [selectedMember, setSelectedMember] = useState(null);
  const [customMsg, setCustomMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgLogs, setMsgLogs] = useState([]);

  // Automated Expiry Trigger State
  const [triggeringAuto, setTriggeringAuto] = useState(false);
  const [autoResult, setAutoResult] = useState(null);

  // System Health
  const [health, setHealth] = useState(null);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.message || 'Invalid username or password.');
        return;
      }

      setIsAdminAuthenticated(true);
      sessionStorage.setItem('gym_admin_auth', 'true');
      fetchAdminData();
    } catch (err) {
      setAuthError('Server communication error. Check server logs.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('gym_admin_auth');
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, inqRes, healthRes] = await Promise.all([
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/inquiries').then(r => r.json()),
        fetch('/api/health').then(r => r.json())
      ]);

      if (usersRes.users) setMembers(usersRes.users);
      if (inqRes) setInquiries(inqRes);
      if (healthRes) setHealth(healthRes);
    } catch (err) {
      console.warn("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated]);

  // Handle Add Member
  const handleCreateMember = async (e) => {
    e.preventDefault();
    setCreatingMember(true);

    try {
      const res = await fetch('/api/admin/members/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMemberName,
          phone: newMemberPhone,
          email: newMemberEmail,
          membershipPlan: newMemberPlan,
          startDate: newMemberStartDate,
          endDate: newMemberEndDate,
          assignedCoach: newMemberCoach,
          welcomeWhatsapp: sendWelcomeWhatsapp
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Error adding member: " + data.message);
        return;
      }

      alert(`✅ Member "${newMemberName}" added successfully!`);
      setShowAddMemberModal(false);
      // Reset form
      setNewMemberName('');
      setNewMemberPhone('');
      setNewMemberEmail('');
      fetchAdminData();
    } catch (err) {
      alert("Failed to add member: " + err.message);
    } finally {
      setCreatingMember(false);
    }
  };

  // Handle Edit Member Dates
  const handleUpdateMemberDates = async (e) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      const res = await fetch('/api/admin/members/update-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: editingMember._id || editingMember.id,
          startDate: editStartDate,
          endDate: editEndDate,
          membershipPlan: editPlan
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Error updating member: " + data.message);
        return;
      }

      alert("✅ Membership dates updated successfully!");
      setEditingMember(null);
      fetchAdminData();
    } catch (err) {
      alert("Failed to update dates: " + err.message);
    }
  };

  // Handle Delete Member
  const handleDeleteMember = async (memberId, name) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;

    try {
      await fetch('/api/admin/members/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
      });
      fetchAdminData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // Handle Send Individual WhatsApp
  const handleSendWhatsApp = async (e) => {
    e.preventDefault();
    if (!selectedMember || !customMsg) return;

    setSendingMsg(true);
    try {
      const res = await fetch('/api/admin/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedMember.phone,
          messageText: customMsg,
          memberName: selectedMember.name
        })
      });
      const data = await res.json();
      setMsgLogs(prev => [
        {
          to: selectedMember.name,
          phone: selectedMember.phone,
          text: customMsg,
          time: new Date().toLocaleTimeString(),
          success: data.success,
          mode: data.mode
        },
        ...prev
      ]);
      alert(`✅ WhatsApp Message Dispatched to ${selectedMember.name}!`);
      setSelectedMember(null);
      setCustomMsg('');
    } catch (err) {
      alert("Failed to send WhatsApp message: " + err.message);
    } finally {
      setSendingMsg(false);
    }
  };

  // Handle Trigger Automated Expiry Reminders
  const handleTriggerExpiryReminders = async () => {
    setTriggeringAuto(true);
    setAutoResult(null);
    try {
      const res = await fetch('/api/admin/trigger-expiry-reminders', { method: 'POST' });
      const data = await res.json();
      setAutoResult(data);
    } catch (err) {
      alert("Failed to trigger automated reminders: " + err.message);
    } finally {
      setTriggeringAuto(false);
    }
  };

  // CMS Mutator Helpers
  const updateCmsField = (field, value) => {
    setCmsForm(prev => ({ ...prev, [field]: value }));
  };

  const updateCmsNested = (parent, field, value) => {
    setCmsForm(prev => ({
      ...prev,
      [parent]: {
        ...prev?.[parent],
        [field]: value
      }
    }));
  };

  const updateTrainerField = (index, field, value) => {
    setCmsForm(prev => {
      const trainers = [...(prev?.TRAINERS || [])];
      trainers[index] = { ...trainers[index], [field]: value };
      return { ...prev, TRAINERS: trainers };
    });
  };

  const updatePlanField = (index, field, value) => {
    setCmsForm(prev => {
      const plans = [...(prev?.MEMBERSHIP_PLANS || [])];
      if (!plans[index]) plans[index] = {};
      plans[index] = { ...plans[index], [field]: value };
      return { ...prev, MEMBERSHIP_PLANS: plans };
    });
  };

  const updatePlanFeatures = (index, featuresString) => {
    setCmsForm(prev => {
      const plans = [...(prev?.MEMBERSHIP_PLANS || [])];
      if (!plans[index]) plans[index] = {};
      const features = featuresString.split('\n').filter(f => f.trim().length > 0);
      plans[index] = { ...plans[index], features };
      return { ...prev, MEMBERSHIP_PLANS: plans };
    });
  };

  const handleQuickSavePrices = async () => {
    setSavingCms(true);
    try {
      const res = await updateConfig(cmsForm);
      if (res && res.success) {
        alert("✅ Membership pricing updated live across the entire website!");
      } else {
        alert("⚠️ Failed to update prices: " + (res?.error || 'Unknown error'));
      }
    } catch (err) {
      alert("Error saving prices: " + err.message);
    } finally {
      setSavingCms(false);
    }
  };

  const handleSaveCmsConfig = async (e) => {
    if (e) e.preventDefault();
    setSavingCms(true);
    try {
      const res = await updateConfig(cmsForm);
      if (res && res.success) {
        alert("✅ Brand details, Founder, Trainers and Contacts saved! Updated across the entire website.");
      } else {
        alert("⚠️ Failed to update website settings: " + (res?.error || 'Unknown error'));
      }
    } catch (err) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSavingCms(false);
    }
  };

  const handleResetCmsConfig = async () => {
    if (!confirm("Are you sure you want to restore default brand settings?")) return;
    setSavingCms(true);
    try {
      await resetConfig();
      alert("🔄 Website brand settings restored to default!");
    } catch (err) {
      alert("Error resetting config: " + err.message);
    } finally {
      setSavingCms(false);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone?.includes(searchQuery) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'expiring') return (m.daysRemaining || 0) <= 7 && (m.daysRemaining || 0) > 0;
    if (filterStatus === 'expired') return (m.daysRemaining || 0) === 0;
    if (filterStatus === 'active') return (m.daysRemaining || 0) > 7;
    return true;
  });

  const expiringCount = members.filter(m => (m.daysRemaining || 0) <= 7 && (m.daysRemaining || 0) > 0).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-6xl w-full max-h-[92vh] overflow-y-auto bg-gym-card border border-purple-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(168,85,247,0.25)] relative flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2.5 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* ========================================================================= */}
        {/* 1. AUTHENTICATION GATE (If not logged in as Admin) */}
        {/* ========================================================================= */}
        {!isAdminAuthenticated ? (
          <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6 animate-fadeIn text-center">
            
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/30">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                Protected Route &bull; Admin Clearance Required
              </span>
              <h2 className="text-3xl font-extrabold text-white font-heading mt-3">
                Apex 3D Admin Portal
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your secure Admin credentials configured in <code className="text-purple-300 font-mono">.env</code>
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Admin Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xs focus:border-purple-400"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-xs focus:border-purple-400"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 mt-4"
              >
                {authLoading ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE & ACCESS PORTAL'}
              </button>
            </form>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-slate-400 text-center">
              💡 Configured in: <span className="text-purple-400 font-mono">.env (ADMIN_USERNAME & ADMIN_PASSWORD)</span>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* 2. AUTHENTICATED ADMIN DASHBOARD */
          /* ========================================================================= */
          <div className="space-y-6">
            
            {/* Top Header & System Badges */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 text-black flex items-center justify-center font-extrabold shadow-lg shadow-purple-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-white font-heading">
                      Apex 3D Admin Control Center
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold">
                      Authenticated
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Member Registry &bull; Joining/End Date Scheduler &bull; Twilio WhatsApp Engine
                  </p>
                </div>
              </div>

              {/* Status and Logout */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  {health?.database?.includes('Atlas') ? 'Atlas Connected' : 'In-Memory DB'}
                </span>
                
                {expiringCount > 0 && (
                  <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5 font-bold animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" /> {expiringCount} Expiring Soon
                  </span>
                )}

                <button
                  onClick={handleAdminLogout}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 transition-colors flex items-center gap-1.5"
                  title="Log out of Admin"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </div>

            {/* Navigation Tabs + Add Member CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'members'
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Users className="w-4 h-4" /> Member Directory ({members.length})
                </button>

                <button
                  onClick={() => setActiveTab('twilio')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'twilio'
                      ? 'bg-lime-400 text-black shadow-md shadow-lime-400/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" /> Twilio WhatsApp Automation
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'inquiries'
                      ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Trainer Bookings & Trial Passes
                </button>

                <button
                  onClick={() => setActiveTab('cms')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'cms'
                      ? 'bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white shadow-md shadow-fuchsia-500/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Settings className="w-4 h-4" /> ⚙️ Brand & CMS Settings
                </button>
              </div>

              {/* + Add New Member Button */}
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" /> Add New Member
              </button>
            </div>

            {/* TAB 1: MEMBERS DIRECTORY & DASHBOARD */}
            {activeTab === 'members' && (
              <div className="space-y-6">

                {/* LIVE MEMBERSHIP PRICING CONTROL ON DASHBOARD */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-black border border-cyan-500/30 shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shadow-md shadow-cyan-500/10">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white font-heading">
                            Live Membership Pricing Control
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 font-mono text-[9px] font-bold">
                            Live Reactive
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Change plan prices & billing cycles directly here. Updates reflect live across the entire website instantly.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleQuickSavePrices}
                      disabled={savingCms}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-lime-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform shrink-0 self-start sm:self-auto"
                    >
                      {savingCms ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" /> Save Pricing Live
                        </>
                      )}
                    </button>
                  </div>

                  {/* 3 Quick Editable Pricing Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {(cmsForm?.MEMBERSHIP_PLANS || []).map((plan, idx) => (
                      <div key={plan.id || idx} className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2 hover:border-cyan-500/40 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate">{plan.name}</span>
                          {plan.popular && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-400 text-black">
                              POPULAR
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase">Price</label>
                            <input
                              type="text"
                              value={plan.price || ''}
                              onChange={(e) => updatePlanField(idx, 'price', e.target.value)}
                              placeholder="₹1,999"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-lime-400 font-bold font-mono focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase">Billing Period</label>
                            <input
                              type="text"
                              value={plan.period || ''}
                              onChange={(e) => updatePlanField(idx, 'period', e.target.value)}
                              placeholder="/ month"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-cyan-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search member by name, phone, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {['all', 'expiring', 'active', 'expired'].map(st => (
                      <button
                        key={st}
                        onClick={() => setFilterStatus(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                          filterStatus === st
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {st === 'expiring' ? 'Expiring (<7d)' : st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Members Table */}
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-4">Member Name</th>
                        <th className="p-4">Phone / WhatsApp</th>
                        <th className="p-4">Joining Date</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4">Days Left</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {filteredMembers.map((m, idx) => {
                        const days = m.daysRemaining !== undefined ? m.daysRemaining : 4;
                        const isExp = days <= 7 && days > 0;
                        const startDate = m.membershipStartDate ? new Date(m.membershipStartDate).toLocaleDateString() : 'N/A';
                        const endDate = m.membershipExpiryDate ? new Date(m.membershipExpiryDate).toLocaleDateString() : 'N/A';

                        return (
                          <tr key={m._id || m.id || idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-heading">
                                {m.name ? m.name.charAt(0) : 'M'}
                              </div>
                              <div>
                                <span>{m.name}</span>
                                <span className="block text-[10px] text-slate-400 font-normal">{m.membershipPlan || 'VIP Plan'}</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-cyan-400">
                              +91 {m.phone}
                            </td>
                            <td className="p-4 font-mono text-slate-300">
                              {startDate}
                            </td>
                            <td className="p-4 font-mono text-slate-300">
                              {endDate}
                            </td>
                            <td className="p-4 font-mono font-bold">
                              <span className={isExp ? 'text-red-400 animate-pulse' : days === 0 ? 'text-slate-500' : 'text-lime-400'}>
                                {days} Days
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                
                                {/* Edit Dates Button */}
                                <button
                                  onClick={() => {
                                    setEditingMember(m);
                                    setEditStartDate(m.membershipStartDate ? new Date(m.membershipStartDate).toISOString().split('T')[0] : '');
                                    setEditEndDate(m.membershipExpiryDate ? new Date(m.membershipExpiryDate).toISOString().split('T')[0] : '');
                                    setEditPlan(m.membershipPlan || 'Pro Performance 3-Month');
                                  }}
                                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                                  title="Edit Joining / Expiry Dates"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Separate WhatsApp Message Button */}
                                <button
                                  onClick={() => {
                                    setSelectedMember(m);
                                    setCustomMsg(`Hi ${m.name}! Your membership at Apex 3D Gym is valid until ${endDate}. Contact +91 9971284797 for renewals!`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-emerald-500/20"
                                >
                                  <MessageSquare className="w-3 h-3" /> WhatsApp
                                </button>

                                {/* Delete Member Button */}
                                <button
                                  onClick={() => handleDeleteMember(m._id || m.id, m.name)}
                                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                                  title="Delete Member"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 2: TWILIO WHATSAPP AUTOMATION */}
            {activeTab === 'twilio' && (
              <div className="space-y-6">
                
                {/* Auto Broadcast Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-lime-400/10 via-emerald-400/10 to-cyan-400/10 border-2 border-lime-400/40 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lime-400 font-mono text-xs uppercase tracking-widest">
                      <Sparkles className="w-4 h-4" /> Automated Broadcast Engine
                    </div>
                    <h3 className="text-2xl font-extrabold text-white font-heading">
                      Auto-Send Expiry WhatsApp Reminders
                    </h3>
                    <p className="text-slate-300 text-xs max-w-xl">
                      Scans all members in MongoDB Atlas whose membership expires within the next <strong>7 days</strong> and fires personalized WhatsApp renewal messages with front desk contact (+91 9971284797).
                    </p>
                  </div>

                  <button
                    onClick={handleTriggerExpiryReminders}
                    disabled={triggeringAuto}
                    className="px-6 py-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-lime-400/30 shrink-0 flex items-center gap-2"
                  >
                    {triggeringAuto ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {triggeringAuto ? 'DISPATCHING WHATSAPP ALERTS...' : '🚀 DISPATCH EXPIRY REMINDERS'}
                  </button>
                </div>

                {/* Auto Dispatch Results Log */}
                {autoResult && (
                  <div className="p-5 bg-white/5 border border-lime-400/30 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-lime-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {autoResult.message}
                      </h4>
                      <span className="text-xs font-mono text-slate-400">{autoResult.dispatchedCount} Dispatches</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {autoResult.details?.map((item, idx) => (
                        <div key={idx} className="p-3 bg-black/40 rounded-xl flex items-center justify-between text-xs font-mono">
                          <span className="text-white font-bold">{item.name} (+91 {item.phone})</span>
                          <span className="text-amber-400">{item.daysLeft} Days Remaining</span>
                          <span className="text-lime-400 font-bold">[{item.status}] - {item.mode}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual Dispatches History */}
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                    Recent WhatsApp Message Log
                  </h4>
                  {msgLogs.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {msgLogs.map((log, idx) => (
                        <div key={idx} className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 font-bold text-white">
                              <span>{log.to} ({log.phone})</span>
                              <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                            </div>
                            <p className="text-slate-300 mt-1">{log.text}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-lime-400/20 text-lime-400 font-mono text-[10px] rounded-md font-bold shrink-0">
                            {log.mode || 'SENT'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No manual messages dispatched during this session yet.</p>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: BOOKINGS & TRIAL INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Trainer Bookings */}
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" /> Trainer Session Bookings ({inquiries.bookings.length})
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {inquiries.bookings.map((b, idx) => (
                      <div key={b._id || b.id || idx} className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{b.trainerName}</span>
                          <span className="text-cyan-400 font-mono">{b.date} @ {b.time}</span>
                        </div>
                        <p className="text-xs text-slate-300">Goal: {b.goal}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-mono text-slate-400">Phone: +91 {b.userPhone}</span>
                          <a
                            href={`https://wa.me/91${b.userPhone}?text=Hi!%20Your%20session%20with%20${b.trainerName}%20is%20confirmed.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trial Passes */}
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-lime-400" /> 3-Day Free Trial Passes ({inquiries.trialPasses.length})
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {inquiries.trialPasses.map((p, idx) => (
                      <div key={p._id || p.id || idx} className="p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{p.name}</span>
                          <span className="text-lime-400 font-mono">{p.passCode || 'VIP-3DAY'}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-mono text-slate-400">Phone: +91 {p.phone} &bull; {p.date}</span>
                          <a
                            href={`https://wa.me/91${p.phone}?text=Hi%20${p.name}!%20Your%203-Day%20Free%20VIP%20Pass%20is%20active%20at%20Apex%203D%20Gym.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: BRAND & SITE CMS SETTINGS */}
            {activeTab === 'cms' && (
              <div className="space-y-6 animate-fadeIn text-xs">
                
                {/* Header Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-fuchsia-950/40 via-purple-950/40 to-black border border-fuchsia-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-fuchsia-500/20 text-fuchsia-400">
                        <Settings className="w-4 h-4" />
                      </span>
                      <h3 className="text-base font-bold text-white font-heading">
                        Dynamic Website CMS & Brand Control
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 font-mono text-[10px] font-bold">
                        Live Reactive
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Change Gym name, Founder bio/photo, 3 Trainers, address, and contacts below. Changes apply to the entire website immediately upon saving!
                    </p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      type="button"
                      onClick={handleResetCmsConfig}
                      disabled={savingCms}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5 font-bold text-xs"
                      title="Reset back to default preset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCmsConfig}
                      disabled={savingCms}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-fuchsia-500/30 hover:scale-105 transition-transform"
                    >
                      {savingCms ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" /> Save Changes Live
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveCmsConfig} className="space-y-6">
                  
                  {/* 1. BRAND IDENTITY */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-white font-bold font-heading text-sm">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> 1. Brand Identity & Headings
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Gym Full Name</label>
                        <input
                          type="text"
                          value={cmsForm?.GYM_NAME || ''}
                          onChange={(e) => updateCmsField('GYM_NAME', e.target.value)}
                          placeholder="APEX 3D Performance Gym"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Brand Short Name (Navbar / Badges)</label>
                        <input
                          type="text"
                          value={cmsForm?.GYM_SHORT_NAME || ''}
                          onChange={(e) => updateCmsField('GYM_SHORT_NAME', e.target.value)}
                          placeholder="APEX 3D"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Main Hero Tagline</label>
                        <input
                          type="text"
                          value={cmsForm?.TAGLINE || ''}
                          onChange={(e) => updateCmsField('TAGLINE', e.target.value)}
                          placeholder="Forge Elite Biomechanics in 3D Dimension"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Sub-Tagline / Banner Pill</label>
                        <input
                          type="text"
                          value={cmsForm?.SUB_TAGLINE || ''}
                          onChange={(e) => updateCmsField('SUB_TAGLINE', e.target.value)}
                          placeholder="Next-Gen 3D Biomechanics & AI Coaching"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. FOUNDER / OWNER DESK */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-white font-bold font-heading text-sm">
                      <Award className="w-4 h-4 text-lime-400" /> 2. Founder & Head Coach Details
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Founder / Owner Name</label>
                        <input
                          type="text"
                          value={cmsForm?.OWNER?.name || ''}
                          onChange={(e) => updateCmsNested('OWNER', 'name', e.target.value)}
                          placeholder="Amrit Dwivedi"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-lime-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Founder Designation / Role</label>
                        <input
                          type="text"
                          value={cmsForm?.OWNER?.role || ''}
                          onChange={(e) => updateCmsNested('OWNER', 'role', e.target.value)}
                          placeholder="Founder & Head Biomechanics Coach"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-lime-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Contact Phone (10 digits)</label>
                        <input
                          type="tel"
                          value={cmsForm?.OWNER?.phone || ''}
                          onChange={(e) => updateCmsNested('OWNER', 'phone', e.target.value)}
                          placeholder="9971284797"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-lime-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">WhatsApp Desk Number (with Country Code)</label>
                        <input
                          type="text"
                          value={cmsForm?.OWNER?.whatsapp || ''}
                          onChange={(e) => updateCmsNested('OWNER', 'whatsapp', e.target.value)}
                          placeholder="919971284797"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-lime-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          value={cmsForm?.OWNER?.email || ''}
                          onChange={(e) => updateCmsNested('OWNER', 'email', e.target.value)}
                          placeholder="amrit@apex3dgym.in"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-lime-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-slate-400 uppercase mb-1">Founder Photo URL</label>
                      <input
                        type="url"
                        value={cmsForm?.OWNER?.image || ''}
                        onChange={(e) => updateCmsNested('OWNER', 'image', e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-lime-400"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-slate-400 uppercase mb-1">Founder Bio / Description</label>
                      <textarea
                        rows={2}
                        value={cmsForm?.OWNER?.bio || ''}
                        onChange={(e) => updateCmsNested('OWNER', 'bio', e.target.value)}
                        placeholder="National Biomechanics Specialist & Elite Strength Athlete with 10+ years transforming bodies..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-lime-400"
                      />
                    </div>
                  </div>

                  {/* 3. THREE FEATURED TRAINERS */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-white font-bold font-heading text-sm">
                        <Users className="w-4 h-4 text-purple-400" /> 3. Three Featured Personal Trainers
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Shown in Owner/Trainer Section & Booking Modals
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {[0, 1, 2].map((idx) => {
                        const tr = cmsForm?.TRAINERS?.[idx] || {};
                        return (
                          <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between font-bold text-xs text-purple-300">
                              <span>Trainer #{idx + 1}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{tr.rating || '4.9 ★'}</span>
                            </div>

                            <div>
                              <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Trainer Name</label>
                              <input
                                type="text"
                                value={tr.name || ''}
                                onChange={(e) => updateTrainerField(idx, 'name', e.target.value)}
                                placeholder={`Trainer ${idx + 1}`}
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-purple-400"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Role / Title</label>
                              <input
                                type="text"
                                value={tr.role || ''}
                                onChange={(e) => updateTrainerField(idx, 'role', e.target.value)}
                                placeholder="Elite Hypertrophy Coach"
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-purple-400"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Specialty</label>
                              <input
                                type="text"
                                value={tr.specialty || ''}
                                onChange={(e) => updateTrainerField(idx, 'specialty', e.target.value)}
                                placeholder="Powerlifting & Bodybuilding"
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-purple-400"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Experience</label>
                                <input
                                  type="text"
                                  value={tr.experience || ''}
                                  onChange={(e) => updateTrainerField(idx, 'experience', e.target.value)}
                                  placeholder="7+ Years"
                                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-purple-400"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Rating</label>
                                <input
                                  type="text"
                                  value={tr.rating || ''}
                                  onChange={(e) => updateTrainerField(idx, 'rating', e.target.value)}
                                  placeholder="4.9 ★"
                                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-purple-400"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Photo Image URL</label>
                              <input
                                type="url"
                                value={tr.image || ''}
                                onChange={(e) => updateTrainerField(idx, 'image', e.target.value)}
                                placeholder="https://images.unsplash.com/photo-..."
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white text-[11px] focus:border-purple-400"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. LOCATION & OPERATING HOURS */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-white font-bold font-heading text-sm">
                      <MapPin className="w-4 h-4 text-emerald-400" /> 4. Physical Location, Google Maps & Timings
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block font-mono text-slate-400 uppercase mb-1">Full Gym Address</label>
                        <input
                          type="text"
                          value={cmsForm?.LOCATION?.address || ''}
                          onChange={(e) => updateCmsNested('LOCATION', 'address', e.target.value)}
                          placeholder="Plot 14, Sector 12 Dwarka, Near Metro Station, New Delhi - 110078"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Area / Landmark</label>
                        <input
                          type="text"
                          value={cmsForm?.LOCATION?.area || ''}
                          onChange={(e) => updateCmsNested('LOCATION', 'area', e.target.value)}
                          placeholder="Dwarka Sector 12"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">City / Region</label>
                        <input
                          type="text"
                          value={cmsForm?.LOCATION?.city || ''}
                          onChange={(e) => updateCmsNested('LOCATION', 'city', e.target.value)}
                          placeholder="New Delhi"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Operating Hours</label>
                        <input
                          type="text"
                          value={cmsForm?.LOCATION?.hours || ''}
                          onChange={(e) => updateCmsNested('LOCATION', 'hours', e.target.value)}
                          placeholder="Monday - Sunday: 05:30 AM - 11:00 PM"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Google Maps Direct Navigation Link</label>
                        <input
                          type="url"
                          value={cmsForm?.LOCATION?.googleMapsDirectUrl || ''}
                          onChange={(e) => updateCmsNested('LOCATION', 'googleMapsDirectUrl', e.target.value)}
                          placeholder="https://maps.google.com/..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Google Maps Embed iframe URL</label>
                        <input
                          type="url"
                          value={cmsForm?.LOCATION?.embedMapUrl || ''}
                          onChange={(e) => updateCmsNested('LOCATION', 'embedMapUrl', e.target.value)}
                          placeholder="https://www.google.com/maps/embed?..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. SOCIAL MEDIA LINKS */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-white font-bold font-heading text-sm">
                      <Globe className="w-4 h-4 text-cyan-400" /> 5. Social Media Handles & Channels
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Instagram Link</label>
                        <input
                          type="text"
                          value={cmsForm?.SOCIALS?.instagram || ''}
                          onChange={(e) => updateCmsNested('SOCIALS', 'instagram', e.target.value)}
                          placeholder="https://instagram.com/apex3dgym"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">Facebook Link</label>
                        <input
                          type="text"
                          value={cmsForm?.SOCIALS?.facebook || ''}
                          onChange={(e) => updateCmsNested('SOCIALS', 'facebook', e.target.value)}
                          placeholder="https://facebook.com/apex3dgym"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-slate-400 uppercase mb-1">YouTube Link</label>
                        <input
                          type="text"
                          value={cmsForm?.SOCIALS?.youtube || ''}
                          onChange={(e) => updateCmsNested('SOCIALS', 'youtube', e.target.value)}
                          placeholder="https://youtube.com/@apex3dgym"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. MEMBERSHIP PLANS & PRICING MANAGER */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-white font-bold font-heading text-sm">
                        <CreditCard className="w-4 h-4 text-lime-400" /> 6. Membership Plans & Pricing Manager
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Shown in Pricing Cards & Payment Checkout Desk
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {(cmsForm?.MEMBERSHIP_PLANS || []).map((plan, idx) => (
                        <div key={plan.id || idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between font-bold text-xs text-lime-400">
                            <span>Plan #{idx + 1}</span>
                            <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300 font-mono">
                              <input
                                type="checkbox"
                                checked={!!plan.popular}
                                onChange={(e) => updatePlanField(idx, 'popular', e.target.checked)}
                                className="w-3.5 h-3.5 accent-cyan-400 cursor-pointer"
                              />
                              <span>Most Popular Badge</span>
                            </label>
                          </div>

                          <div>
                            <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Plan Title / Name</label>
                            <input
                              type="text"
                              value={plan.name || ''}
                              onChange={(e) => updatePlanField(idx, 'name', e.target.value)}
                              placeholder="Pro Performance 3-Month"
                              className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:border-lime-400 font-bold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Price (with Currency)</label>
                              <input
                                type="text"
                                value={plan.price || ''}
                                onChange={(e) => updatePlanField(idx, 'price', e.target.value)}
                                placeholder="₹4,999"
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-lime-400 font-mono font-bold focus:border-lime-400"
                              />
                            </div>
                            <div>
                              <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">Billing Period</label>
                              <input
                                type="text"
                                value={plan.period || ''}
                                onChange={(e) => updatePlanField(idx, 'period', e.target.value)}
                                placeholder="/ 3 months"
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 font-mono focus:border-lime-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-mono text-slate-400 text-[10px] uppercase mb-1">
                              Plan Features (1 per line)
                            </label>
                            <textarea
                              rows={4}
                              value={Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || '')}
                              onChange={(e) => updatePlanFeatures(idx, e.target.value)}
                              placeholder={"Full Gym Floor Access\nSteam & Recovery Sauna\nAI Nutrition Generator"}
                              className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-[11px] font-sans leading-relaxed focus:border-lime-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Save Action Bar */}
                  <div className="p-4 rounded-2xl bg-black/80 border border-fuchsia-500/30 flex items-center justify-between sticky bottom-2 backdrop-blur-xl">
                    <p className="text-slate-400 text-xs">
                      Changes persist to MongoDB Atlas & update all visitors instantly.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleResetCmsConfig}
                        disabled={savingCms}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                      >
                        Reset Defaults
                      </button>
                      <button
                        type="submit"
                        disabled={savingCms}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-fuchsia-500/30 hover:scale-105 transition-transform"
                      >
                        {savingCms ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Save & Update Entire Website Live
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </form>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MODAL: ADD NEW MEMBER WITH JOINING & EXPIRY DATES */}
        {/* ========================================================================= */}
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
            <div className="max-w-lg w-full bg-gym-card border border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-400" /> Add New Member / Client
                  </h3>
                  <p className="text-xs text-slate-400">Set joining and expiration dates with optional WhatsApp alert</p>
                </div>
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-slate-400 uppercase mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={newMemberPhone}
                      onChange={(e) => setNewMemberPhone(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-slate-400 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="client@gmail.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-slate-400 uppercase mb-1">Joining Date *</label>
                    <input
                      type="date"
                      required
                      value={newMemberStartDate}
                      onChange={(e) => setNewMemberStartDate(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-slate-400 uppercase mb-1">Expiry / End Date *</label>
                    <input
                      type="date"
                      required
                      value={newMemberEndDate}
                      onChange={(e) => setNewMemberEndDate(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-slate-400 uppercase mb-1">Membership Plan</label>
                    <select
                      value={newMemberPlan}
                      onChange={(e) => setNewMemberPlan(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                    >
                      {(cmsForm?.MEMBERSHIP_PLANS || []).map((pl, idx) => (
                        <option key={idx} value={pl.name}>{pl.name} ({pl.price})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-slate-400 uppercase mb-1">Assigned Trainer</label>
                    <select
                      value={newMemberCoach}
                      onChange={(e) => setNewMemberCoach(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                    >
                      {cmsForm?.OWNER?.name && (
                        <option value={cmsForm.OWNER.name}>{cmsForm.OWNER.name} (Founder / Head Coach)</option>
                      )}
                      {cmsForm?.TRAINERS?.map((t, idx) => (
                        <option key={idx} value={t.name}>{t.name} ({t.role || `Trainer ${idx + 1}`})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Send Welcome WhatsApp Checkbox */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="welcomeWhatsapp"
                    checked={sendWelcomeWhatsapp}
                    onChange={(e) => setSendWelcomeWhatsapp(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400 cursor-pointer"
                  />
                  <label htmlFor="welcomeWhatsapp" className="text-xs text-slate-200 cursor-pointer">
                    Auto-send instant <strong>WhatsApp Welcome Message</strong> with joining & expiry dates to +91 {newMemberPhone || 'number'}
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={creatingMember}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25"
                  >
                    {creatingMember ? 'SAVING MEMBER TO ATLAS...' : 'SAVE MEMBER & SET DATES'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="px-5 py-3.5 rounded-xl bg-white/5 text-slate-400 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. MODAL: EDIT MEMBER DATES */}
        {/* ========================================================================= */}
        {editingMember && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
            <div className="max-w-md w-full bg-gym-card border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-cyan-400" /> Edit Membership Dates: {editingMember.name}
                </h3>
                <button
                  onClick={() => setEditingMember(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateMemberDates} className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Joining / Start Date</label>
                  <input
                    type="date"
                    required
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Expiry / End Date</label>
                  <input
                    type="date"
                    required
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase mb-1">Membership Tier</label>
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  >
                    {(cmsForm?.MEMBERSHIP_PLANS || []).map((pl, idx) => (
                      <option key={idx} value={pl.name}>{pl.name} ({pl.price})</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-xs uppercase"
                  >
                    Save Updated Dates
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-3 rounded-xl bg-white/5 text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. MODAL: INDIVIDUAL SEPARATE WHATSAPP COMPOSER */}
        {/* ========================================================================= */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
            <div className="max-w-md w-full bg-gym-card border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" /> Send Separate WhatsApp
                </h4>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Recipient: <strong className="text-white">{selectedMember.name}</strong> (+91 {selectedMember.phone})
              </p>

              {/* Template Shortcuts */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCustomMsg(`🚨 Hi ${selectedMember.name}! Your ${selectedMember.membershipPlan || 'Gym Pass'} expires in ${selectedMember.daysRemaining || 4} days. Renew at Front Desk or contact +91 9971284797.`)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-amber-300 rounded-md border border-white/10"
                >
                  Expiry Alert
                </button>
                <button
                  onClick={() => setCustomMsg(`🔥 Hi ${selectedMember.name}! Today's dynamic AI workout is ready on your dashboard. Let's smash our goals at Apex 3D Gym!`)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-cyan-300 rounded-md border border-white/10"
                >
                  Workout Motivation
                </button>
                <button
                  onClick={() => setCustomMsg(`🏆 Special Offer: Renew your pass for 3 months and get 2 free PT sessions with Amrit Dwivedi! Contact +91 9971284797.`)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-lime-300 rounded-md border border-white/10"
                >
                  Renewal Offer
                </button>
              </div>

              <textarea
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your custom WhatsApp message text here..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-400"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSendWhatsApp}
                  disabled={sendingMsg}
                  className="flex-1 py-3 rounded-xl bg-emerald-400 text-black font-extrabold text-xs uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-400/25"
                >
                  {sendingMsg ? 'DISPATCHING...' : 'SEND WHATSAPP VIA TWILIO'}
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-3 rounded-xl bg-white/5 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
