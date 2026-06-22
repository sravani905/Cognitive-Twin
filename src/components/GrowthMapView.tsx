import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sliders, Sparkles, TrendingUp, HelpCircle, Compass, Info, RefreshCw, ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface GrowthMapViewProps {
  metrics?: any;
}

export const GrowthMapView: React.FC<GrowthMapViewProps> = ({ metrics }) => {
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [activeTooltip, setActiveTooltip] = useState<boolean>(true);
  const [showDemo, setShowDemo] = useState<boolean>(false);

  // Raw interactive sliders for projection math sandbox
  const [sandboxLogic, setSandboxLogic] = useState(metrics?.logicScore || 85);
  const [sandboxNumerical, setSandboxNumerical] = useState(metrics?.numericalScore || 88);
  const [sandboxFocus, setSandboxFocus] = useState(metrics?.focusScore || 85);
  const [sandboxCreativity, setSandboxCreativity] = useState(metrics?.creativityScore || 85);
  const [sandboxVerbal, setSandboxVerbal] = useState(metrics?.verbalScore || 80);
  const [sandboxAbstract, setSandboxAbstract] = useState(metrics?.abstractScore || 90);

  // Sync with props metrics when they load or change
  useEffect(() => {
    if (metrics) {
      setSandboxLogic(metrics.logicScore || 85);
      setSandboxNumerical(metrics.numericalScore || 88);
      setSandboxFocus(metrics.focusScore || 85);
      setSandboxCreativity(metrics.creativityScore || 85);
      setSandboxVerbal(metrics.verbalScore || 80);
      setSandboxAbstract(metrics.abstractScore || 90);
    }
  }, [metrics]);

  // Dynamic projection coordinates calculation (0 to 1 value range)
  // Horizontal axis is Creative Spectrum
  const selfX = Number((
    (sandboxCreativity * 0.45) + 
    (sandboxVerbal * 0.35) + 
    (sandboxAbstract * 0.20)
  ).toFixed(2)) / 100;

  // Vertical axis is Analytical Spectrum
  const selfY = Number((
    (sandboxLogic * 0.45) + 
    (sandboxNumerical * 0.35) + 
    (sandboxFocus * 0.20)
  ).toFixed(2)) / 100;

  // Ensure within reasonable grid display boundaries [0.08, 0.92]
  const displayX = Math.max(0.08, Math.min(0.92, selfX));
  const displayY = Math.max(0.08, Math.min(0.92, selfY));

  // Clusters list with real 2D coordinates representing centroids
  const clusters = [
    { name: "Quantum Researchers", x: 0.15, y: 0.85, color: "text-indigo-700 bg-indigo-200/50", badge: "bg-indigo-500/10 border-indigo-400/20", style: { left: "15%", top: "15%" }, emoji: "⚛️" },
    { name: "Narrative Designers", x: 0.80, y: 0.75, color: "text-amber-700 bg-amber-200/50", badge: "bg-amber-500/10 border-amber-400/20", style: { left: "80%", top: "25%" }, emoji: "🖋️" },
    { name: "Strategic Leaders", x: 0.30, y: 0.25, color: "text-emerald-700 bg-emerald-200/50", badge: "bg-emerald-500/10 border-emerald-400/20", style: { left: "30%", top: "75%" }, emoji: "🌱" }
  ];

  // Calculate live distances to clusters in 2D Coordinate system
  const clusterDistances = clusters.map(c => {
    const d = Math.sqrt(Math.pow(selfX - c.x, 2) + Math.pow(selfY - c.y, 2));
    return { ...c, distance: Number(d.toFixed(3)) };
  }).sort((a, b) => a.distance - b.distance);

  const closestCluster = clusterDistances[0];

  const handleResetToReal = () => {
    setSandboxLogic(metrics?.logicScore || 85);
    setSandboxNumerical(metrics?.numericalScore || 88);
    setSandboxFocus(metrics?.focusScore || 85);
    setSandboxCreativity(metrics?.creativityScore || 85);
    setSandboxVerbal(metrics?.verbalScore || 80);
    setSandboxAbstract(metrics?.abstractScore || 90);
    
    // Trigger sweet celebration particles if available
    try {
      window.dispatchEvent(new CustomEvent('cognitive-success-particles', { detail: { type: 'milestone' } }));
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#251e44]" id="growth-map-container">
      
      {/* 1. TOP BANNER */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#eae4f5] dark:bg-[#251e44]/40 border border-[#bfaad4]/30 px-6 py-4 rounded-3xl gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif italic text-[#1e1a42] tracking-tight">
              Growth Map
            </h2>
            <span className="text-[10px] bg-accent-purple/10 text-accent-purple font-mono px-2 py-0.5 rounded font-bold uppercase">
              AI Mind Reflection
            </span>
          </div>
          <p className="text-[10px] text-muted tracking-wider uppercase font-mono">
            Visualize your cognitive landscape across benchmark indices.
          </p>
          <button 
            onClick={() => setShowDemo(!showDemo)} 
            className="mt-2 text-[10px] bg-accent-purple text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:brightness-110 shadow-sm flex items-center gap-1 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showDemo ? "Hide Projection Demo" : "Interactive Projection Demo (How is this generated?)"}</span>
          </button>
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Search anything..."
            className="bg-white/40 border border-[#bfaad4]/20 rounded-full py-1.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-accent-purple text-[#1e1a42] pl-8"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-xs">🔍</span>
        </div>
      </div>

      {/* DETAILED INTERACTIVE PROJECTION ACCORDION BOX */}
      {showDemo && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#faf8fe] to-[#f3effb] border-2 border-accent-purple/30 p-6 rounded-3xl space-y-6 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h3 className="text-lg font-serif italic text-primary flex items-center gap-2">
                <span>🗺️</span> Dimensional Reduction projection Simulator
              </h3>
              <p className="text-[11px] text-muted font-sans">
                This live demo models how a high-dimensional vector of raw test scores is projected onto the 2D Creative/Analytical plane.
              </p>
            </div>
            <button 
              onClick={() => setShowDemo(false)}
              className="text-xs text-muted hover:text-primary border border-black/15 px-3 py-1 rounded-full bg-white/70 font-mono"
            >
              × Close Simulator
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: Projection Sliders */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-accent-purple font-mono">1. Modify High-D Raw Scores</h4>
                <button 
                  onClick={handleResetToReal}
                  className="text-[9px] text-[#8A2BE2] hover:underline font-bold flex items-center gap-1 uppercase"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Reset to Actuals
                </button>
              </div>
              
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-black/5">
                {/* Logic Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Logic Reasoning Scope</span>
                    <span className="font-mono font-bold text-accent-purple">{sandboxLogic}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={sandboxLogic} 
                    onChange={(e) => setSandboxLogic(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                </div>

                {/* Numerical Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Numerical Analysis</span>
                    <span className="font-mono font-bold text-accent-purple">{sandboxNumerical}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={sandboxNumerical} 
                    onChange={(e) => setSandboxNumerical(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                </div>

                {/* Focus Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Attention / Executive Focus</span>
                    <span className="font-mono font-bold text-accent-purple">{sandboxFocus}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={sandboxFocus} 
                    onChange={(e) => setSandboxFocus(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                </div>

                {/* Creativity Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-pink-700">Divergent Creativity</span>
                    <span className="font-mono font-bold text-pink-600">{sandboxCreativity}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={sandboxCreativity} 
                    onChange={(e) => setSandboxCreativity(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>

                {/* Verbal Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-pink-700">Semantic Writing Fluency</span>
                    <span className="font-mono font-bold text-pink-600">{sandboxVerbal}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={sandboxVerbal} 
                    onChange={(e) => setSandboxVerbal(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>

                {/* Abstract Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-pink-700">Abstract Invariant Mapping</span>
                    <span className="font-mono font-bold text-pink-600">{sandboxAbstract}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={sandboxAbstract} 
                    onChange={(e) => setSandboxAbstract(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Mathematical Projection & Matrix Reduction */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-accent-purple font-mono">2. Analytical/Creative Dimension Equations</h4>
              
              <div className="bg-white p-5 rounded-3xl border border-black/5 space-y-4 shadow-sm text-xs leading-relaxed text-[#4a456e]">
                <p className="font-mono text-[10px] text-muted">
                  High-D vector is projected using weighted coordinate transformation vectors:
                </p>

                {/* X projection formula */}
                <div className="space-y-1 p-3 bg-pink-50 border border-pink-100 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-pink-900">Creative Projection (X-Coordinate):</span>
                    <span className="font-mono font-extrabold text-pink-600">X = {selfX.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-pink-800 bg-white/70 p-1.5 rounded font-mono mt-1 border border-pink-200">
                    Formula: (Creativity × 0.45 + Verbal × 0.35 + Abstract × 0.20) ÷ 100
                  </p>
                  <p className="text-[9px] text-[#7c779e] mt-1 italic">
                    Calculated: ({sandboxCreativity} × 0.45 + {sandboxVerbal} × 0.35 + {sandboxAbstract} × 0.20) ÷ 100 = {selfX}
                  </p>
                </div>

                {/* Y projection formula */}
                <div className="space-y-1 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-900">Analytical Projection (Y-Coordinate):</span>
                    <span className="font-mono font-extrabold text-indigo-600">Y = {selfY.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-indigo-800 bg-white/70 p-1.5 rounded font-mono mt-1 border border-indigo-200">
                    Formula: (Logic × 0.45 + Numerical × 0.35 + Focus × 0.20) ÷ 100
                  </p>
                  <p className="text-[9px] text-[#7c779e] mt-1 italic">
                    Calculated: ({sandboxLogic} × 0.45 + {sandboxNumerical} × 0.35 + {sandboxFocus} × 0.20) ÷ 100 = {selfY}
                  </p>
                </div>

                {/* Projected vector representation */}
                <div className="p-3 bg-[#241c4f] text-white rounded-2xl text-[10px] font-mono space-y-1.5 shadow-md">
                  <p className="font-bold text-pink-300">Target Coordinate in latent 2D space:</p>
                  <div className="py-2 px-3 bg-white/10 rounded-xl border border-white/25 text-center text-sm font-bold tracking-widest text-[#a78bfa]">
                    COORD = [ X: {selfX.toFixed(2)}, Y: {selfY.toFixed(2)} ]
                  </div>
                  <div className="flex justify-between text-[9px] text-white/60 pt-1">
                    <span>Closest Centroid Group:</span>
                    <span className="text-white font-bold">{closestCluster.emoji} {closestCluster.name}</span>
                  </div>
                </div>
              </div>

              {/* Distances card */}
              <div className="p-4 bg-slate-50 border border-black/5 rounded-2xl font-mono text-[10px] space-y-2">
                <span className="font-bold text-primary block uppercase tracking-wider">Distance relative to target clusters (2D Euclidean distance):</span>
                <div className="space-y-1.5 text-secondary">
                  {clusterDistances.map((c, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b border-black/[0.03] last:border-b-0">
                      <span>{c.emoji} {c.name}</span>
                      <span className="font-bold text-primary">d = {c.distance} {index ===  0 && "⭐ (Nearest)"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* 2. MAIN LARGE SCATTER COORDINATES SYSTEM CARD */}
      <div className="glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 relative space-y-4 shadow-sm" id="cognitive-landscape-card">
        <div className="flex items-center justify-between pb-3 border-b border-black/5">
          <p className="text-xs font-serif italic text-primary">Your Coordinates on the Cognitive Map</p>
          <span className="micro-label">Spatial representation</span>
        </div>

        {/* The 2D Interactive Space Canvas layout */}
        <div className="relative h-96 w-full bg-[#faf9fe] border border-black/[0.04] rounded-2xl p-6 overflow-hidden flex flex-col justify-between">
          
          {/* Grid lines layout backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px))] bg-[size:28px_28px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px))] bg-[size:28px_28px] pointer-events-none" />

          {/* Core scatter plot space */}
          <div className="relative flex-1 w-full" id="scatter-canvas">
            
            {/* Shaded cluster region 1: Quantum Researchers (top-left indigo) */}
            <div className="absolute left-[15%] top-[15%] w-48 h-28 rounded-full bg-indigo-500/10 border border-indigo-400/20 blur-[2px] pointer-events-none flex items-center justify-center">
              <div className="text-center translate-y-[-10px] space-y-1 text-indigo-700 font-mediumScatter">
                <span className="text-[10px] uppercase font-bold block">⚛️ Quantum Researchers</span>
                <span className="text-[8px] bg-indigo-200/50 px-1 rounded font-mono font-bold">d = {Math.sqrt(Math.pow(selfX - 0.15, 2) + Math.pow(selfY - 0.85, 2)).toFixed(2)}</span>
              </div>
            </div>

            {/* Shaded cluster region 2: Narrative Designers (top-right purple/orange) */}
            <div className="absolute right-[12%] top-[20%] w-52 h-28 rounded-full bg-amber-500/10 border border-amber-400/20 blur-[2px] pointer-events-none flex items-center justify-center">
              <div className="text-center translate-y-[-10px] space-y-1 text-amber-700 font-mediumScatter">
                <span className="text-[10px] uppercase font-bold block">🖋️ Narrative Designers</span>
                <span className="text-[8px] bg-amber-200/50 px-1 rounded font-mono font-bold">d = {Math.sqrt(Math.pow(selfX - 0.80, 2) + Math.pow(selfY - 0.75, 2)).toFixed(2)}</span>
              </div>
            </div>

            {/* Shaded cluster region 3: Strategic Leaders (bottom left/mid green) */}
            <div className="absolute left-[25%] bottom-[15%] w-44 h-20 rounded-full bg-emerald-500/10 border border-emerald-400/20 blur-[2px] pointer-events-none flex items-center justify-center">
              <div className="text-center translate-y-[-5px] space-y-1 text-[#059669] font-mediumScatter">
                <span className="text-[10px] uppercase font-bold block">🌱 Strategic Leaders</span>
                <span className="text-[8px] bg-emerald-200/50 px-1 rounded font-mono font-bold text-[#059669]">d = {Math.sqrt(Math.pow(selfX - 0.30, 2) + Math.pow(selfY - 0.25, 2)).toFixed(2)}</span>
              </div>
            </div>

            {/* Pathways curved line connecting dots dynamically */}
            {showTrajectory && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d={`M 15 15 Q 40 50 ${displayX * 100} ${(1 - displayY) * 100} T 80 25`} 
                  fill="none" 
                  stroke="rgba(138, 43, 226,0.4)" 
                  strokeWidth="0.5" 
                  strokeDasharray="1,1" 
                />
                <circle cx="15" cy="15" r="1" fill="#8A2BE2" />
                <circle cx="80" cy="25" r="1" fill="#8A2BE2" />
              </svg>
            )}

            {/* Main Center Node: Your Self */}
            <motion.div 
              style={{ 
                left: `${displayX * 100}%`, 
                top: `${(1 - displayY) * 100}%`,
                transform: "translate(-50%, -50%)" 
              }}
              className="absolute text-center cursor-pointer group z-20 transition-all duration-300"
              onClick={() => setActiveTooltip(!activeTooltip)}
            >
              <div className="relative flex items-center justify-center w-12 h-12 bg-[#8A2BE2] text-white rounded-full font-serif italic text-xs font-bold animate-[pulse_4s_infinite] shadow-lg shadow-accent-purple/30 border-2 border-white">
                Self
                <div className="absolute inset-[-6px] rounded-full border border-[#8A2BE2]/20 animate-ping" />
              </div>
              <p className="text-[10px] font-bold text-[#8A2BE2] uppercase mt-1">Your Self</p>

              {/* Precise parameters tooltip floating block matching Image 6 */}
              {activeTooltip && (
                <div className="absolute left-1/2 bottom-14 -translate-x-1/2 w-48 bg-[#1e1a42] text-white p-3 rounded-2xl shadow-xl border border-white/10 text-left space-y-1.5 z-30 pointer-events-auto">
                  <p className="text-[9px] font-mono text-[#a78bfa] uppercase tracking-wider">Your Map Position:</p>
                  <p className="text-xs font-bold font-mono">X⁕: {selfX.toFixed(2)} , Y⁕: {selfY.toFixed(2)}</p>
                  <div className="pt-1.5 border-t border-white/10 text-[9px] space-y-1 font-mono text-slate-300">
                    <p>Closest: {closestCluster.emoji} {closestCluster.name.split(" ")[0]}</p>
                    <p>Distance: d = {closestCluster.distance}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Y and X axes labeling guides */}
            <div className="absolute left-0 bottom-0 top-0 w-8 border-r border-[#bfaad4]/30 flex items-center justify-center pointer-events-none">
              <span className="font-serif italic text-[11px] text-[#7c779e] uppercase transform -rotate-90 origin-center whitespace-nowrap">
                Analytical ▲
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-[#bfaad4]/30 flex items-center justify-center pointer-events-none">
              <span className="font-serif italic text-[11px] text-[#7c779e] uppercase">
                Creative ▶
              </span>
            </div>

          </div>

        </div>

        {/* Controls block at bottom of map coordinates */}
        <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-2">
            <button 
              onClick={() => alert(`Retrieving nearest coordinate peer records... Closest peers belong to Cluster: ${closestCluster.name}`)}
              className="px-4 py-2 border border-[#bfaad4]/30 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
            >
              Compare with Peers
            </button>
            <button 
              onClick={() => alert(`Active Projection Metrics: Analytical=${(selfY * 100).toFixed(0)}%, Creative=${(selfX * 100).toFixed(0)}%. Nearest cluster is ${closestCluster.name}.`)}
              className="px-4 py-2 border border-[#bfaad4]/30 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
            >
              Trend Insights
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Show Trajectory</span>
            <button 
              onClick={() => setShowTrajectory(!showTrajectory)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-all duration-300",
                showTrajectory ? "bg-accent-purple" : "bg-slate-200"
              )}
            >
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                showTrajectory ? "left-[26px]" : "left-[2px]"
              )} />
            </button>
          </div>
        </div>

      </div>

      {/* 3. ROW OF TWO SUB-CARDS UNDERNEATH LANDSCAPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Trajectory History card */}
        <div className="p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <h3 className="text-sm font-serif italic text-primary">Trajectory History</h3>
            <span className="text-[10px] font-mono text-muted">Cognitive Shift Over Time</span>
          </div>

          <div className="h-20 flex items-center justify-between bg-slate-50 border border-black/[0.03] p-4 rounded-xl">
            {/* Sparkline vector */}
            <svg className="w-32 h-10 shadow-inner rounded" viewBox="0 0 100 20">
              <path d="M 0 15 L 25 12 L 50 18 L 75 8 L 100 5" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="100" cy="5" r="3" fill="var(--accent-purple)" />
            </svg>

            <span className="text-xs font-bold text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-3 py-1.5 rounded-full font-mono uppercase">
              0.30 → {selfX.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Benchmark Distances card */}
        <div className="p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-3 shadow-sm">
          <h3 className="text-sm font-serif italic text-primary">Benchmark Distances</h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            {clusterDistances.slice(0, 2).map((distItem, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-black/[0.02] rounded-xl font-mono">
                <span className="text-muted block text-[9px] uppercase">To {distItem.name.split(" ")[0]}</span>
                <strong className="text-primary font-bold">d = {distItem.distance}</strong>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <p className="text-[10px] text-indigo-900 leading-normal">
              <strong>Personalized Notes:</strong> Your active position vector clusters most strongly with <strong>{closestCluster.emoji} {closestCluster.name}</strong>. Growth is accelerating as coordinate indices map deeper into target spaces.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
