import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, Eye, ArrowRight, TrendingUp, Sparkles, Smile, RefreshCw, 
  HelpCircle, ChevronRight, Activity, Search, Bell, Settings
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MyMindProfileViewProps {
  metrics: any;
  onRetake: () => void;
}

export const MyMindProfileView: React.FC<MyMindProfileViewProps> = ({ metrics, onRetake }) => {
  const [activeSegment, setActiveSegment] = useState<'logic' | 'imagination' | 'attention'>('logic');
  const [showDemo, setShowDemo] = useState(false);

  // Sandbox state initially matching real metrics
  const [sandboxLogic, setSandboxLogic] = useState(metrics?.logicScore || 85);
  const [sandboxNumerical, setSandboxNumerical] = useState(metrics?.numericalScore || 88);
  const [sandboxAbstract, setSandboxAbstract] = useState(metrics?.abstractScore || 90);
  const [sandboxCreativity, setSandboxCreativity] = useState(metrics?.creativityScore || 85);
  const [sandboxVerbal, setSandboxVerbal] = useState(metrics?.verbalScore || 80);
  const [sandboxNarrative, setSandboxNarrative] = useState(metrics?.narrativeScore || 78);
  const [sandboxFocus, setSandboxFocus] = useState(metrics?.focusScore || 85);
  const [sandboxExecutive, setSandboxExecutive] = useState(metrics?.executiveScore || 90);
  const [sandboxSpeed, setSandboxSpeed] = useState(metrics?.speedScore || 88);

  // Live calculator scores
  const simAnalytical = Math.round((sandboxLogic + sandboxNumerical + sandboxAbstract) / 3);
  const simCreative = Math.round((sandboxCreativity + sandboxVerbal + sandboxNarrative) / 3);
  const simFocus = Math.round((sandboxFocus + sandboxExecutive + sandboxSpeed) / 3);

  // Benchmarked Archetypes lists
  const archetypesList = [
    { id: 'visionary', title: "The Visionary Explorer", analytical: 80, creative: 85, focus: 80, color: "from-pink-500 to-rose-400", emoji: "🧭" },
    { id: 'quantum', title: "The Quantum Analyst", analytical: 95, creative: 45, focus: 90, color: "from-blue-500 to-indigo-400", emoji: "⚛️" },
    { id: 'catalyst', title: "The Creative Catalyst", analytical: 55, creative: 95, focus: 65, color: "from-purple-500 to-pink-400", emoji: "🎨" },
    { id: 'allrounder', title: "The Polymath Practitioner", analytical: 85, creative: 80, focus: 85, color: "from-emerald-500 to-teal-400", emoji: "🎓" }
  ];

  // Calculate live Match percentage using 3D Euclidean distances
  const matches = archetypesList.map(arch => {
    const dist = Math.sqrt(
      Math.pow(simAnalytical - arch.analytical, 2) +
      Math.pow(simCreative - arch.creative, 2) +
      Math.pow(simFocus - arch.focus, 2)
    );
    // distance of 115 is about the Max possible distance. Standardise to human-readable percentage matches
    const matchPercent = Math.max(0, Math.min(100, Math.round(100 - (dist / 1.3))));
    return { ...arch, matchPercent, distance: dist };
  }).sort((a,b) => b.matchPercent - a.matchPercent);

  const matchedArchetype = matches[0];

  // Gauge scoring variables taken from current session metrics (guaranteeing reactivity)
  const analyticalScore = Math.round((metrics?.logicScore + metrics?.numericalScore + metrics?.abstractScore) / 3) || 78;
  const creativeScore = Math.round((metrics?.creativityScore + metrics?.verbalScore + metrics?.narrativeScore) / 3) || 65;
  const focusScore = Math.round((metrics?.focusScore + metrics?.executiveScore + metrics?.speedScore) / 3) || 82;

  return (
    <div className="space-y-8 animate-fade-in text-[#251e44]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#eae4f5] dark:bg-[#251e44]/40 border border-[#bfaad4]/30 px-6 py-4 rounded-3xl gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif italic text-[#1e1a42] tracking-tight">
              Cogme Twin - My Mind Profile
            </h2>
            <Sparkles className="w-4 h-4 text-accent-purple animate-[spin_5s_linear_infinite]" />
          </div>
          <p className="text-[10px] text-muted tracking-wider uppercase font-mono">
            Explore the unique dynamics of your mind.
          </p>
          <button 
            onClick={() => setShowDemo(!showDemo)} 
            className="mt-2 text-[10px] bg-accent-purple text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:brightness-110 shadow-sm flex items-center gap-1 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showDemo ? "Hide Modeling Demo" : "Interactive Modeling Demo (How is this generated?)"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Mock Search bar inside header */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..."
              className="bg-white/40 border border-[#bfaad4]/20 rounded-full py-1.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-accent-purple text-[#1e1a42] pl-8"
            />
            <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          
          <button className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-accent-purple relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 bg-red-400 rounded-full absolute top-1 right-2" />
          </button>
          
          <button className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-[#1e1a42]">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DETAILED INTERACTIVE DEMO ACCORDION BOX */}
      {showDemo && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#faf8fe] to-[#f4f0fb] border-2 border-accent-purple/30 p-6 rounded-3xl space-y-6 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h3 className="text-lg font-serif italic text-[#1e1a42] flex items-center gap-2">
                <span>🧠</span> Core Modeling Algorithmic Simulator
              </h3>
              <p className="text-[11px] text-muted">This live demo runs the math that translates raw diagnostic indices into the high-level metrics displayed below.</p>
            </div>
            <button 
              onClick={() => setShowDemo(false)}
              className="text-xs text-muted hover:text-primary border border-black/10 px-3 py-1 rounded-full bg-white/50 font-mono"
            >
              × Close Demo
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Sliders */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#8A2BE2] font-mono">1. Modify Raw Cognitive Inputs (Quiz Scores)</h4>
              
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-black/5">
                <p className="text-[9px] font-mono text-[#5c4ce1] font-bold border-b pb-1 uppercase tracking-wider">Analytical Balance Indicators</p>
                {/* Logic score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Logic Accuracy Index</span>
                    <span className="font-mono font-bold text-accent-purple">{sandboxLogic}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxLogic} 
                    onChange={(e) => setSandboxLogic(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                </div>
                {/* Numerical */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Numerical Deduction</span>
                    <span className="font-mono font-bold text-accent-purple">{sandboxNumerical}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxNumerical} 
                    onChange={(e) => setSandboxNumerical(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                </div>
                {/* Abstract */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Abstract Pattern Mapping</span>
                    <span className="font-mono font-bold text-accent-purple">{sandboxAbstract}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxAbstract} 
                    onChange={(e) => setSandboxAbstract(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-2xl border border-black/5">
                <p className="text-[9px] font-mono text-[#db2777] font-bold border-b pb-1 uppercase tracking-wider">Creative Resonance Indicators</p>
                {/* Creativity */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Divergent Creativity Index</span>
                    <span className="font-mono font-bold text-pink-600">{sandboxCreativity}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxCreativity} 
                    onChange={(e) => setSandboxCreativity(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
                {/* Verbal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Socio-Verbal Fluency</span>
                    <span className="font-mono font-bold text-pink-600">{sandboxVerbal}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxVerbal} 
                    onChange={(e) => setSandboxVerbal(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
                {/* Narrative */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Semantic Narratology</span>
                    <span className="font-mono font-bold text-pink-600">{sandboxNarrative}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxNarrative} 
                    onChange={(e) => setSandboxNarrative(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-2xl border border-black/5">
                <p className="text-[9px] font-mono text-[#059669] font-bold border-b pb-1 uppercase tracking-wider">Focus Stability Indicators</p>
                {/* Focus */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Attention / Jitter Control</span>
                    <span className="font-mono font-bold text-[#059669]">{sandboxFocus}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxFocus} 
                    onChange={(e) => setSandboxFocus(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                {/* Executive */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Executive Prioritization</span>
                    <span className="font-mono font-bold text-[#059669]">{sandboxExecutive}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxExecutive} 
                    onChange={(e) => setSandboxExecutive(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                {/* Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">System Processing Speed</span>
                    <span className="font-mono font-bold text-[#059669]">{sandboxSpeed}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={sandboxSpeed} 
                    onChange={(e) => setSandboxSpeed(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Mathematical synthesis */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#8A2BE2] font-mono">2. Synthesis and 3D Vector Math</h4>
              
              <div className="bg-white p-5 rounded-3xl border border-black/5 space-y-4 shadow-sm">
                <p className="text-xs font-mono text-muted">Each master category leverages an unweighted centroid formulation:</p>
                
                {/* Analytical Synthesis Bar */}
                <div className="space-y-1 bg-[#eae4f5]/30 p-2.5 rounded-xl border border-[#bfaad4]/20">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-secondary">Analytical Balance</span>
                    <span className="font-mono font-bold text-rose-500">{simAnalytical}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 to-rose-600 rounded-full" style={{ width: `${simAnalytical}%` }} />
                  </div>
                  <p className="text-[9px] font-mono text-[#8A2BE2]">Formula: (Logic + Numerical + Abstract) ÷ 3</p>
                </div>

                {/* Creative Synthesis Bar */}
                <div className="space-y-1 bg-[#eae4f5]/30 p-2.5 rounded-xl border border-[#bfaad4]/20">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-secondary">Creative Resonance</span>
                    <span className="font-mono font-bold text-indigo-500">{simCreative}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-indigo-500 rounded-full" style={{ width: `${simCreative}%` }} />
                  </div>
                  <p className="text-[9px] font-mono text-[#8A2BE2]">Formula: (Creativity + Verbal + Narrative) ÷ 3</p>
                </div>

                {/* Focus Synthesis Bar */}
                <div className="space-y-1 bg-[#eae4f5]/30 p-2.5 rounded-xl border border-[#bfaad4]/20">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-secondary">Focus Stability</span>
                    <span className="font-mono font-bold text-emerald-600">{simFocus}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#34d399] to-[#059669] rounded-full" style={{ width: `${simFocus}%` }} />
                  </div>
                  <p className="text-[9px] font-mono text-[#8A2BE2]">Formula: (Focus + Executive + Speed) ÷ 3</p>
                </div>

                {/* Vector Location */}
                <div className="p-3 bg-black/5 rounded-2xl text-[10px] font-mono space-y-1">
                  <p className="font-bold">Active User Coordinate Vector:</p>
                  <p className="text-accent-purple text-xs font-bold bg-white/60 p-1.5 rounded text-center border">
                    U = [ A: {simAnalytical}, C: {simCreative}, F: {simFocus} ]
                  </p>
                </div>
              </div>

              {/* Live Classifier */}
              <div className="bg-[#241c4f] text-white p-5 rounded-3xl space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-mono font-bold text-pink-300 uppercase tracking-widest">3. Neural Archetype Classifier</h5>
                  <span className="bg-pink-500 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full">3D Distance Model</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl border border-white/20">
                  <span className="text-2xl">{matchedArchetype.emoji}</span>
                  <div>
                    <span className="text-[9px] text-pink-300 uppercase font-mono tracking-widest block font-bold">Closest Cluster</span>
                    <strong className="text-sm font-serif italic text-white text-base block">{matchedArchetype.title}</strong>
                    <span className="text-[10px] font-mono text-white/70">Euclidean d = {(matchedArchetype.distance / 100).toFixed(3)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[9px] font-mono text-white/50">Mathematical Proximities (Match % = 100 - (Distance / 1.3)):</p>
                  {matches.map(item => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className={item.id === matchedArchetype.id ? "text-pink-300 font-bold" : "text-white/70"}>
                          {item.emoji} {item.title}
                        </span>
                        <span>{item.matchPercent}% Match</span>
                      </div>
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.matchPercent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 1. GAUGE ARCS SECTION (ROW OF 3 ARC DIALS EXACTLY LIKE SCREENSHOT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Dial 1: Analytical Balance */}
        <div className="glow-card p-6 rounded-3xl flex flex-col items-center justify-center bg-[#fdfcff] text-center border border-[#b3a5e2]/25 relative">
          <div className="relative w-40 h-28 flex items-end justify-center overflow-hidden">
            <svg className="w-full h-full transform translate-y-3">
              {/* Arc background */}
              <path 
                d="M 20 120 A 60 60 0 0 1 140 120" 
                fill="none" 
                stroke="#eae6f6" 
                strokeWidth="12" 
                strokeLinecap="round"
              />
              {/* Active Orange/Peach segment exactly like image */}
              <motion.path 
                d="M 20 120 A 60 60 0 0 1 140 120" 
                fill="none" 
                stroke="url(#analyticalGrad)" 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray="188"
                initial={{ strokeDashoffset: 188 }}
                animate={{ strokeDashoffset: 188 - (188 * analyticalScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="analyticalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="50%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center translate-y-[-10px]">
              <span className="text-4xl font-serif font-bold italic text-primary">{analyticalScore}</span>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <p className="text-xs font-semibold text-secondary">Analytical Balance</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold font-mono">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              <span>Logic Focus</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Dial 2: Creative Resonance */}
        <div className="glow-card p-6 rounded-3xl flex flex-col items-center justify-center bg-[#fdfcff] text-center border border-[#b3a5e2]/25 relative">
          <div className="relative w-40 h-28 flex items-end justify-center overflow-hidden">
            <svg className="w-full h-full transform translate-y-3">
              <path 
                d="M 20 120 A 60 60 0 0 1 140 120" 
                fill="none" 
                stroke="#eae6f6" 
                strokeWidth="12" 
                strokeLinecap="round"
              />
              <motion.path 
                d="M 20 120 A 60 60 0 0 1 140 120" 
                fill="none" 
                stroke="url(#creativeGrad)" 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray="188"
                initial={{ strokeDashoffset: 188 }}
                animate={{ strokeDashoffset: 188 - (188 * creativeScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
              />
              <defs>
                <linearGradient id="creativeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center translate-y-[-10px]">
              <span className="text-4xl font-serif font-bold italic text-primary">{creativeScore}</span>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <p className="text-xs font-semibold text-secondary">Creative Resonance</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-500 rounded-full text-[10px] font-bold font-mono">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span>Imagination Flow</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Dial 3: Focus Stability */}
        <div className="glow-card p-6 rounded-3xl flex flex-col items-center justify-center bg-[#fdfcff] text-center border border-[#b3a5e2]/25 relative">
          <div className="relative w-40 h-28 flex items-end justify-center overflow-hidden">
            <svg className="w-full h-full transform translate-y-3">
              <path 
                d="M 20 120 A 60 60 0 0 1 140 120" 
                fill="none" 
                stroke="#eae6f6" 
                strokeWidth="12" 
                strokeLinecap="round"
              />
              <motion.path 
                d="M 20 120 A 60 60 0 0 1 140 120" 
                fill="none" 
                stroke="url(#focusGrad)" 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray="188"
                initial={{ strokeDashoffset: 188 }}
                animate={{ strokeDashoffset: 188 - (188 * focusScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
              <defs>
                <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a7f3d0" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center translate-y-[-10px]">
              <span className="text-4xl font-serif font-bold italic text-primary">{focusScore}</span>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <p className="text-xs font-semibold text-secondary">Focus Stability</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#059669] rounded-full text-[10px] font-bold font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>Attention Control</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>

      {/* 2. MIDDLE CONTENT SECTION LAYOUT (MATCHING IMAGE 1 EXACTLY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Neural Snapshot Panel (7 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glow-card p-6 rounded-3xl bg-[#fdfcff] relative border border-[#b3a5e2]/25">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <h3 className="text-lg font-serif italic text-primary">Neural Snapshot</h3>
              <span className="font-mono text-[9px] text-[#7c779e] uppercase">Reflected State</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Visionary explorer image holder */}
              <div className="rounded-2xl border border-[#bfaad4]/30 overflow-hidden bg-gradient-to-br from-[#2c2354] to-[#483a7c]">
                <div className="relative h-44 flex items-center justify-center p-4">
                  {/* Digital outline head with network overlay simulation */}
                  <div className="absolute inset-x-0 bottom-0 top-0 opacity-20 bg-[radial-gradient(#ffffff30_1.5px,transparent_1.5px)] bg-[size:10px_10px]" />
                  
                  {/* Circular head glow simulation representing Visionary Explorer */}
                  <div className="relative w-28 h-28 rounded-full border border-pink-300/30 flex items-center justify-center bg-pink-500/10 shadow-[0_0_24px_rgba(236,72,153,0.2)]">
                    <TrendingUp className="w-12 h-12 text-pink-300 animate-pulse" />
                  </div>
                  
                  <div className="absolute bottom-2 inset-x-2 bg-white/20 backdrop-blur-md py-1.5 px-3 rounded-xl text-center">
                    <p className="text-xs font-serif italic text-white font-bold">The Visionary Explorer</p>
                  </div>
                </div>

                <div className="p-4 bg-white/90 space-y-3 text-[11px] text-[#4a456e] leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-rose-500">⏰</span>
                    <p><strong>Risk-Taking:</strong> Thrives in uncertainty.</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-indigo-500">🌀</span>
                    <p><strong>Pattern Recognition:</strong> Sees hidden connections.</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-500">💡</span>
                    <p><strong>Exploratory Thinking:</strong> Eager to innovate and discover.</p>
                  </div>
                </div>
              </div>

              {/* Snapshot side bullet trends & progress bars */}
              <div className="space-y-4 flex flex-col justify-between">
                
                {/* 3 Indicators directly from Image 1 */}
                <div className="space-y-2.5">
                  <div className="p-3 bg-[#fdf2f8] rounded-xl flex items-center justify-between border border-pink-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">💭</span>
                      <p className="text-xs font-semibold text-secondary">Risk-Taking</p>
                    </div>
                    <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest font-mono">Improving</span>
                  </div>

                  <div className="p-3 bg-[#e0f2fe] rounded-xl flex items-center justify-between border border-sky-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🧠</span>
                      <p className="text-xs font-semibold text-secondary">Pattern Recognition</p>
                    </div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest font-mono">Slight Decline</span>
                  </div>

                  <div className="p-3 bg-[#f0fdf4] rounded-xl flex items-center justify-between border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🤝</span>
                      <p className="text-xs font-semibold text-secondary">Exploratory Thinking</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono">Noticeable Boost</span>
                  </div>
                </div>

                {/* Cognitive Metrics Sub-Card */}
                <div className="p-4 bg-white border border-[#bfaad4]/20 rounded-2xl space-y-3.5">
                  <h4 className="text-xs font-bold text-primary font-mono uppercase tracking-wider">Cognitive Metrics</h4>
                  
                  {/* Verbal Reasoning */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-muted">
                      <span>Verbal Reasoning</span>
                      <span className="text-[#8A2BE2] font-bold">82 High</span>
                    </div>
                    <div className="w-full h-2 bg-[#f4f2fa] rounded-full overflow-hidden">
                      <div className="h-full bg-[#8A2BE2] rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>

                  {/* Spatial Skills */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-muted">
                      <span>Spatial Skills</span>
                      <span className="text-pink-500 font-bold">74 Moderate</span>
                    </div>
                    <div className="w-full h-2 bg-[#fdf2f8] rounded-full overflow-hidden">
                      <div className="h-full bg-pink-400 rounded-full" style={{ width: '74%' }} />
                    </div>
                  </div>

                  {/* Working Memory */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-muted">
                      <span>Working Memory</span>
                      <span className="text-[#a78bfa] font-bold">68 Normal</span>
                    </div>
                    <div className="w-full h-2 bg-[#eae6f6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#a78bfa] rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Right Active Shifts Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Recent Shifts */}
          <div className="glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="text-base font-serif italic text-primary">Recent Shifts</h3>
              <span className="text-[10px] font-mono text-muted">Acuity Tracking</span>
            </div>

            <div className="space-y-3">
              {[
                { title: "Logic", change: "+5%", desc: "Growing", theme: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                { title: "Memory", change: "-3%", desc: "Slight Decline", theme: "bg-rose-50 text-rose-500 border-rose-100" },
                { title: "Processing Speed", change: "+8%", desc: "High", theme: "bg-[#eef2ff] text-[#6366f1] border-[#e0e7ff]" },
                { title: "Sleep Quality", change: "-2 hrs", desc: "Fatigued", theme: "bg-amber-50 text-amber-700 border-amber-100" }
              ].map((shift, i) => (
                <div key={i} className={cn("p-3 rounded-2xl border flex items-center justify-between text-xs", shift.theme)}>
                  <span className="font-semibold">{shift.title}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold">{shift.change}</span>
                    <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 bg-white/60 rounded-full border border-black/5">{shift.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Inner State Analysis */}
          <div className="glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-4">
            <h3 className="text-base font-serif italic text-primary">Inner State Analysis</h3>

            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
                <Smile className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-950">Executive Fatigue</p>
                  <p className="text-[10px] text-amber-800 leading-normal">Jitter level elevated. Practice relaxation techniques.</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                <Smile className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-950">Positive Mindset</p>
                  <p className="text-[10px] text-emerald-800 leading-normal">High level of motivation & optimistic learning attitude.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onRetake}
              className="w-full py-2.5 rounded-full border border-[#8A2BE2]/20 hover:bg-accent-purple/5 text-accent-purple text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Recalibrate Sessions
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
