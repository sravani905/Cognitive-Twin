import React, { useState, useEffect } from 'react';
import { Key, Shield, Zap, Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getApiKeyInfo } from '../services/geminiService';

export const ApiKeySettings = () => {
  const [userKey, setUserKey] = useState('');
  const [keyInfo, setKeyInfo] = useState(getApiKeyInfo());
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let saved = '';
    try {
      saved = localStorage.getItem('COGNITIVE_TWIN_USER_KEY') || '';
    } catch (e) {}
    setUserKey(saved);
    setKeyInfo(getApiKeyInfo());
  }, []);

  const handleSave = () => {
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
    setTimeout(() => setShowConfirm(false), 3000);
  };

  const handleClear = () => {
    try {
      localStorage.removeItem('COGNITIVE_TWIN_USER_KEY');
    } catch (e) {}
    setUserKey('');
    setKeyInfo(getApiKeyInfo());
    setIsEditing(false);
  };

  return (
    <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-accent-blue/10">
            <Key className="w-6 h-6 text-accent-blue" />
          </div>
          <div>
            <h3 className="text-xl font-serif italic text-primary">Neural Access Link</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-1">
              API Configuration & Quota Management
            </p>
          </div>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-[10px] font-bold uppercase tracking-widest text-accent-blue hover:text-white transition-colors"
          >
            {keyInfo.isUserKey ? "Update Link" : "Establish Personal Link"}
          </button>
        )}
      </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div 
              onClick={handleClear}
              className={cn(
                "p-6 rounded-3xl border transition-all space-y-3 cursor-pointer flex-1",
                !keyInfo.isUserKey 
                  ? "bg-accent-blue/5 border-accent-blue/30 shadow-[0_0_20px_rgba(0,174,239,0.1)]" 
                  : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between">
                <Shield className="w-5 h-5 text-accent-blue" />
                {!keyInfo.isUserKey && <div className="px-2 py-1 bg-accent-blue text-[8px] font-bold rounded-full text-white uppercase animate-pulse">ACTIVE FREE LINK</div>}
              </div>
              <h4 className="text-sm font-medium text-primary">System Capacity (Free)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Utilize the global cognitive bandwidth. No setup required.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-accent-blue">
                <Zap className="w-3 h-3" />
                <span>Standard Performance</span>
              </div>
            </div>

            <div 
              onClick={() => setIsEditing(true)}
              className={cn(
                "p-6 rounded-3xl border transition-all space-y-3 cursor-pointer flex-1",
                keyInfo.isUserKey 
                  ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                  : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                {keyInfo.isUserKey && <div className="px-2 py-1 bg-emerald-500 text-[8px] font-bold rounded-full text-white uppercase animate-pulse">DIRECT LINK ACTIVE</div>}
              </div>
              <h4 className="text-sm font-medium text-primary">Personal Access</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unlock high-bandwidth neural synchronization with your own link.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500">
                <Zap className="w-3 h-3" />
                <span>Premium Performance</span>
              </div>
            </div>
          </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Personal Gemini API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    value={userKey}
                    onChange={(e) => setUserKey(e.target.value)}
                    placeholder="Enter your Google AI Studio API Key..."
                    className="flex-1 bg-surface border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-accent-blue transition-all"
                  />
                  <button 
                    onClick={handleSave}
                    className="px-6 bg-accent-blue text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
                  >
                    Sync
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-4 bg-white/5 text-slate-400 rounded-2xl hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
                {keyInfo.isUserKey && (
                  <button 
                    onClick={handleClear}
                    className="text-[9px] text-red-400/60 hover:text-red-400 uppercase tracking-widest font-bold ml-1 transition-colors"
                  >
                    Disconnect Personal Link
                  </button>
                )}
              </div>
              
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                <Info className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Your key is stored locally in your browser and never leaves this instance except to communicate with Google's AI nodes. 
                  You can obtain a key for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">Google AI Studio</a>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-emerald-500 text-xs font-medium justify-center pt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Neural Link Successfully Synchronized</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
