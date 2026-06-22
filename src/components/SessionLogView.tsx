import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Clock, TrendingUp, BarChart2, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export const SessionLogView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="space-y-8 animate-fade-in text-[#251e44]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#eae4f5] dark:bg-[#251e44]/40 border border-[#bfaad4]/30 px-6 py-4 rounded-3xl gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif italic text-[#1e1a42] tracking-tight">
              Session Log
            </h2>
            <span className="text-[10px] bg-accent-purple/10 text-accent-purple font-mono px-2 py-0.5 rounded font-bold uppercase">
              → Tracking Your Cognitive Performance
            </span>
          </div>
          <p className="text-[10px] text-muted tracking-wider uppercase font-mono">
            Circadian focus diagnostics and active user input telemetry logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold font-mono">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span>Focus Mode Active</span>
          </span>
          <button className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-[#1e1a42]">
            🎙️
          </button>
        </div>
      </div>

      {/* 1. TOP STATS CARDS BAR (3 PILLS EXACTLY LIKE IMAGE 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Flag 1: Executive Fatigue Alert */}
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-3xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wide font-mono">Executive Fatigue Alert</h4>
            <p className="text-[11px] text-rose-800 font-medium">High Jitter Detected in active metrics.</p>
          </div>
        </div>

        {/* Flag 2: Interaction Speed */}
        <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide font-mono">Interaction Speed</h4>
            <p className="text-[11px] text-indigo-800 font-medium">42 Actions / Min average log.</p>
          </div>
        </div>

        {/* Flag 3: Last Session */}
        <div className="p-5 bg-[#faf8eb] border border-amber-200 rounded-3xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            🌙
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide font-mono">Last Session</h4>
            <p className="text-[11px] text-amber-800 font-medium">5h 15m, Sleep Last Night baseline.</p>
          </div>
        </div>

      </div>

      {/* 2. CHOOSE 2 CORE CHARTS AS VISUALISED IN IMAGE 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Input Jitter Analysis Line Chart */}
        <div className="glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <h3 className="text-sm font-serif italic text-primary">Input Jitter Analysis</h3>
            <span className="text-[10px] font-mono text-muted uppercase">Line Plot telemetry</span>
          </div>

          <div className="relative h-44 w-full bg-slate-50 border border-black/[0.03] rounded-2xl p-4 flex flex-col justify-between">
            <div className="absolute left-2 top-2 space-y-1 text-[8px] font-mono text-[#a78bfa] uppercase">
              <p>High</p>
              <p className="pt-2">Loh</p>
              <p className="pt-2">Low</p>
            </div>

            {/* Custom SVG line matching the screenshot wave */}
            <div className="relative w-full h-28 mt-2">
              <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                {/* Midpoint line */}
                <line x1="100" y1="0" x2="100" y2="60" stroke="rgba(138, 43, 226,0.15)" strokeWidth="1" strokeDasharray="2,2" />
                
                {/* Jitter line path */}
                <path 
                  d="M0,45 Q20,38 40,48 T80,45 T100,28 T120,40 T150,22 T180,43 L200,45" 
                  fill="none" 
                  stroke="var(--accent-purple)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                {/* Underlay area */}
                <path 
                  d="M0,45 Q20,38 40,48 T80,45 T100,28 T120,40 T150,22 T180,43 L200,45 L200,60 L0,60 Z" 
                  fill="rgba(138, 43, 226,0.04)"
                />

                {/* Point indicators in image */}
                <circle cx="100" cy="28" r="3" fill="#f87171" />
                <circle cx="150" cy="22" r="3" fill="#f472b6" />
              </svg>

              {/* Labels exactly as shown in screenshot #4 */}
              <div className="absolute left-[40%] top-[10%] bg-[#ef4444] text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                Alert Zone
              </div>

              <div className="absolute left-[70%] top-[45%] bg-[#8A2BE2] text-white text-[8px] font-mono px-1.5 py-0.5 rounded shadow">
                Fatigue Spike
              </div>
            </div>

            {/* X Axis labels */}
            <div className="flex justify-between text-[8px] font-mono font-bold text-muted pt-2 border-t border-black/5">
              <span>Start</span>
              <span>Midpoint</span>
              <span>End</span>
            </div>
          </div>
        </div>

        {/* Right Card: Interaction Frequency Bar Chart */}
        <div className="glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <h3 className="text-sm font-serif italic text-primary">Interaction Frequency</h3>
            <span className="text-[10px] font-mono text-muted uppercase">Actions count logs</span>
          </div>

          <div className="relative h-44 w-full bg-slate-50 border border-black/[0.03] rounded-2xl p-4 flex flex-col justify-between">
            <div className="absolute left-2 top-2 space-y-1 text-[8px] font-mono text-muted uppercase">
              <p>Actions Per Minute</p>
              <p className="text-[7px]">150%</p>
              <p className="text-[7px]">100%</p>
            </div>

            {/* Custom Bar Chart graphics */}
            <div className="relative w-full h-24 flex items-end justify-center gap-1.5 px-6">
              {[40, 60, 55, 75, 100, 95, 80, 70, 50, 45, 30].map((h, bIdx) => (
                <div key={bIdx} className="w-full bg-[#8A2BE2]/20 hover:bg-[#8A2BE2]/45 rounded-t-md transition-all relative group" style={{ height: `${h}%` }}>
                  {/* Matching colors from image */}
                  <div className="absolute inset-0 bg-[#8A2BE2] rounded-t-md opacity-30 cursor-pointer" />
                </div>
              ))}

              <div className="absolute right-[15%] top-[15%] bg-[#a78bfa] text-white text-[8px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                Speed Drop
              </div>
            </div>

            {/* X Axis label row */}
            <div className="flex justify-between text-[8px] font-mono font-bold text-muted pt-2 border-t border-black/5">
              <span>Start</span>
              <span>Midpoint</span>
              <span>End</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. CENTER DUAL PANEL SPLIT ROW (FATIGUE VS TREND TRACKER) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Fatigue Alert Action Box (5 Cols) */}
        <div className="md:col-span-5 glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-[bounce_2s_infinite]" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#1e1a42]">Fatigue Alert</span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900">Executive Fatigue Detected!</h4>
            <p className="text-xs text-secondary leading-relaxed">
              Attention decline & erratic inputs noted in active mouse and cognitive response telemetry patterns.
            </p>
          </div>

          <div className="pt-3 border-t border-black/5 flex flex-wrap gap-2">
            <button 
              onClick={() => alert("Dispensing cognitive alignment instructions stream...")}
              className="px-4 py-2 bg-[#8A2BE2] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-105 shadow-sm"
            >
              Apply Cognitive Reset
            </button>
            <select className="bg-white border border-[#b3a5e2]/25 rounded-full text-[10px] px-3 font-semibold py-1.5 text-secondary">
              <option>Chang ropur Sepi irs</option>
              <option>Calibrate Clock</option>
            </select>
          </div>
        </div>

        {/* Right Side: Trend Tracker (7 Cols) */}
        <div className="md:col-span-7 glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <h3 className="text-sm font-serif italic text-primary">Trend Tracker</h3>
            <span className="text-[10px] font-mono text-muted">2 Weeks & Change</span>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-secondary">Cognitive Trends</p>
            
            {/* Vector graph with dual line intersections */}
            <div className="h-28 w-full bg-slate-50 border border-black/[0.03] rounded-2xl relative overflow-hidden p-3">
              <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
                {/* Horizontal guide lines */}
                <line x1="0" y1="25" x2="200" y2="25" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                
                {/* Line 1 - Logic Trend */}
                <path d="M0,40 Q40,15 100,32 T200,10" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
                
                {/* Line 2 - Memory Trend */}
                <path d="M0,15 Q50,30 100,12 T200,35" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" />
                
                <circle cx="100" cy="12" r="3.5" fill="var(--accent-purple)" />
                <circle cx="150" cy="22" r="3.5" fill="var(--accent-blue)" />
              </svg>

              {/* Little indicators flags bubble as shown in image 4 */}
              <div className="absolute right-[20%] top-[40%] bg-rose-500 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                -12%
              </div>

              <div className="absolute right-[50%] top-[10%] bg-indigo-600 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                -18%
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. FOOTER THREE PANELS SPLIT ROW (PIXEL FAITHFUL MATCH TO IMAGE 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
        
        {/* Panel 1: Sleep Impact */}
        <div className="p-4 bg-white/60 border border-[#bfaad4]/25 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold tracking-wider uppercase font-mono">Sleep Impact</span>
            <p className="text-xs font-bold text-primary">Memory ↓ 18% on &lt; 6 hrs sleep</p>
          </div>
          <span className="text-xl">🛏️</span>
        </div>

        {/* Panel 2: Stress Indicator */}
        <div className="p-4 bg-white/60 border border-[#bfaad4]/25 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold tracking-wider uppercase font-mono">Stress Indicator</span>
            <p className="text-xs font-bold text-primary">Reaction Time ⁕ Under Pressure</p>
          </div>
          <span>📈</span>
        </div>

        {/* Panel 3: Focus Tips */}
        <div className="p-4 bg-white/60 border border-[#bfaad4]/25 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold tracking-wider uppercase font-mono">Focus Tips</span>
            <p className="text-xs font-bold text-primary">Try 5-4-3-2-1 Grounding Technique</p>
          </div>
          <span className="text-lg">🛠️</span>
        </div>

      </div>

    </div>
  );
};
