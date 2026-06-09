import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Wind, Brain, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

export const ResilienceModule = ({ profile, onUpdateProfile }: { profile: any, onUpdateProfile: (p: any) => void }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'strategies' | 'exercises'>('status');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const resilienceScore = profile.metrics?.resilienceScore || 50;
  
  const getStressLevel = () => {
    if (resilienceScore > 80) return { label: 'Optimal Fluidity', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (resilienceScore > 60) return { label: 'Stable Resilience', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (resilienceScore > 40) return { label: 'Moderate Load', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { label: 'Critical Fatigue', color: 'text-rose-500', bg: 'bg-rose-500/10' };
  };

  const status = getStressLevel();

  const exercises = [
    { 
      id: 'box-breathing', 
      title: 'Box Breathing', 
      desc: 'Symmetrically stabilize your autonomic nervous system.', 
      icon: Wind,
      duration: '4 mins',
      steps: ['Inhale for 4s', 'Hold for 4s', 'Exhale for 4s', 'Hold for 4s']
    },
    { 
      id: 'reframing', 
      title: 'Cognitive Reframing', 
      desc: 'Transform stressful constraints into growth vectors.', 
      icon: Brain,
      duration: '5 mins',
      steps: ['Identify the stressor', 'Challenge the "Must"', 'Synthesize a positive alternative']
    },
    { 
      id: 'grounding', 
      title: '5-4-3-2-1 Grounding', 
      desc: 'Rapid neural reset during sensory overload.', 
      icon: Sparkles,
      duration: '2 mins',
      steps: ['5 things you see', '4 things you feel', '3 things you hear', '2 things you smell', '1 thing you taste']
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 lg:p-10 space-y-8 overflow-y-auto">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
            <Shield className="w-5 h-5 text-accent-blue" />
          </div>
          <h1 className="text-3xl font-serif italic text-primary tracking-tight">Cognitive Resilience</h1>
        </div>
        <p className="text-slate-400 max-w-xl">
          Analyzing your neural stability markers to personalize stress management and recovery protocols.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Current Neural State</h2>
            <div className="flex items-center justify-between">
              <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", status.bg, status.color)}>
                {status.label}
              </span>
              <span className="text-2xl font-mono text-primary">{resilienceScore}%</span>
            </div>
            
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${resilienceScore}%` }}
                className={cn("h-full", resilienceScore < 40 ? "bg-rose-500" : "bg-accent-blue")}
              />
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                {resilienceScore < 50 
                  ? "Your resilience markers are below baseline. This indicates potential cognitive load accumulation. Priority: Neural Decompression." 
                  : "Excellent stability. Your system is efficiently processing complex vectors with minimal noise."}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase">
                <CheckCircle2 className="w-3 h-3" />
                Adaptive Protocols Initialized
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Resource Optimization</h2>
            <div className="space-y-4">
              <Recommendation icon={Heart} label="Emotional Anchor" value="Community" />
              <Recommendation icon={Braindatagram} label="Cognitive Load" value="Optimal" />
              <Recommendation icon={AlertCircle} label="Fatigue Risk" value="Low" />
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
            {['status', 'strategies', 'exercises'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-white/5 text-primary" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'exercises' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {exercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(selectedExercise === ex.id ? null : ex.id)}
                    className={cn(
                      "group p-6 rounded-3xl border text-left transition-all duration-500",
                      selectedExercise === ex.id 
                        ? "bg-accent-blue/10 border-accent-blue/40 ring-1 ring-accent-blue/20" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-2xl transition-colors duration-500",
                        selectedExercise === ex.id ? "bg-accent-blue/20" : "bg-white/5"
                      )}>
                        <ex.icon className={cn("w-5 h-5", selectedExercise === ex.id ? "text-accent-blue" : "text-slate-500")} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{ex.duration}</span>
                    </div>
                    <h3 className="text-lg font-medium text-primary mb-2">{ex.title}</h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">{ex.desc}</p>
                    
                    {selectedExercise === ex.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-3 pt-4 border-t border-accent-blue/20"
                      >
                        {ex.steps.map((step, i) => (
                          <div key={i} className="flex gap-3 items-center">
                            <span className="text-[10px] font-mono text-accent-blue">{i + 1}</span>
                            <span className="text-xs text-slate-300">{step}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-accent-blue/60 group-hover:text-accent-blue uppercase tracking-widest">
                      {selectedExercise === ex.id ? 'Active' : 'Initiate Sequence'}
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {activeTab === 'strategies' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <StrategyCard 
                  title="Noise Reduction" 
                  desc="Your current logic-high profile suggests that verbal noise significantly impacts decision-making. Implement 25-minute deep-work cycles with auditory isolation."
                />
                <StrategyCard 
                  title="Cognitive Boundarying" 
                  desc="Transition from high-complexity technical tasks to narrative-based processing occurs too abruptly. Implement a 10-minute 'Neural Reset' between task segments."
                />
                <StrategyCard 
                  title="Perspective Reframing" 
                  desc="When experiencing a 'Risk Block' (Risk Score < 30), reframe the potential failure as a data-collection iteration rather than a survival threat."
                />
              </motion.div>
            )}

            {activeTab === 'status' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-blue/20 blur-3xl rounded-full" />
                  <Heart className="w-16 h-16 text-accent-blue relative animate-pulse" />
                </div>
                <h2 className="text-2xl font-medium tracking-tight">System Empathy Active</h2>
                <p className="text-slate-400 max-w-sm">
                  We've initialized real-time stress tracking. Your cognitive twin is now watching for patterns of fatigue to suggest micro-breaks before performance degradation occurs.
                </p>
                <button 
                  onClick={() => setActiveTab('exercises')}
                  className="px-8 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Explore Relief Protocols
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Recommendation = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
    </div>
    <span className="text-xs font-medium text-slate-300">{value}</span>
  </div>
);

const StrategyCard = ({ title, desc }: any) => (
  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 hover:bg-white/[0.04] transition-all">
    <h3 className="text-sm font-bold uppercase tracking-widest text-accent-blue">{title}</h3>
    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const Braindatagram = ({ className }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3.5 2.5 2.5 0 0 0-3.32 3.6 2.5 2.5 0 0 0 3.32 3.6 2.5 2.5 0 0 0 1.98 3.5 2.5 2.5 0 0 0 4.96-.46" />
    <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3.5 2.5 2.5 0 0 1 3.32 3.6 2.5 2.5 0 0 1-3.32 3.6 2.5 2.5 0 0 1-1.98 3.5 2.5 2.5 0 0 1-4.96-.46" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
