import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Key, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Zap, 
  Lock, 
  EyeOff, 
  Database, 
  Server,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { SparkleBackground } from './SparkleBackground';
import { getApiKeyInfo } from '../services/geminiService';

interface ApiConfigViewProps {
  onClose: () => void;
}

export const ApiConfigView: React.FC<ApiConfigViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'credentials' | 'tracking' | 'security'>('credentials');
  
  // Credentials Tab states
  const [userKey, setUserKey] = useState('');
  const [keyInfo, setKeyInfo] = useState(getApiKeyInfo());
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Tracking Tab states
  const [diagnosticsLogs, setDiagnosticsLogs] = useState(true);
  const [telemetrySignals, setTelemetrySignals] = useState(false);
  const [acuityAutoLogging, setAcuityAutoLogging] = useState(true);
  const [trackingShowConfirm, setTrackingShowConfirm] = useState(false);

  // Load state on mount
  useEffect(() => {
    // 1. Credentials
    let saved = '';
    try {
      saved = localStorage.getItem('COGNITIVE_TWIN_USER_KEY') || '';
    } catch (e) {}
    setUserKey(saved);
    setKeyInfo(getApiKeyInfo());

    // 2. Tracking Toggles
    try {
      const diag = localStorage.getItem('COGNITIVE_TWIN_DIAGNOSTICS_ENABLED');
      if (diag !== null) setDiagnosticsLogs(diag === 'true');
      
      const telem = localStorage.getItem('COGNITIVE_TWIN_TELEMETRY_ENABLED');
      if (telem !== null) setTelemetrySignals(telem === 'true');

      const acuity = localStorage.getItem('COGNITIVE_TWIN_AUTO_LOGGING');
      if (acuity !== null) setAcuityAutoLogging(acuity === 'true');
    } catch (e) {}
  }, []);

  // Save personal API credentials
  const handleSaveCredentials = () => {
    try {
      if (userKey.trim()) {
        localStorage.setItem('COGNITIVE_TWIN_USER_KEY', userKey.trim());
      } else {
        localStorage.removeItem('COGNITIVE_TWIN_USER_KEY');
      }
    } catch (e) {}
    setKeyInfo(getApiKeyInfo());
    setIsEditing(false);
    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
      // Fire simulated event to refresh key settings in intelligence modules
      window.dispatchEvent(new CustomEvent('api-key-updated'));
    }, 3000);
  };

  // Disconnect credential link
  const handleClearCredentials = () => {
    try {
      localStorage.removeItem('COGNITIVE_TWIN_USER_KEY');
    } catch (e) {}
    setUserKey('');
    setKeyInfo(getApiKeyInfo());
    setIsEditing(false);
    // Fire simulated event to refresh key settings in intelligence modules
    window.dispatchEvent(new CustomEvent('api-key-updated'));
  };

  // Save tracking parameters
  const handleSaveTracking = () => {
    try {
      localStorage.setItem('COGNITIVE_TWIN_DIAGNOSTICS_ENABLED', String(diagnosticsLogs));
      localStorage.setItem('COGNITIVE_TWIN_TELEMETRY_ENABLED', String(telemetrySignals));
      localStorage.setItem('COGNITIVE_TWIN_AUTO_LOGGING', String(acuityAutoLogging));
    } catch (e) {}
    setTrackingShowConfirm(true);
    setTimeout(() => setTrackingShowConfirm(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-[#faf8fc]/90 backdrop-blur-3xl flex flex-col font-sans select-none pb-12 text-secondary"
    >
      <SparkleBackground intensity="normal" />

      {/* Premium Sticky Navigation Header matching ContactView perfectly */}
      <div className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-purple-100/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8161e1] to-[#9979f4] flex items-center justify-center text-white shadow-md shadow-indigo-600/10">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-serif italic font-bold text-[#322851]">API Configuration</span>
            <span className="text-[9px] uppercase tracking-widest block font-bold text-[#8c78a5]">Secure Keys & Telemetry Controls</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="hidden md:flex bg-white/70 border border-purple-100/65 rounded-full p-1 gap-1">
          {([
            { id: 'credentials', label: 'Security Credentials', icon: Key },
            { id: 'tracking', label: 'Tracking Controls', icon: Sliders },
            { id: 'security', label: 'Security & Protections', icon: ShieldCheck }
          ] as const).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full font-sans transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#8161e1] to-[#9979f4] text-white shadow-sm' 
                    : 'text-[#6a427f] hover:bg-white/90 hover:text-[#8161e1]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-purple-100 bg-white hover:bg-rose-50 text-[#6a427f] hover:text-rose-600 flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6 pt-8 flex-1 flex flex-col">
        
        {/* Mobile Tab Control Select bar */}
        <div className="flex md:hidden bg-white/80 border border-purple-100 rounded-2xl p-2 gap-1 mb-6 flex-wrap justify-center shadow-sm">
          {([
            { id: 'credentials', label: 'Keys', icon: Key },
            { id: 'tracking', label: 'Tracking', icon: Sliders },
            { id: 'security', label: 'Security', icon: ShieldCheck }
          ] as const).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#8161e1] to-[#9979f4] text-white shadow-sm' 
                    : 'text-[#6a427f] hover:bg-[#ebdff2]'
                }`}
              >
                <Icon className="w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents Panels */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {/* 1. CREDENTIALS PANEL */}
            {activeTab === 'credentials' && (
              <motion.div
                key="credentials-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                <div className="text-center max-w-2xl mx-auto space-y-4 py-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">Neural Node Setup</span>
                  <h1 className="text-4xl font-serif italic text-[#322851] tracking-tight">"Configure API Access Keys"</h1>
                  <p className="text-[#6e5380] text-sm font-light leading-relaxed">
                    By default, the Cognitive Twin utilizes the shared global laboratory bandwidth. Establish a dedicated personal link to unlock uncapped high-performance neural mapping modules.
                  </p>
                </div>

                <div className="grid md:grid-cols-5 gap-8 max-w-3xl mx-auto items-start">
                  
                  {/* Left Column: Direct Info Badge Cards */}
                  <div className="md:col-span-2 space-y-4">
                    
                    {/* active link status badge */}
                    <div className="p-5 bg-white/70 border border-purple-100 rounded-3xl flex flex-col space-y-3 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-[#8161e1]">
                        <Server className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#322851] uppercase tracking-wider font-sans">Active Link Status</h4>
                      <div>
                        {keyInfo.isUserKey ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Personal API Link
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Public Lab Bandwidth
                          </div>
                        )}
                        <p className="text-[10px] text-slate-500 font-mono mt-2 leading-tight uppercase">
                          System Performance: {keyInfo.isUserKey ? 'PREMIUM ACCESS' : 'STANDARD CAP'}
                        </p>
                      </div>
                    </div>

                    {/* storage secure assurance card */}
                    <div className="p-5 bg-white/70 border border-purple-100 rounded-3xl flex flex-col space-y-3 shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500">
                        <Lock className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#322851] uppercase tracking-wider font-sans">Local Security Guarantee</h4>
                      <p className="text-[10px] text-slate-600 leading-normal font-light">
                        Credentials reside exclusively inside your offline sandboxed local storage engine. Keys never travel to our databases or administrative dashboards.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Interaction Form */}
                  <div className="md:col-span-3 bg-white border border-purple-150 p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 text-left space-y-6">
                    
                    <div className="flex gap-4">
                      {/* Public selection pill */}
                      <button 
                        onClick={handleClearCredentials}
                        className={`flex-1 p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                          !keyInfo.isUserKey 
                            ? 'bg-indigo-500/5 border-indigo-500/30 ring-1 ring-indigo-500/20' 
                            : 'bg-slate-50/50 border-purple-100 opacity-60 hover:opacity-100 hover:bg-slate-50'
                        }`}
                      >
                        <Zap className={`w-5 h-5 mx-auto mb-2 ${!keyInfo.isUserKey ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <h4 className="text-xs font-bold text-[#322851] uppercase">Free Server</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Shared laboratory capacity. Standard speeds.</p>
                      </button>

                      {/* Personal key selection pill */}
                      <button 
                        onClick={() => setIsEditing(true)}
                        className={`flex-1 p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                          keyInfo.isUserKey 
                            ? 'bg-emerald-500/5 border-emerald-500/30 ring-1 ring-emerald-500/20' 
                            : 'bg-slate-50/50 border-purple-100 opacity-60 hover:opacity-100 hover:bg-slate-50'
                        }`}
                      >
                        <Sparkles className={`w-5 h-5 mx-auto mb-2 ${keyInfo.isUserKey ? 'text-emerald-550' : 'text-slate-400'}`} />
                        <h4 className="text-xs font-bold text-[#322851] uppercase">Personal Access</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Direct Google model endpoints. Premium speeds.</p>
                      </button>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-sans block">Personal Google Gemini API Key</label>
                        <div className="flex gap-2">
                          <input 
                            type="password" 
                            value={userKey}
                            onChange={(e) => {
                              setUserKey(e.target.value);
                              setIsEditing(true);
                            }}
                            placeholder={keyInfo.isUserKey ? "••••••••••••••••••••••••••••••••••••" : "AI Studio Access Token..."}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-purple-100 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#8161e1] outline-none text-slate-800 font-mono"
                          />
                          {(isEditing || userKey !== (localStorage.getItem('COGNITIVE_TWIN_USER_KEY') || '')) ? (
                            <button 
                              onClick={handleSaveCredentials}
                              className="px-5 bg-gradient-to-r from-[#8161e1] to-[#9979f4] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-98 transition-all cursor-pointer"
                            >
                              Sync key
                            </button>
                          ) : null}
                        </div>
                        {keyInfo.isUserKey && (
                          <button 
                            onClick={handleClearCredentials}
                            className="text-[9px] text-rose-500/80 hover:text-rose-600 uppercase tracking-widest font-bold transition-all font-sans cursor-pointer mt-1"
                          >
                            Disconnect Personal Credentials
                          </button>
                        )}
                      </div>

                      <div className="p-4 bg-[#fcfbfe] border border-purple-100 rounded-2xl flex gap-3.5 items-start">
                        <Info className="w-4.5 h-4.5 text-[#8161e1] shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                          API keys enable seamless text synthesis and career-matching analysis. Obtain yours on the official <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-[#8161e1] hover:underline font-bold inline-flex items-center gap-0.5">Google AI Studio Portal</a> platform for free.
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showConfirm && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-emerald-600 text-xs font-semibold justify-center bg-emerald-50 border border-emerald-100 p-3 rounded-xl"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Personal API Link Successfully Establish & Synced</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. TRACKING PANEL */}
            {activeTab === 'tracking' && (
              <motion.div
                key="tracking-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                <div className="text-center max-w-2xl mx-auto space-y-4 py-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">Telemetry Matrix</span>
                  <h1 className="text-4xl font-serif italic text-[#322851] tracking-tight">"Manage Optional Tracking features"</h1>
                  <p className="text-[#6e5380] text-sm font-light leading-relaxed">
                    Control active data capture mechanisms. Toggle background diagnostic tracking, research signal transmissions, and automated mental mapping log cycles to fit your requirements.
                  </p>
                </div>

                <div className="max-w-2xl mx-auto bg-white border border-purple-150 p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 space-y-6">
                  
                  {/* Selector Toggle 1 */}
                  <div className="flex items-start justify-between gap-6 pb-5 border-b border-purple-50">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#322851] flex items-center gap-2">
                        Diagnostics & Sessional Event Logging
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed font-light">
                        Logs local coordinate transitions so they populate the Live Session Log screen correctly. Highly recommended for sessional evaluation validation.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setDiagnosticsLogs(!diagnosticsLogs)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all cursor-pointer ${
                        diagnosticsLogs ? 'bg-[#8161e1]' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                        diagnosticsLogs ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Selector Toggle 2 */}
                  <div className="flex items-start justify-between gap-6 pb-5 border-b border-purple-50">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#322851] flex items-center gap-2">
                        Research & Anonymous Telemetry Signals
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed font-light">
                        Sends strictly anonymized high-dimensional model classifications to our thesis testing database for research statistics. Excludes any personal identifier text.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setTelemetrySignals(!telemetrySignals)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all cursor-pointer ${
                        telemetrySignals ? 'bg-[#8161e1]' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                        telemetrySignals ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Selector Toggle 3 */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#322851] flex items-center gap-2">
                        Passive Mind Acuity Logging
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed font-light">
                        Passively records brain acuity, chronological energy cycles, and performance indicators in local memory files to construct your Temporal Sparkline trends.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setAcuityAutoLogging(!acuityAutoLogging)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all cursor-pointer ${
                        acuityAutoLogging ? 'bg-[#8161e1]' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                        acuityAutoLogging ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-purple-50">
                    <span className="text-[10px] text-slate-400 font-mono italic">
                      Adjustments take immediate effect across dynamic models.
                    </span>
                    <button 
                      onClick={handleSaveTracking}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#8161e1] to-[#9979f4] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-98 shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      Save Configuration Settings
                    </button>
                  </div>

                  <AnimatePresence>
                    {trackingShowConfirm && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-emerald-600 text-xs font-semibold justify-center bg-emerald-50 border border-emerald-100 p-3 rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Tracking Parameters Successfully Upgraded</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            )}

            {/* 3. SECURITY PANEL */}
            {activeTab === 'security' && (
              <motion.div
                key="security-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                <div className="text-center max-w-3xl mx-auto space-y-4 py-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">Sovereign Controls</span>
                  <h2 className="text-3xl font-serif italic text-[#322851]">Security Controls & Integrity Assurances</h2>
                  <p className="text-[#6e5380] text-xs md:text-sm font-light leading-relaxed">
                     Rigorous guidelines ensuring the safe, non-custodial handling of administrative tokens, session states, and credentials.
                  </p>
                </div>

                {/* Academic declaration papers card */}
                <div className="bg-white/80 border border-purple-100/75 p-8 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 space-y-6 text-left max-w-3xl mx-auto">
                  
                  <div className="border-l-4 border-[#8161e1] pl-4 space-y-2">
                    <h3 className="text-sm font-bold text-[#322851] uppercase tracking-wider flex items-center gap-2">
                       Cryptographic Key Sandbox Isolation
                    </h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      All Personal Gemini API keys configured on this platform undergo sandboxed injection. They reside only inside client-side virtual boundaries, securely preventing server-side leakage, extraction attempts, or credential pooling.
                    </p>
                  </div>

                  <div className="border-l-4 border-pink-500 pl-4 space-y-2">
                    <h3 className="text-sm font-bold text-[#322851] uppercase tracking-wider flex items-center gap-2">
                       Non-Custodial Transit Pipeline
                    </h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      Cognitive Twin's synthesis processes run directly on public Google API nodes. Key strings are never cached, compiled, or stored inside intermediate proxy routing servers. They bypass corporate logging interfaces entirely.
                    </p>
                  </div>

                  <div className="border-l-4 border-indigo-500 pl-4 space-y-2">
                    <h3 className="text-sm font-bold text-[#322851] uppercase tracking-wider flex items-center gap-2">
                       Absolute Autonomy Reset Handles
                    </h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      Should you decide to clear or rotate your personal access key, clicking the "Disconnect" control triggers immediate garbage collection across the browser, completely purging all key values from localized storage. There are absolutely no digital footprints left.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};
