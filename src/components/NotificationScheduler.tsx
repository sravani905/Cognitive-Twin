import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings, Sparkles, AlertCircle, Clock, Play, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function NotificationScheduler() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [schedulerEnabled, setSchedulerEnabled] = useState<boolean>(() => {
    return localStorage.getItem('growth_nudge_enabled') !== 'false';
  });
  const [lastLogin, setLastLogin] = useState<number>(() => {
    const raw = localStorage.getItem('last_login_timestamp');
    if (raw) return parseInt(raw, 10);
    const now = Date.now();
    localStorage.setItem('last_login_timestamp', now.toString());
    return now;
  });
  const [showTester, setShowTester] = useState(false);
  const [timeRemainingSim, setTimeRemainingSim] = useState<number>(30); // 30-second simulation counter
  const [simActive, setSimActive] = useState(false);

  // Sync state on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    
    // Update last login to simulate standard continuous cycle
    const now = Date.now();
    localStorage.setItem('last_login_timestamp', now.toString());
    setLastLogin(now);
  }, []);

  // background checker checks for actual 24hr inactivity gap or simulated cycles
  useEffect(() => {
    if (!schedulerEnabled || !('Notification' in window) || permission !== 'granted') return;

    const interval = setInterval(() => {
      const storedLogin = localStorage.getItem('last_login_timestamp');
      if (!storedLogin) return;
      const lastLoginMs = parseInt(storedLogin, 10);
      const diffMs = Date.now() - lastLoginMs;

      // 24 Hours in Millis = 86400000
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;
      if (diffMs >= twentyFourHoursMs) {
        triggerNudge("Complete Your Cognitive Growth Tasks! 🧠", {
          body: "It has been 24 hours since your last diagnostic session. Maintain your cognitive twin alignment now!",
          icon: "/favicon.ico"
        });
        // reset session login tag to prevent endless notification spamming
        localStorage.setItem('last_login_timestamp', Date.now().toString());
      }
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [schedulerEnabled, permission]);

  // Handle countdown simulation for quick verification
  useEffect(() => {
    if (!simActive) return;

    const interval = setInterval(() => {
      setTimeRemainingSim((prev) => {
        if (prev <= 1) {
          triggerNudge("Mindfulness Call: Complete Daily Tasks ⚡", {
            body: "[Simulated 24-Hour Nudge] Step into your laboratory and keep your cognitive scores aligned!",
            icon: '/favicon.ico',
          });
          setSimActive(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simActive]);

  const triggerNudge = (title: string, options: NotificationOptions) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, options);
      } catch (err) {
        console.warn("Could not fire desktop notice, requesting fallback alert.", err);
      }
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert("Browser notification is not supported in this client.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const toggleScheduler = () => {
    const next = !schedulerEnabled;
    setSchedulerEnabled(next);
    localStorage.setItem('growth_nudge_enabled', next ? 'true' : 'false');
  };

  const startQuickTest = () => {
    if (permission !== 'granted') {
      requestPermission();
    }
    if (Notification.permission === 'granted') {
      setSimActive(true);
      setTimeRemainingSim(10); // 10s countdown for dynamic quick feedback
    }
  };

  const triggerInstantMock = () => {
    if (permission !== 'granted') {
      requestPermission();
    }
    triggerNudge("Complete Your Cognitive Growth Tasks! 🧠", {
      body: "Test active! Complete your recommended tasks to maintain your cognitive twin alignment.",
    });
  };

  return (
    <div className="glow-card p-6 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="micro-label">System Notification Engine</p>
          <p className="text-xs font-bold text-primary">Inactivity Target Nudger</p>
        </div>
        <div className={`p-1.5 rounded-full ${permission === 'granted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
          {permission === 'granted' ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </div>
      </div>

      <div className="text-[11px] leading-relaxed text-slate-500 space-y-2">
        <p>
          Locks local background triggers that detect when you have been away from your laboratory workspace for <strong>24 hours</strong>. This guides you back without relying on persistent external servers.
        </p>
      </div>

      {/* Permission Status Box */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#3c3a4f] font-mono">Browser Permits:</span>
          <span className={`font-mono font-bold uppercase ${
            permission === 'granted' ? 'text-emerald-600' : permission === 'denied' ? 'text-red-600' : 'text-amber-600'
          }`}>
            {permission}
          </span>
        </div>

        {permission !== 'granted' && (
          <button
            onClick={requestPermission}
            className="w-full mt-1.5 py-1.5 bg-accent-purple text-white text-[10px] uppercase tracking-wider font-extrabold rounded-xl hover:brightness-105 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            Activate Web Notifications
          </button>
        )}
      </div>

      {/* Settings Options Toggle */}
      <div className="flex items-center justify-between text-[11px] border-t border-black/5 pt-3">
        <span className="text-secondary font-medium">Automatic 24h Scheduler</span>
        <button
          onClick={toggleScheduler}
          className={`w-10 h-6 rounded-full p-0.5 transition-all duration-250 cursor-pointer ${
            schedulerEnabled ? 'bg-accent-purple' : 'bg-slate-200'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-all ${
            schedulerEnabled ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {schedulerEnabled && (
        <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/40 text-[10px] space-y-2 text-[#463b8d]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Last seen timestamp synchronized nicely:</span>
          </div>
          <div className="font-mono text-[9px] bg-white/60 p-1.5 rounded-lg border border-indigo-100/50 flex justify-between">
            <span>{new Date(lastLogin).toLocaleDateString()} {new Date(lastLogin).toLocaleTimeString()}</span>
            <span className="text-[#8A2BE2] font-bold">ACTIVE CYCLE</span>
          </div>
        </div>
      )}

      {/* Live Interactive Verification Tester */}
      <div className="border-t border-black/5 pt-3 space-y-2">
        <button
          onClick={() => setShowTester(!showTester)}
          className="text-[10px] uppercase tracking-wider font-extrabold text-accent-blue hover:underline flex items-center justify-between w-full cursor-pointer"
        >
          <span>{showTester ? 'Hide' : 'Show'} Interactive Sandbox Tools</span>
          <span>{showTester ? '▲' : '▼'}</span>
        </button>

        <AnimatePresence>
          {showTester && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2.5">
                <p className="text-[9px] font-mono text-zinc-400">
                  Because 24 hours is a long wait, simulate standard triggers in real-time below:
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    onClick={triggerInstantMock}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-[#150ms] border border-white/5 font-medium flex items-center gap-1.5 justify-center cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-accent-emerald" />
                    Instant Pop Up
                  </button>

                  <button
                    disabled={simActive}
                    onClick={startQuickTest}
                    className="p-2 rounded-xl bg-accent-purple hover:brightness-105 transition-all font-medium flex items-center gap-1.5 justify-center disabled:opacity-50 cursor-pointer text-white"
                  >
                    <Play className="w-3.5 h-3.5 text-white" />
                    Simulate 10s Timer
                  </button>
                </div>

                {simActive && (
                  <div className="bg-black/60 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 animate-pulse">Running Inactivity Count:</span>
                    <span className="text-xs font-mono font-bold text-yellow-400">{timeRemainingSim}s</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
