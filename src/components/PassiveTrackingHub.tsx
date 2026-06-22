import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Slack, Activity, Trophy, Award, TrendingUp, Check, 
  ExternalLink, Eye, EyeOff, Cpu, Database, AlertCircle, Sparkles, Clock, 
  Heart, ListTodo, Trophy as CupIcon, Gamepad2, Coins, ArrowRight, ShieldCheck, 
  RefreshCw, CheckCircle, Info, ChevronRight, Lock, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

// Interfaces for our state
interface ThirdPartyConnector {
  id: string;
  name: string;
  category: 'workspace' | 'communication' | 'wearable' | 'tasks';
  icon: any;
  status: 'disconnected' | 'connected' | 'syncing';
  permissions: string[];
  metricsRefined: string[];
  description: string;
  instructions: string;
  simulatedValue?: string;
  apiKey?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'calibration' | 'sync' | 'resilience' | 'focus';
  xpReward: number;
  unlocked: boolean;
  progress: number; // 0 to 100
  target: string;
}

interface RewardSubSpace {
  id: string;
  title: string;
  description: string;
  cost: number;
  purchased: boolean;
  benefit: string;
  icon: any;
}

interface PassiveTelemetry {
  timestamp: string;
  source: string;
  event: string;
  impactScore: string;
}

export const PassiveTrackingHub = ({ 
  metrics, 
  setMetrics, 
  trackingEnabled, 
  setTrackingEnabled 
}: { 
  metrics: any; 
  setMetrics: (m: any) => void;
  trackingEnabled: boolean;
  setTrackingEnabled: (e: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'achievements' | 'leaderboard' | 'perks'>('sync');
  
  // Connectors State
  const [connectors, setConnectors] = useState<ThirdPartyConnector[]>(() => {
    let saved = null;
    try {
      saved = localStorage.getItem('COGNITIVE_TWIN_CONNECTORS');
    } catch (e) {}
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map icons back
        return parsed.map((c: any) => ({
          ...c,
          icon: c.id === 'calendar' ? Calendar : 
                c.id === 'slack' ? Slack : 
                c.id === 'wearables' ? Heart : ListTodo
        }));
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'calendar',
        name: 'Google Calendar / Outlook',
        category: 'workspace',
        icon: Calendar,
        status: 'disconnected',
        permissions: ['Read meeting density', 'Calculate focused work timeblocks', 'Analyze focus disruption index'],
        metricsRefined: ['resilienceScore', 'executiveScore'],
        description: 'Sync with digital schedules to evaluate scheduling optimization, meeting frequency fatigue, and cognitive load density.',
        instructions: 'Grant safe read-only calendar scope. No email texts or private descriptions are parsed. Fully sandboxed on-device.',
        simulatedValue: 'Calendar Overload (4.2 hrs meetings/day)'
      },
      {
        id: 'slack',
        name: 'Slack / Microsoft Teams',
        category: 'communication',
        icon: Slack,
        status: 'disconnected',
        permissions: ['Communication velocity analysis', 'Passive tone & sentiment check', 'Interaction frequency index'],
        metricsRefined: ['eqScore', 'verbalScore'],
        description: 'Correlate real-time typing speed and communication pattern with empathy benchmarks and daily psychological fatigue.',
        instructions: 'Setup localized webhook or personal Slack token. Communication details are evaluated client-side only under local differential privacy.',
        simulatedValue: 'Workspace Sentiment: 92% Positive'
      },
      {
        id: 'wearables',
        name: 'Oura Ring / Fitbit / Apple Health',
        category: 'wearable',
        icon: Heart,
        status: 'disconnected',
        permissions: ['Circadian sleep staging', 'Resting Heart Rate (RHR) telemetry', 'HRV Under Pressure index'],
        metricsRefined: ['resilienceScore', 'speedScore'],
        description: 'Link active body biosensors to sync sleep duration, physiological stress indicators, and daily chronotype energy levels.',
        instructions: 'Sync Google Fit/Apple Health or input private Oura developer token. Absolute local containment ensures no cloud upload of health telemetry.',
        simulatedValue: 'Sleep efficiency: 84% (Restorative)'
      },
      {
        id: 'tasks',
        name: 'Linear / Jira / Todoist',
        category: 'tasks',
        icon: ListTodo,
        status: 'disconnected',
        permissions: ['Task completion rate', 'Active backlog velocity index', 'Prioritization complexity factor'],
        metricsRefined: ['focusScore', 'logicScore', 'executiveScore'],
        description: 'Determine task completions, workload velocity, and structural clarity indices to calculate actual executive execution levels.',
        instructions: 'Input user token or project webhook keys. Tracks completion timestamps and backlog sizes to dynamically scale focus score multipliers.',
        simulatedValue: 'High Task Velocity: 9 actions/day'
      }
    ];
  });

  // Telemetry simulation log
  const [telemetryLogs, setTelemetryLogs] = useState<PassiveTelemetry[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [inputToken, setInputToken] = useState('');
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Gamification: Achievements State
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem('COGNITIVE_TWIN_XP');
      return saved ? parseInt(saved, 10) : 1550;
    } catch (e) {
      return 1550;
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('COGNITIVE_TWIN_STREAK');
      return saved ? parseInt(saved, 10) : 4;
    } catch (e) {
      return 4;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('COGNITIVE_TWIN_ACHIEVEMENTS');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [
      {
        id: 'onboard_complete',
        title: 'Cognitive Catalyst',
        description: 'Establish initial cognitive twin reference profile and completes calibrations.',
        icon: Sparkles,
        category: 'calibration',
        xpReward: 300,
        unlocked: true,
        progress: 100,
        target: '1 Calibration Completed'
      },
      {
        id: 'triple_connect',
        title: 'Synaptic Integrator',
        description: 'Connect at least three optional passive application links to build a holistic realtime environment model.',
        icon: Cpu,
        category: 'sync',
        xpReward: 500,
        unlocked: false,
        progress: 0,
        target: '3 Connectors Active'
      },
      {
        id: 'three_day_streak',
        title: 'Circadian Vanguard',
        description: 'Log active brain telemetry or keep passive tracking active 3 days in a row.',
        icon: Clock,
        category: 'resilience',
        xpReward: 400,
        unlocked: true,
        progress: 100,
        target: '3 Days Maintain'
      },
      {
        id: 'focus_forger',
        title: 'Focus Forge Master',
        description: 'Complete 3 high-focus work blocks tracked through Slack or Linear without context switching.',
        icon: ListTodo,
        category: 'focus',
        xpReward: 450,
        unlocked: false,
        progress: 33,
        target: '1 of 3 Sessions Complete'
      },
      {
        id: 'eq_alchemist',
        title: 'Empathy Alchemist',
        description: 'Calibrate an EQ score higher than 85% with contextual communication input active.',
        icon: Heart,
        category: 'calibration',
        xpReward: 600,
        unlocked: false,
        progress: 0,
        target: 'EQ Score > 85%'
      },
      {
        id: 'absolute_navigator',
        title: 'Quantum Explorer',
        description: 'Explore the Latent Space Explorer, identify nearest careers, and recalibrate 3 distinct brain benchmarks.',
        icon: CupIcon,
        category: 'focus',
        xpReward: 500,
        unlocked: false,
        progress: 66,
        target: '2 of 3 Calibrations Complete'
      }
    ];
  });

  // Rewards state
  const [rewards, setRewards] = useState<RewardSubSpace[]>(() => {
    try {
      const saved = localStorage.getItem('COGNITIVE_TWIN_REWARDS');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [
      {
        id: 'deep_solfeggio',
        title: 'Deep Focused Solfeggio Beats',
        description: 'Unlocks ultra-focused binaural acoustic frequency generator directly inside the Sensory Sanctuary.',
        cost: 400,
        purchased: false,
        benefit: '+5% passive focus duration',
        icon: Zap
      },
      {
        id: 'quantum_projection',
        title: 'Hyper-Dim Cognitive Rendering',
        description: 'Enables extreme 18-axis sub-structural visualization inside the Latent Space Explorer canvas.',
        cost: 650,
        purchased: false,
        benefit: 'Enhanced calibration accuracy',
        icon: Cpu
      },
      {
        id: 'privacy_bunker',
        title: 'Encrypted Local Differential Guard',
        description: 'Enables advanced noise-injection security protocols mapping real-time work habits under extreme privacy logs.',
        cost: 800,
        purchased: false,
        benefit: 'Absolute client side security certificates',
        icon: ShieldCheck
      }
    ];
  });

  // Calculate Neural Level based on XP
  const level = Math.floor(xp / 1000) + 1;
  const currentLevelXP = xp % 1000;
  const xpNeededForNext = 1000;

  // Persist options
  const saveAllToLocalStorage = (
    updatedConnectors: ThirdPartyConnector[], 
    updatedXP: number,
    updatedStreak: number,
    updatedAchievements: Achievement[],
    updatedRewards: RewardSubSpace[]
  ) => {
    try {
      // Clean icons for saving
      const serializableConnectors = updatedConnectors.map(({ icon, ...rest }) => ({ ...rest }));
      localStorage.setItem('COGNITIVE_TWIN_CONNECTORS', JSON.stringify(serializableConnectors));
      localStorage.setItem('COGNITIVE_TWIN_XP', updatedXP.toString());
      localStorage.setItem('COGNITIVE_TWIN_STREAK', updatedStreak.toString());
      
      const serializableAchievements = updatedAchievements.map(({ icon, ...rest }) => ({ ...rest }));
      localStorage.setItem('COGNITIVE_TWIN_ACHIEVEMENTS', JSON.stringify(serializableAchievements));

      const serializableRewards = updatedRewards.map(({ icon, ...rest }) => ({ ...rest }));
      localStorage.setItem('COGNITIVE_TWIN_REWARDS', JSON.stringify(serializableRewards));
    } catch (e) {
      // Fail silent
    }
  };

  // Sync / Active Data Telemetry Simulator
  useEffect(() => {
    if (!trackingEnabled) return;

    const sources = ['Google Calendar', 'Oura Ring', 'Slack Passive Feed', 'Linear Backlog'];
    const calendarEvents = [
      'Meeting scheduled: Deep Space Research (Disruption index stable)',
      '3-Hour focus block detected in daily calendar grid',
      'Cognitive density threshold validated: 4 meetings today'
    ];
    const wearEvents = [
      'HRV index synced: 68 ms (High resilience state)',
      'Restorative deep sleep marker captured: 142 mins',
      'Daily physiological rest state optimized (88% recovery)'
    ];
    const slackEvents = [
      'CPM calibrated: 320 Char/min with stable jitter margins',
      'Differential token analytics processed (Zero context switching)',
      'Active professional interaction rating: 94% alignment'
    ];
    const taskEvents = [
      'Task completed: Neural Sub-Space map deployment (+Focus multiplier)',
      'Project throughput evaluated: 12 story points cleared client-side',
      'Prioritization focus aligned: High value ticket marked active'
    ];

    const generateLog = () => {
      // Pick connected connectors first
      const activeConnectors = connectors.filter(c => c.status === 'connected');
      if (activeConnectors.length === 0) return;

      const randomConn = activeConnectors[Math.floor(Math.random() * activeConnectors.length)];
      let chosenMessage = '';
      if (randomConn.id === 'calendar') chosenMessage = calendarEvents[Math.floor(Math.random() * calendarEvents.length)];
      if (randomConn.id === 'wearables') chosenMessage = wearEvents[Math.floor(Math.random() * wearEvents.length)];
      if (randomConn.id === 'slack') chosenMessage = slackEvents[Math.floor(Math.random() * slackEvents.length)];
      if (randomConn.id === 'tasks') chosenMessage = taskEvents[Math.floor(Math.random() * taskEvents.length)];

      const randomDelta = (Math.random() * 3 + 1).toFixed(1);
      const isPositive = Math.random() > 0.3;

      const newLog: PassiveTelemetry = {
        timestamp: new Date().toLocaleTimeString(),
        source: randomConn.name.split(' ')[0],
        event: chosenMessage,
        impactScore: `${isPositive ? '+' : '-'}${randomDelta}% Twin Accuracy`
      };

      setTelemetryLogs(prev => [newLog, ...prev.slice(0, 19)]);
      
      // Update real metrics to demonstrate active analytical adjustments if appropriate
      if (isPositive) {
        setMetrics((prev: any) => {
          const res = { ...prev };
          randomConn.metricsRefined.forEach((mKey) => {
            if (res[mKey]) {
              res[mKey] = Math.min(100, Math.round(res[mKey] + 0.5));
            }
          });
          return res;
        });
      }
    };

    const interval = setInterval(generateLog, 8000);
    return () => clearInterval(interval);
  }, [trackingEnabled, connectors]);

  // Connect integration flow
  const handleConnectClick = (connId: string) => {
    const conn = connectors.find(c => c.id === connId);
    if (!conn) return;

    if (conn.status === 'connected') {
      // Disconnect
      const updated = connectors.map(c => c.id === connId ? { ...c, status: 'disconnected' as const, apiKey: undefined } : c);
      setConnectors(updated);
      
      // Update Synaptic Integrator Achievement
      const activeCount = updated.filter(c => c.status === 'connected').length;
      const updatedAchievements = achievements.map(ach => {
        if (ach.id === 'three_connect') {
          const progress = Math.min(100, Math.round((activeCount / 3) * 100));
          return { ...ach, progress, unlocked: progress === 100 };
        }
        return ach;
      });
      setAchievements(updatedAchievements);
      
      saveAllToLocalStorage(updated, xp, streak, updatedAchievements, rewards);
      
      const newLog: PassiveTelemetry = {
        timestamp: new Date().toLocaleTimeString(),
        source: 'Security',
        event: `Disconnected ${conn.name}. Data ingestion terminated.`,
        impactScore: 'Telemetry Stopped'
      };
      setTelemetryLogs(prev => [newLog, ...prev]);
    } else {
      // Open Setup modal
      setActiveModal(connId);
      setInputToken('');
    }
  };

  const handleConfirmConnect = () => {
    if (!activeModal) return;

    const updated = connectors.map(c => {
      if (c.id === activeModal) {
        return { 
          ...c, 
          status: 'connected' as const, 
          apiKey: inputToken || 'COGNITIVE_SECURE_TOKEN_ENC_AES256' 
        };
      }
      return c;
    });

    setConnectors(updated);
    setActiveModal(null);

    // Sync state
    const activeCount = updated.filter(c => c.status === 'connected').length;
    let xpGain = 0;
    
    // Update Synaptic Integrator Progress
    const updatedAchievements = achievements.map(ach => {
      if (ach.id === 'three_connect') {
        const progress = Math.min(100, Math.round((activeCount / 3) * 100));
        const wasUnlocked = ach.unlocked;
        const nowUnlocked = progress === 100;
        if (nowUnlocked && !wasUnlocked) xpGain += ach.xpReward;
        return { ...ach, progress, unlocked: nowUnlocked };
      }
      return ach;
    });

    const newXp = xp + xpGain;
    setXp(newXp);
    setAchievements(updatedAchievements);
    
    if (activeCount === 1 && !trackingEnabled) {
      setTrackingEnabled(true);
      try {
        localStorage.setItem('NEURAL_TRACKING_ENABLED', 'true');
      } catch (e) {}
    }

    saveAllToLocalStorage(updated, newXp, streak, updatedAchievements, rewards);

    const newLog: PassiveTelemetry = {
      timestamp: new Date().toLocaleTimeString(),
      source: 'Security',
      event: `Established end-to-end encrypted link with ${connectors.find(c => c.id === activeModal)?.name}`,
      impactScore: 'Link Established'
    };
    setTelemetryLogs(prev => [newLog, ...prev]);
  };

  // Buy custom reward spaces with Cognitive Credits/XP
  const handlePurchaseReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.purchased || xp < reward.cost) return;

    const newXp = xp - reward.cost;
    const updatedRewards = rewards.map(r => r.id === rewardId ? { ...r, purchased: true } : r);
    
    setXp(newXp);
    setRewards(updatedRewards);
    saveAllToLocalStorage(connectors, newXp, streak, achievements, updatedRewards);

    // Dynamic boost impact reflection in active metrics
    setMetrics((prev: any) => {
      const updatedM = { ...prev };
      if (rewardId === 'deep_solfeggio') updatedM.focusScore = Math.min(100, updatedM.focusScore + 5);
      if (rewardId === 'quantum_projection') updatedM.comprehensiveScore = Math.min(100, updatedM.comprehensiveScore + 3);
      if (rewardId === 'privacy_bunker') updatedM.resilienceScore = Math.min(100, updatedM.resilienceScore + 6);
      return updatedM;
    });
  };

  // Run full system recalibration sync
  const handleFullSync = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIsSyncingAll(false);
      // Give random XP on sync
      const bonusXP = 40;
      setXp(prev => {
        const next = prev + bonusXP;
        try {
          localStorage.setItem('COGNITIVE_TWIN_XP', next.toString());
        } catch (e) {}
        return next;
      });
      // Increment Day Streak optionally
      setStreak(prev => {
        const next = Math.min(30, prev + 1);
        try {
          localStorage.setItem('COGNITIVE_TWIN_STREAK', next.toString());
        } catch (e) {}
        return next;
      });
      
      const newLog: PassiveTelemetry = {
        timestamp: new Date().toLocaleTimeString(),
        source: 'Refinement',
        event: 'Conducted holistic multi-application calibration sync. Refined high-dimensional parameters.',
        impactScore: '+40 Neural XP gained'
      };
      setTelemetryLogs(prev => [newLog, ...prev]);
    }, 2000);
  };

  // Dummy leaderboard list (academic research cohorts)
  const cohortLeaderboard = [
    { rank: 1, name: 'Neural_Zen_Architect', score: 98.4, streak: 12, connected: 4, isUser: false },
    { rank: 2, name: 'Neuro_Pioneer_4', score: 94.1, streak: 8, connected: 3, isUser: false },
    { rank: 3, name: 'Cognitive_Subspace', score: 92.5, streak: 15, connected: 3, isUser: false },
    { rank: 4, name: 'Quantum_Thinker', score: Math.max(70, metrics.comprehensiveScore || 85), streak: streak, connected: connectors.filter(c => c.status === 'connected').length, isUser: true },
    { rank: 5, name: 'Solfeggio_Wave_01', score: 88.0, streak: 3, connected: 2, isUser: false },
    { rank: 6, name: 'Chronobiotic_Twin', score: 86.4, streak: 6, connected: 2, isUser: false },
    { rank: 7, name: 'Holographic_Mind', score: 84.8, streak: 9, connected: 2, isUser: false },
    { rank: 8, name: 'Bento_Resilience', score: 81.2, streak: 5, connected: 1, isUser: false }
  ].sort((a,b) => b.score - a.score).map((item, index) => ({ ...item, rank: index + 1 }));

  return (
    <div className="space-y-12">
      {/* Visual Header / Neural Level Tracker */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Trophy className="w-48 h-48 text-[#8A2BE2]" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <span className="micro-label text-[#8A2BE2] bg-[#8A2BE2]/8 border border-[#8A2BE2]/18 px-3.5 py-1 rounded-full uppercase tracking-widest font-mono">
              Bandwidth Sync & Achievements
            </span>
            <h2 className="text-3xl font-serif italic text-primary">Neural Synchronization Hub</h2>
            <p className="text-xs text-slate-400 font-light max-w-xl leading-relaxed">
              Connect private lifestyle nodes passively to refine your Cognitive Twin parameters automatically. Engage consistent brain calibration to unlock elite computational achievements and custom sub-space waveforms.
            </p>
          </div>

          {/* Holographic Level Badge */}
          <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl shrink-0">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8A2BE2]/30 to-purple-500/10 border border-[#8A2BE2]/40 shadow-[0_0_20px_rgba(138, 43, 226,0.15)] glow">
              <Sparkles className="absolute w-12 h-12 text-[#8A2BE2]/20 animate-pulse" />
              <span className="text-xl font-mono font-bold text-white">{level}</span>
            </div>
            <div className="space-y-1.5 flex-1 min-w-[150px]">
              <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
                <span className="text-[#8A2BE2] font-bold">Neural Stage</span>
                <span className="text-slate-500 font-bold">{currentLevelXP} / {xpNeededForNext} XP</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-[#8A2BE2] to-[#bca6ec] rounded-full transition-all duration-1000" 
                  style={{ width: `${(currentLevelXP / xpNeededForNext) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-4 text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent-blue" /> {streak} Day Streak</span>
                <span className="flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-emerald-500" /> {xp} CBC Credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-t border-white/5 mt-10 pt-6 gap-2 overflow-x-auto">
          {[
            { id: 'sync', label: 'Passive Connections', icon: Cpu },
            { id: 'achievements', label: 'Holo Achievements', icon: Award },
            { id: 'leaderboard', label: 'Research Cohort', icon: CupIcon },
            { id: 'perks', label: 'Bandwidth Perks', icon: Coins }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all shrink-0",
                activeTab === tab.id 
                  ? "bg-[#8A2BE2]/10 text-white border border-[#8A2BE2]/25 shadow-[0_0_15px_rgba(138, 43, 226,0.08)]" 
                  : "text-slate-500 hover:text-white border border-transparent hover:bg-white/[0.02]"
              )}
            >
              <tab.icon className="w-4 h-4 text-[#8A2BE2]" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: PASSIVE CONNECTIONS */}
        {activeTab === 'sync' && (
          <motion.div 
            key="sync" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Control & Privacy Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-xl font-serif text-primary flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-[#8A2BE2]" /> Real-time Ingestion Controls
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-1">Configure external data synchronization parameters</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleFullSync}
                      disabled={isSyncingAll || connectors.filter(c => c.status === 'connected').length === 0}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2",
                        connectors.filter(c => c.status === 'connected').length === 0 
                          ? "opacity-40 border-white/5 text-slate-600 cursor-not-allowed"
                          : "bg-white/[0.04] border-white/10 hover:bg-white/10 text-white"
                      )}
                    >
                      <RefreshCw className={cn("w-3.5 h-3.5", isSyncingAll && "animate-spin")} />
                      {isSyncingAll ? "Syncing..." : "Sync All Active"}
                    </button>
                    <button
                      onClick={() => {
                        setTrackingEnabled(!trackingEnabled);
                        try {
                          localStorage.setItem('NEURAL_TRACKING_ENABLED', (!trackingEnabled).toString());
                        } catch (e) {}
                      }}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all",
                        trackingEnabled 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                          : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
                      )}
                    >
                      {trackingEnabled ? "Master Ingest: ON" : "Master Ingest: OFF"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {connectors.map((conn) => {
                    const Icon = conn.icon;
                    return (
                      <div 
                        key={conn.id} 
                        className={cn(
                          "p-6 rounded-3xl border transition-all flex flex-col justify-between h-[230px]",
                          conn.status === 'connected' 
                            ? "bg-[#8A2BE2]/4 border-[#8A2BE2]/25 hover:border-[#8A2BE2]/35 shadow-[0_0_20px_rgba(138, 43, 226,0.03)]" 
                            : "bg-white/[0.01] border-white/5 hover:border-white/10"
                        )}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-white/5 text-slate-400">
                              <Icon className="w-5 h-5 text-[#8A2BE2]" />
                            </div>
                            <span className={cn(
                              "text-[8px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                              conn.status === 'connected' 
                                ? "bg-emerald-500/8 text-emerald-400 border-emerald-500/20" 
                                : "bg-white/5 text-slate-500 border-white/5"
                            )}>
                              {conn.status === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-white">{conn.name}</h4>
                            <p className="text-[10px] text-slate-500 font-light line-clamp-3 mt-1 leading-relaxed">
                              {conn.description}
                            </p>
                          </div>
                        </div>

                        {conn.status === 'connected' && conn.simulatedValue && (
                          <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5 text-[8px] font-mono text-[#8A2BE2]">
                            <Info className="w-3 h-3 text-slate-500" />
                            <span className="truncate">{conn.simulatedValue}</span>
                          </div>
                        )}

                        <button
                          onClick={() => handleConnectClick(conn.id)}
                          className={cn(
                            "w-full py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-colors mt-2 text-center flex items-center justify-center gap-1.5",
                            conn.status === 'connected'
                              ? "bg-red-500/8 border border-red-500/20 text-red-400 hover:bg-red-500/15"
                              : "bg-white/90 text-black hover:bg-white"
                          )}
                        >
                          {conn.status === 'connected' ? 'Disconnect API' : 'Configure Account Link'}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Passive Data Stream Telemetry */}
              <div className="md:col-span-4 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                <div>
                  <h3 className="text-lg font-serif italic text-primary flex items-center gap-2.5">
                    <Database className="w-4.5 h-4.5 text-[#8A2BE2]" /> Local Intake Telemetry
                  </h3>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono mt-1">Real-time sandboxed passive event queue</p>
                </div>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {trackingEnabled && telemetryLogs.length > 0 ? (
                    telemetryLogs.map((log, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 5 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={i} 
                        className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl space-y-1.5 hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex justify-between items-center text-[8px] font-mono">
                          <span className="text-[#8A2BE2] font-bold uppercase">{log.source}</span>
                          <span className="text-slate-500">{log.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-light leading-snug">{log.event}</p>
                        <div className="text-[8px] font-mono text-emerald-500 font-medium">{log.impactScore}</div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-[250px] flex flex-col items-center justify-center text-center p-4">
                      <div className="p-4 rounded-full bg-white/5 border border-white/5 mb-4 animate-pulse">
                        <Activity className="w-6 h-6 text-slate-500" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed">
                        {trackingEnabled 
                          ? "Awaiting passive feed integration..." 
                          : "Telemetry offline. Enable Master Ingest."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Privacy Guaranteed Safeguard Block */}
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Differential Privacy Guaranteed</h5>
                    <p className="text-[9px] text-slate-500 leading-relaxed">
                      Linguistic tokens, exact calendar locations, or private health raw data coordinates never reach our engine. Highly obfuscated local vector aggregates are calculated in your browser sandbox, keeping your telemetry fully encrypted and private.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: ACHIEVEMENT VAULT */}
        {activeTab === 'achievements' && (
          <motion.div 
            key="achievements" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((ach) => {
                const Icon = ach.icon || Award;
                return (
                  <div 
                    key={ach.id} 
                    className={cn(
                      "p-6 rounded-[2rem] border transition-all relative overflow-hidden flex flex-col justify-between h-[230px]",
                      ach.unlocked 
                        ? "bg-[#8A2BE2]/5 border-[#8A2BE2]/25 hover:border-[#8A2BE2]/35 shadow-[0_0_20px_rgba(138, 43, 226,0.05)]" 
                        : "bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100"
                    )}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                          "p-3 rounded-2xl",
                          ach.unlocked 
                            ? "bg-[#8A2BE2]/10 text-[#8A2BE2]" 
                            : "bg-white/5 text-slate-500"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                          ach.unlocked 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-white/5 text-slate-500 border-white/5"
                        )}>
                          {ach.unlocked ? 'CALIBRATED' : 'LOCKED'}
                        </span>
                      </div>

                      <h3 className={cn(
                        "text-base font-serif italic mb-1.5",
                        ach.unlocked ? "text-primary" : "text-slate-400"
                      )}>
                        {ach.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-light leading-relaxed mb-4">
                        {ach.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase tracking-wider">
                        <span>Calibration Metric: {ach.target}</span>
                        <span>{ach.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            ach.unlocked ? "bg-gradient-to-r from-emerald-500 to-[#8A2BE2]" : "bg-white/10"
                          )}
                          style={{ width: `${ach.progress}%` }}
                        />
                      </div>
                      {ach.unlocked && (
                        <div className="flex items-center gap-1.5 text-[9px] text-[#8A2BE2] font-mono font-bold uppercase tracking-widest mt-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>+ {ach.xpReward} CBC Credits Saved</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 3: LEADERBOARD COHORT */}
        {activeTab === 'leaderboard' && (
          <motion.div 
            key="leaderboard" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-3">
                <span className="micro-label text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-4 py-1.5 rounded-full inline-block uppercase font-mono tracking-widest">
                  Academic Calibration Benchmarking
                </span>
                <h3 className="text-2xl font-serif italic text-primary">Global Neuro-Twin Cohort</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Compare your Cognitive Twin precision scores anonymously against validation benchmarks. Compete securely with other digital twins under extreme differential pseudonym standards.
                </p>
              </div>

              <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                <div className="grid grid-cols-12 bg-white/5 px-6 py-3.5 text-[9px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/5">
                  <div className="col-span-2">Academic Rank</div>
                  <div className="col-span-4">Pseudonym Identifier</div>
                  <div className="col-span-2 text-center">Integrated Nodes</div>
                  <div className="col-span-2 text-center">Engagement Streak</div>
                  <div className="col-span-2 text-right">Synthesis Precision</div>
                </div>

                <div className="divide-y divide-white/5">
                  {cohortLeaderboard.map((userRow, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "grid grid-cols-12 px-6 py-4 items-center text-xs",
                        userRow.isUser 
                          ? "bg-[#8A2BE2]/8 border-y border-[#8A2BE2]/20 font-bold text-white shadow-inner" 
                          : "text-slate-400 hover:text-white hover:bg-white/[0.01] transition-all"
                      )}
                    >
                      <div className="col-span-2 font-mono flex items-center gap-1.5">
                        {userRow.rank <= 3 ? (
                          <span className={cn(
                            "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold",
                            userRow.rank === 1 ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" :
                            userRow.rank === 2 ? "bg-slate-400/20 text-slate-300 border border-slate-400/30" :
                            "bg-amber-700/20 text-amber-600 border border-amber-700/30"
                          )}>
                            {userRow.rank}
                          </span>
                        ) : (
                          <span className="pl-1 text-slate-500 font-bold">{userRow.rank}</span>
                        )}
                      </div>
                      
                      <div className="col-span-4 font-medium flex items-center gap-2">
                        {userRow.isUser && <span className="w-1.5 h-1.5 bg-[#8A2BE2] rounded-full animate-pulse" />}
                        {userRow.name}
                        {userRow.isUser && <span className="text-[8px] uppercase tracking-widest border border-[#8A2BE2]/30 bg-[#8A2BE2]/10 text-white font-bold font-mono px-2 py-0.5 rounded-full">YOU</span>}
                      </div>

                      <div className="col-span-2 text-center font-mono text-[10px] font-bold">
                        {userRow.connected} Nodes Active
                      </div>

                      <div className="col-span-2 text-center font-mono">
                        {userRow.streak} Day Loop
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold text-[#8A2BE2]">
                        {userRow.score.toFixed(1)}% Accuracy
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: CREDIT REWARD PERKS */}
        {activeTab === 'perks' && (
          <motion.div 
            key="perks" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewards.map((rew) => {
                const Icon = rew.icon || Coins;
                return (
                  <div 
                    key={rew.id} 
                    className={cn(
                      "p-6 rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col justify-between h-[250px]",
                      rew.purchased 
                        ? "bg-emerald-500/5 border-emerald-500/25 shadow-sm" 
                        : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    )}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                          "p-3 rounded-2xl",
                          rew.purchased 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-white/5 text-slate-500"
                        )}>
                          <Icon className="w-5 h-5 text-[#8A2BE2]" />
                        </div>
                        <span className={cn(
                          "text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-white/5 border border-white/5",
                          rew.purchased ? "text-emerald-400" : "text-amber-400"
                        )}>
                          {rew.purchased ? 'FULLY UNLOCKED' : `${rew.cost} CBC`}
                        </span>
                      </div>

                      <h3 className="text-base font-serif italic mb-1.5 text-primary">
                        {rew.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-light leading-relaxed mb-4">
                        {rew.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white/5 px-4.5 py-2.5 rounded-2xl flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500 uppercase">Interactive Bonus:</span>
                        <span className={cn("font-bold font-sans", rew.purchased ? "text-emerald-400" : "text-white")}>{rew.benefit}</span>
                      </div>

                      <button
                        onClick={() => handlePurchaseReward(rew.id)}
                        disabled={rew.purchased || xp < rew.cost}
                        className={cn(
                          "w-full py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all text-center",
                          rew.purchased 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                            : xp >= rew.cost
                              ? "bg-white text-black hover:scale-[1.01] hover:shadow-lg"
                              : "bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed"
                        )}
                      >
                        {rew.purchased ? "Applied to System" : xp >= rew.cost ? "Spend bandwidth to unlock" : "Insufficient CBC Credits"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONNECT SETUP DIALOG */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#14122d] border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="p-3 bg-[#8A2BE2]/10 rounded-2xl text-[#8A2BE2]">
                  {(() => {
                    const IconComponent = connectors.find(c => c.id === activeModal)?.icon || ExternalLink;
                    return <IconComponent className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <h4 className="text-xl font-serif text-primary">Establish Dedicated Link</h4>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
                    Connect {connectors.find(c => c.id === activeModal)?.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 bg-white/[0.02] p-4.5 rounded-2xl border border-white/5">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#8A2BE2]">Credentials & Instructions</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                    {connectors.find(c => c.id === activeModal)?.instructions}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Secure Personal Token / Client API Key</label>
                  <input
                    type="password"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                    placeholder="Input secure webhook client token key (e.g. ln_tok_...)"
                    className="w-full bg-[#1b1935] border border-white/10 rounded-2xl p-4 text-xs font-mono outline-none focus:border-[#8A2BE2] text-white transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Scope Permissions Authorized</span>
                  <div className="space-y-2">
                    {connectors.find(c => c.id === activeModal)?.permissions.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-[10px] text-slate-400">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleConfirmConnect}
                  className="flex-1 py-3.5 bg-[#8A2BE2] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
                >
                  Confirm Secure Connection
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 bg-white/5 text-slate-400 border border-white/5 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
