import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, ChevronRight, AlertTriangle, MessageSquare, Send, Sparkles, 
  Search, Bell, User, Clock, Check, ChevronDown, Award, Compass, Heart, BrainCircuit
} from 'lucide-react';
import { chatWithTwinStream, getHeuristicChatReply } from '../services/geminiService';
import { cn } from '../lib/utils';

interface AestheticDashboardProps {
  metrics: any;
  insights: any;
  knnMatches: any[];
  user: any;
  onLaunchRoadmap: (career: string) => void;
  onNewAssessment: () => void;
  onStartFresh: () => void;
  completedGrowthAreas: string[];
  onToggleGrowthArea: (skill: string) => void;
}

export const AestheticDashboard: React.FC<AestheticDashboardProps> = ({
  metrics,
  insights,
  knnMatches,
  user,
  onLaunchRoadmap,
  onNewAssessment,
  onStartFresh,
  completedGrowthAreas,
  onToggleGrowthArea,
}) => {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio Focus Synthesizer State (Web Audio API)
  const [isPlayingFocus, setIsPlayingFocus] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ oscillator1: OscillatorNode; oscillator2: OscillatorNode; biquadFilter: BiquadFilterNode; gainNode: GainNode } | null>(null);

  // Gemini assistant widget inline state
  const [geminiQuery, setGeminiQuery] = useState('');
  const [geminiResponses, setGeminiResponses] = useState<string[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);

  // Default career matches when metrics are incomplete / fresh
  const defaultMatches = [
    { title: "Quantum Researcher", match: 92, sim: "d 0.4 = 0.4" },
    { title: "Narrative Designer", match: 88, sim: "d 0.6 = 0.6" },
    { title: "Behavioral Scientist", match: 84, sim: "d 0.6 = 0.8" },
    { title: "Data Architect", match: 79, sim: "d 0.8 = 0.6" }
  ];

  const displayMatches = knnMatches.length > 0 
    ? knnMatches.map((m, idx) => {
        const title = m.title || m.career || "Career Path";
        const affinity = typeof m.affinityScore === 'number' ? m.affinityScore : (typeof m.match === 'number' ? m.match : 80);
        const similarity = typeof m.similarity === 'number' ? m.similarity : (affinity / 100);
        return {
          title,
          match: Math.round(similarity * 100),
          sim: `d ${(1.0 - similarity).toFixed(1)} = ${similarity.toFixed(1)}`
        };
      })
    : defaultMatches;

  // Render gauges score
  const analyticalScore = Math.round((metrics?.logicScore + metrics?.numericalScore + metrics?.abstractScore) / 3) || 75;
  const executionScore = Math.round((metrics?.executiveScore + metrics?.speedScore + metrics?.focusScore) / 3) || 80;

  // Ambient Web Audio Synthesizer: Focus mode pads
  const toggleFocusAudio = () => {
    if (isPlayingFocus) {
      // Fade out and close
      if (audioNodesRef.current?.gainNode && audioCtxRef.current) {
        const gain = audioNodesRef.current.gainNode;
        gain.gain.setValueAtTime(gain.gain.value, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 1.2);
        setTimeout(() => {
          try {
            audioNodesRef.current?.oscillator1.stop();
            audioNodesRef.current?.oscillator2.stop();
            audioCtxRef.current?.close();
            audioCtxRef.current = null;
            audioNodesRef.current = null;
          } catch (e) {}
        }, 1300);
      }
      setIsPlayingFocus(false);
    } else {
      // Lazy init AudioContext
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Custom synthesizer: soft multi-oscillator relaxation pad
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        // 110Hz deep grounding carrier
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(110, ctx.currentTime);

        // 165Hz fifth interval harmonic for rich periwinkle vibe
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(165.4, ctx.currentTime);

        // Smooth lowpass filter to sound atmospheric, like space rain
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        // Soft starting amplitude
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.0);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        audioNodesRef.current = { oscillator1: osc1, oscillator2: osc2, biquadFilter: filter, gainNode };
        setIsPlayingFocus(true);
      } catch (e) {
        console.error("Audio Synthesis bypassed:", e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleGeminiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiQuery.trim() || isAnswering) return;
    
    const query = geminiQuery;
    setGeminiQuery('');
    setGeminiResponses(prev => [...prev, `You: ${query}`]);
    setIsAnswering(true);

    try {
      if (!navigator.onLine) {
        setGeminiResponses(prev => [...prev, "Assistant: Neural Sync Offline. Focus routine suggestion: Keep hydrated and complete memory recall games."]);
        setIsAnswering(false);
        return;
      }

      // Inline stream block
      const chatMessages = [
        { role: 'user' as const, content: query }
      ];
      
      const stream = await chatWithTwinStream(
        chatMessages, 
        { metrics, insights }, 
        "Keep responses very short, insightful, stylish and under 2 sentences."
      );

      let buffer = '';
      for await (const chunk of stream) {
        buffer += (chunk.text || '');
      }

      setGeminiResponses(prev => [...prev, `Assistant: ${buffer || "Calibration parameters updated."}`]);
    } catch (err) {
      const fallback = getHeuristicChatReply(query, { metrics, insights });
      setGeminiResponses(prev => [...prev, `Assistant: ${fallback}`]);
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      
      {/* 1. CELESTIAL STARRY HEADER BANNER */}
      <div className="relative rounded-3xl p-8 overflow-hidden bg-gradient-to-r from-[#2c2354] via-[#483a7c] to-[#251e44] shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between text-white group">
        
        {/* Animated Background stars & space wind */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px] animate-[pulse_6s_infinite_alternate]" />
        
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight drop-shadow-md">
              Cogme Twin
            </h1>
            <Sparkles className="w-6 h-6 text-accent-violet animate-bounce" />
          </div>
          <p className="font-mono text-xs text-accent-violet/90 uppercase tracking-[0.2em]">
            AI Mind Reflection
          </p>
          <p className="text-sm font-light text-white/70 max-w-lg">
            "Your Cognitive Twin adapts and grows along with you."
          </p>
        </div>

        {/* Global Search everything bar */}
        <div className="relative z-10 w-full md:w-80 mt-6 md:mt-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search everything..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/40 rounded-full px-6 py-3 text-sm text-white placeholder-white/50 focus:outline-none transition-all pl-12 shadow-inner"
            />
            <Search className="w-4 h-4 text-white/50 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 2. CORE GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MAIN COLUMN (LEFT SIDE CENTRE - 8 COLS) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. SELF SNAPSHOT (METRIC HIGHLIGHTS & GAUGES) */}
          <div className="glow-card p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif italic text-primary">Self Snapshot</h3>
                <p className="micro-label">Current cognitive stability metrics</p>
              </div>
              <div className="flex items-center gap-1 bg-accent-purple/10 text-accent-purple px-3 py-1 rounded-full text-[10px] font-semibold font-mono">
                <span>Targets focused</span>
                <Check className="w-3 h-3" />
              </div>
            </div>

            {/* Metric Gauges Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              
              {/* Gauge 1: Analytical Balance */}
              <div className="flex flex-col items-center p-6 bg-white/20 dark:bg-black/5 rounded-2xl border border-white/40 relative group">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  
                  {/* Gauge SVG Ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="72" cy="72" r="54" 
                      stroke="rgba(129,97,225,0.15)" strokeWidth="8" fill="transparent" 
                    />
                    <motion.circle 
                      cx="72" cy="72" r="54" 
                      stroke="var(--accent-purple)" strokeWidth="8" fill="transparent"
                      strokeDasharray="339"
                      initial={{ strokeDashoffset: 339 }}
                      animate={{ strokeDashoffset: 339 - (339 * analyticalScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Value center */}
                  <div className="absolute text-center">
                    <span className="text-3xl font-serif text-primary italic font-bold">
                      {analyticalScore}
                    </span>
                    <span className="text-xs text-muted block">%</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs font-semibold text-primary">Analytical Balance</p>
                  <p className="text-[10px] text-muted tracking-wide font-mono">Logic & Rational focus</p>
                </div>
              </div>

              {/* Gauge 2: Execution Precision */}
              <div className="flex flex-col items-center p-6 bg-white/20 dark:bg-black/5 rounded-2xl border border-white/40 relative group">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  
                  {/* Gauge SVG Ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="72" cy="72" r="54" 
                      stroke="rgba(85,135,240,0.15)" strokeWidth="8" fill="transparent" 
                    />
                    <motion.circle 
                      cx="72" cy="72" r="54" 
                      stroke="var(--accent-blue)" strokeWidth="8" fill="transparent"
                      strokeDasharray="339"
                      initial={{ strokeDashoffset: 339 }}
                      animate={{ strokeDashoffset: 339 - (339 * executionScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Value center */}
                  <div className="absolute text-center">
                    <span className="text-3xl font-serif text-primary italic font-bold">
                      {executionScore}
                    </span>
                    <span className="text-xs text-muted block">%</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs font-semibold text-primary">Execution Precision</p>
                  <p className="text-[10px] text-muted tracking-wide font-mono">Attention & Velocity rate</p>
                </div>
              </div>

            </div>

            {/* Quick Alignment indicator */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-accent-purple/[0.04] border border-accent-purple/10 rounded-2xl gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <p className="text-xs text-primary font-medium">
                  {displayMatches[0].title} Alignment: <span className="font-bold text-accent-purple">{displayMatches[0].match}%</span>
                </p>
              </div>
              <button 
                onClick={() => onLaunchRoadmap(displayMatches[0].title)}
                className="text-[10px] font-bold text-accent-purple uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <span>Launch Roadmap</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Yellow warning bar */}
            <div className="bg-[#fef9c3] border border-[#fef08a] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold font-mono uppercase tracking-wider">Jitter Warning</p>
                  <p className="text-[10px] text-amber-900 leading-relaxed">Neural fatigue indicator exceeds threshold limit. Consider activating rain ambient.</p>
                </div>
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-700 font-mono shrink-0">Fatigue Alert</span>
            </div>
          </div>

          {/* B. ARCHETYPE ROADMAP EXPANDED */}
          <div className="glow-card p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif italic text-primary">Archetype Roadmap</h3>
                <p className="micro-label">Dynamic focus areas personalized for growth</p>
              </div>
              <span className="font-mono text-[10px] text-muted uppercase">Target: Focus</span>
            </div>

            <div className="space-y-4">
              
              {/* Row 1 */}
              <div className="p-4 bg-white/20 dark:bg-black/5 rounded-2xl border border-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-purple" />
                    <p className="text-sm font-semibold text-primary">Memory Mastery</p>
                  </div>
                  <p className="text-[10px] font-mono text-muted">Core dynamic scale factor: 120.96</p>
                </div>
                <button 
                  onClick={() => onLaunchRoadmap(displayMatches[1]?.title || "Narrative Designer")}
                  className="px-4 py-2 bg-accent-purple text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:brightness-110 shadow-sm"
                >
                  Personalized Coaching
                </button>
              </div>

              {/* Row 2 */}
              <div className="p-4 bg-white/20 dark:bg-black/5 rounded-2xl border border-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                    <p className="text-sm font-semibold text-primary">Mental Agility</p>
                  </div>
                  <p className="text-[10px] font-mono text-muted">Core dynamic scale factor: 110.42</p>
                </div>
                <button 
                  onClick={() => onLaunchRoadmap(displayMatches[0].title)}
                  className="px-4 py-2 bg-[#818cf8] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#6366f1] shadow-sm"
                >
                  Action Plan
                </button>
              </div>

              {/* Row 3 */}
              <div className="p-4 bg-white/20 dark:bg-black/5 rounded-2xl border border-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald" />
                    <p className="text-sm font-semibold text-primary">Sleep & Focus Routine</p>
                  </div>
                  <p className="text-[10px] font-mono text-muted">Circadian sync alignment logic active</p>
                </div>
                <button 
                  onClick={() => alert("Deep Breathing & Sensory relaxation guidelines loaded.")}
                  className="px-4 py-2 bg-accent-emerald text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:brightness-115 shadow-sm"
                >
                  Personalized Coaching
                </button>
              </div>

            </div>
          </div>

          {/* C. INLINE GEMINI LM ASSISTANT CARD */}
          <div className="glow-card p-8 rounded-3xl bg-gradient-to-br from-white/60 via-white/40 to-white/10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple relative">
                <BrainCircuit className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-primary">Gemini LM Console</h4>
                <p className="text-[10px] text-muted">Active heuristic reasoning engine</p>
              </div>
            </div>

            {/* Bubble log */}
            <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar py-3 border-b border-black/5">
              <div className="p-4 rounded-2xl bg-accent-purple/[0.03] border border-accent-purple/5 text-xs text-primary leading-relaxed">
                "Want tips for improving your sleep quality?" Type <strong className="text-accent-purple">generate sleep tips</strong> below to get real-time suggestions!
              </div>

              {geminiResponses.map((res, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-4 rounded-2xl text-xs leading-relaxed",
                    res.startsWith("You:") 
                      ? "bg-white/90 border border-black/5 text-right font-medium self-end"
                      : "bg-accent-purple/[0.04] border border-accent-purple/10 text-left text-primary"
                  )}
                >
                  {res}
                </div>
              ))}
            </div>

            {/* Submit inline Form */}
            <form onSubmit={handleGeminiQuery} className="relative">
              <input 
                type="text" 
                value={geminiQuery}
                onChange={e => setGeminiQuery(e.target.value)}
                placeholder="generate sleep tips..."
                className="w-full bg-white/70 hover:bg-white rounded-full px-6 py-4 text-xs font-mono text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/20 transition-all pr-12 text-heading-gradient border border-subtle"
              />
              <button 
                type="submit" 
                disabled={isAnswering}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent-purple text-white flex items-center justify-center rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* SIDE BAR / SECONDARY TILES (4 COLS) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* A. HOME TOP CAREER MATCHES */}
          <div className="glow-card p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif italic text-primary">Top Career Matches</h3>
              <Clock className="w-4 h-4 text-muted" />
            </div>

            <div className="space-y-4">
              {displayMatches.map((career, i) => (
                <div 
                  key={i}
                  className="p-4 bg-white/20 dark:bg-black/5 rounded-2xl border border-white/40 flex items-center justify-between group hover:border-accent-purple/40 hover:bg-white/40 transition-all cursor-pointer"
                  onClick={() => onLaunchRoadmap(career.title)}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-primary group-hover:text-accent-purple transition-colors">
                      {career.title}
                    </p>
                    <p className="text-[10px] text-muted font-mono">{career.sim}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-accent-purple/10 text-accent-purple font-bold px-3 py-1 rounded-full font-mono">
                      {career.match}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. GROWTH MAP SCATTER VISUALIZATION */}
          <div className="glow-card p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif italic text-primary">Growth Map</h3>
                <p className="text-[9px] text-muted uppercase tracking-wider font-mono">2D Coordinate distribution</p>
              </div>
              <Compass className="w-4 h-4 text-muted" />
            </div>

            {/* Scatter grid representation */}
            <div className="border border-black/5 dark:border-white/5 rounded-2xl p-4 bg-white/10 relative h-60 flex flex-col justify-between">
              
              {/* Analytical Y Label */}
              <div className="absolute left-1 top-2 text-[8px] font-bold text-muted font-mono uppercase transform rotate-90 origin-left">
                Y: Analytical
              </div>
              
              {/* Creative X Label */}
              <div className="absolute bottom-1 right-2 text-[8px] font-bold text-muted font-mono uppercase">
                X: Creative
              </div>

              {/* Chart Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none rounded-2xl" />

              {/* Coordinates graph dots */}
              <div className="relative w-full h-full">
                
                {/* Center circle */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-dashed border-accent-purple/30 animate-ping" />

                {/* Plot points corresponding dynamically or default points in image */}
                {/* Point 1: Analytical balance dots */}
                <div 
                  className="absolute left-[30%] top-[40%] text-center cursor-pointer group"
                  onClick={() => alert("Quantum Area focus coordinates synced.")}
                >
                  <span className="w-3.5 h-3.5 bg-accent-purple rounded-full border-2 border-white shadow-md block animate-pulse mx-auto" />
                  <span className="text-[8px] font-bold bg-white/90 border border-black/5 px-1.5 py-0.5 rounded shadow-sm text-primary block mt-1">
                    Quantum
                  </span>
                </div>

                {/* Point 2: Creative logic dots */}
                <div 
                  className="absolute left-[70%] top-[25%] text-center cursor-pointer group"
                >
                  <span className="w-3.5 h-3.5 bg-accent-blue rounded-full border-2 border-white shadow-md block mx-auto" />
                  <span className="text-[8px] font-bold bg-white/90 border border-black/5 px-1.5 py-0.5 rounded shadow-sm text-primary block mt-1">
                    Creative
                  </span>
                </div>

                {/* Point 3: Executive dot */}
                <div 
                  className="absolute left-[50%] top-[70%] text-center cursor-pointer group"
                >
                  <span className="w-3 h-3 bg-accent-emerald rounded-full border-2 border-white shadow-md block mx-auto" />
                  <span className="text-[8px] font-bold bg-white/90 border border-black/5 px-1.5 py-0.5 rounded shadow-sm text-primary block mt-1">
                    System
                  </span>
                </div>

              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={onNewAssessment} 
                className="w-full py-2 border border-black/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 text-primary bg-white/30"
              >
                Recalibrate
              </button>
              <button 
                onClick={onStartFresh} 
                className="w-full py-2 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all shrink-0"
              >
                Clear Data
              </button>
            </div>
          </div>
          
        </div>

      </div>

    </div>
  );
};
