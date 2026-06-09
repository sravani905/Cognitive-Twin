import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Star, Award, Compass, Search, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CareerMatchesViewProps {
  metrics: any;
  onLaunchRoadmap: (title: string) => void;
  knnMatches?: any[];
}

const getIconForCareer = (title: string, index: number) => {
  const t = title.toLowerCase();
  if (t.includes("ai")) return "🤖";
  if (t.includes("quantum")) return "⚛️";
  if (t.includes("trader") || t.includes("trading")) return "📈";
  if (t.includes("designer") || t.includes("narrative")) return "🖋️";
  if (t.includes("neuro") || t.includes("surgical")) return "🧠";
  if (t.includes("urban") || t.includes("planner")) return "🗺️";
  if (t.includes("engineer") || t.includes("software")) return "💻";
  if (t.includes("hacker")) return "🔒";
  if (t.includes("legal") || t.includes("counsel")) return "⚖️";
  if (t.includes("director")) return "🎨";
  if (t.includes("data") || t.includes("architect")) return "📊";
  if (t.includes("negotiator")) return "🗣️";
  if (t.includes("healthcare") || t.includes("administrator")) return "🏥";
  if (t.includes("marketing") || t.includes("strategist")) return "🚀";
  
  const emojis = ["⚛️", "🖋️", "🧠", "🚀", "💻", "⚖️", "🎨", "🔬"];
  return emojis[index % emojis.length];
};

const getSkillsForCareer = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("ai")) return "Neural Networks, Numerical Logic, Pattern Recognition";
  if (t.includes("quantum")) return "Calculus Operators, Quantum Logic Gates, Physical Simulators";
  if (t.includes("trader")) return "Speed Perception, Risk Management, Statistics";
  if (t.includes("narrative") || t.includes("designer")) return "Interactive Storytelling, Grammar Topology, Branching Triggers";
  if (t.includes("neuro") || t.includes("surgical")) return "High Execution Precision, Visuomotor Calibration, Focus Density";
  if (t.includes("urban")) return "Spatial Configuration, Civic Optimization, Multi-agent Simulation";
  if (t.includes("engineer") || t.includes("software")) return "Algorithmic Invariants, Code Synthesis, State Management";
  if (t.includes("hacker")) return "Network Topology, Threat Synthesis, Heuristic Decoupling";
  if (t.includes("legal") || t.includes("counsel")) return "Deductive Proofs, Verbal Precision, Contextual Precedents";
  if (t.includes("director")) return "Aesthetic Composition, Creative Synthesis, Semiotics";
  if (t.includes("data")) return "Relational Schemas, Dimensional Reduction, DDL/DML Mechanics";
  if (t.includes("negotiator")) return "Rapport Construction, Semantic Reframing, Micro-expression Parsing";
  if (t.includes("healthcare")) return "Resilience Safeguards, Logistics Calibration, Stress Thresholding";
  if (t.includes("marketing") || t.includes("strategist")) return "Semantic Resonance, A/B Hypothesis Testing, Conversion Analytics";
  return "System Integration, Applied Deductive Thinking, General Strategy";
};

export const CareerMatchesView: React.FC<CareerMatchesViewProps> = ({ metrics, onLaunchRoadmap, knnMatches }) => {
  const [showKnnDemo, setShowKnnDemo] = useState(false);

  // Live sandbox state variables for custom vector creation
  const [demoFocus, setDemoFocus] = useState(metrics?.focusScore || 80);
  const [demoMemory, setDemoMemory] = useState(metrics?.memoryScore || 80);
  const [demoLogic, setDemoLogic] = useState(metrics?.logicScore || 85);
  const [demoSpeed, setDemoSpeed] = useState(metrics?.speedScore || 80);
  const [demoCreativity, setDemoCreativity] = useState(metrics?.creativityScore || 75);

  const demoCareers = [
    { title: "AI Research Scientist", vector: { focus: 95, memory: 80, logic: 98, speed: 60, creativity: 70 }, desc: "High abstract patterns & extreme numerical logic.", icon: "🤖", color: "from-blue-500 to-sky-400" },
    { title: "High-Frequency Trader", vector: { focus: 85, memory: 60, logic: 90, speed: 98, creativity: 40 }, desc: "High-stakes quick decision-making under stress.", icon: "📈", color: "from-red-500 to-orange-400" },
    { title: "Narrative Designer", vector: { focus: 60, memory: 75, logic: 50, speed: 40, creativity: 95 }, desc: "Immersive storytelling, world building & writing.", icon: "🖋️", color: "from-pink-500 to-rose-400" },
    { title: "Surgical Neuro-Specialist", vector: { focus: 98, memory: 90, logic: 85, speed: 80, creativity: 30 }, desc: "Extreme physical health resilience & executive visuospatial precision.", icon: "🧠", color: "from-emerald-500 to-teal-400" },
    { title: "Sustainable Urban Planner", vector: { focus: 80, memory: 75, logic: 85, speed: 50, creativity: 70 }, desc: "Complex systems layout optimization & civil architecture.", icon: "🗺️", color: "from-purple-500 to-indigo-400" }
  ];

  const calculatedDemoMatches = demoCareers.map(car => {
    // 5D Euclidean distance
    const dist = Math.sqrt(
      Math.pow(demoFocus - car.vector.focus, 2) +
      Math.pow(demoMemory - car.vector.memory, 2) +
      Math.pow(demoLogic - car.vector.logic, 2) +
      Math.pow(demoSpeed - car.vector.speed, 2) +
      Math.pow(demoCreativity - car.vector.creativity, 2)
    );
    // Max possible distance in 5D is ~223. Normalize into match percentage %
    const matchScore = Math.max(0, Math.min(100, Math.round(100 - (dist / 1.5))));
    return { ...car, dist, matchScore };
  }).sort((a,b) => b.matchScore - a.matchScore);

  // Let's create the matching cards. If dynamic knnMatches exist, use them, otherwise use the high-fidelity mock dataset!
  const hasDynamicMatches = knnMatches && knnMatches.length > 0;
  
  const primaryMatches = hasDynamicMatches 
    ? knnMatches!.slice(0, 4)
    : [
        {
          title: "Quantum Researcher",
          distance: 40,
          skills: "Data Analysis, Problem Solving",
          growth: 4,
          openings: "72 Listings",
          icon: "⚛️"
        },
        {
          title: "Narrative Designer",
          distance: 45,
          skills: "Storytelling, Creativity",
          growth: 4,
          openings: "56 Listings",
          icon: "🖋️"
        },
        {
          title: "Behavioral Scientist",
          distance: 52,
          skills: "Psychology, Research",
          growth: 4,
          openings: "63 Listings",
          icon: "🧠"
        },
        {
          title: "Startup Strategist",
          distance: 48,
          skills: "Entrepreneurship, Innovation",
          growth: 4,
          openings: "47 Listings",
          icon: "🚀"
        }
      ];

  const processedCards = primaryMatches.map((item: any, idx: number) => {
    const isDynamic = hasDynamicMatches;
    const rawDistance = item.distance ?? 50;
    
    // Normalize format to d = 0.XX as displayed in image
    const distanceStr = isDynamic 
      ? `d = ${(rawDistance / 100).toFixed(2)}` 
      : (typeof item.distance === 'string' ? item.distance : `d = ${(rawDistance / 100).toFixed(2)}`);

    const skills = isDynamic ? getSkillsForCareer(item.title) : item.skills;
    const icon = isDynamic ? getIconForCareer(item.title, idx) : item.icon;
    const openings = isDynamic 
      ? `${Math.floor((item.affinityScore ?? 80) * 0.7) + (item.title.charCodeAt(0) % 15) + 12} Listings` 
      : item.openings;
    
    // Calculate 3-5 star potential dynamically
    const affinity = item.affinityScore ?? 80;
    const growth = isDynamic ? Math.max(3, Math.min(5, Math.ceil(affinity / 20))) : (item.growth ?? 4);

    return {
      title: item.title,
      distance: distanceStr,
      skills,
      growth,
      openings,
      icon,
      affinityScore: item.affinityScore
    };
  });

  // Extract subsequent items as secondary matches if dynamic, else default ones
  const secondaryMatches = hasDynamicMatches && knnMatches!.length > 4
    ? knnMatches!.slice(4, 9).map(x => x.title)
    : ["Education Specialist", "UX Designer", "Clinical Psychologist"];

  return (
    <div className="space-y-8 animate-fade-in text-[#251e44]">
      
      {/* 1. TOP BANNER */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#eae4f5] dark:bg-[#251e44]/40 border border-[#bfaad4]/30 px-6 py-4 rounded-3xl gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif italic text-[#1e1a42] tracking-tight">
              Cogme Twin - Career Matches
            </h2>
            <Award className="w-5 h-5 text-accent-purple animate-[pulse_3s_infinite]" />
          </div>
          <p className="text-[10px] text-muted tracking-wider uppercase font-mono">
            Discover the careers best aligned with your mind.
          </p>
          <button 
            onClick={() => setShowKnnDemo(!showKnnDemo)} 
            className="mt-2 text-[10px] bg-accent-purple text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:brightness-110 shadow-sm flex items-center gap-1 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showKnnDemo ? "Hide Algorithmic Sandbox" : "Interactive KNN Sandbox (How is this generated?)"}</span>
          </button>
        </div>

        {/* Global career search */}
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search careers..."
            className="w-full bg-white/40 border border-[#bfaad4]/20 rounded-full py-1.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-accent-purple text-[#1e1a42] pl-8"
          />
          <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* DETAILED INTERACTIVE KNN ACCORDION BOX */}
      {showKnnDemo && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#f5fbf7] to-[#eefcf3] border-2 border-emerald-500/25 p-6 rounded-3xl space-y-6 shadow-xl text-[#251e44]"
        >
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h3 className="text-lg font-serif italic text-primary flex items-center gap-2">
                <span>📈</span> K-Nearest Neighbors (KNN) Vector Matching Sandbox
              </h3>
              <p className="text-[11px] text-muted">This live demo runs real mechanical distance algorithms inside the browser. Tweak variables to see how closest careers recalculate instantly!</p>
            </div>
            <button 
              onClick={() => setShowKnnDemo(false)}
              className="text-xs text-muted hover:text-primary border border-black/15 px-3 py-1 rounded-full bg-white/70 font-mono"
            >
              × Close Sandbox
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Live Sliders */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#059669] font-mono">1. Adjust Live Cognitive Sandbox Vector</h4>
              
              <div className="bg-white p-4 rounded-2xl border border-black/5 space-y-4 shadow-sm">
                
                {/* Focus slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Attention Focus (focusScore)</span>
                    <span className="font-mono font-bold text-[#059669]">{demoFocus}</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={demoFocus} 
                    onChange={(e) => setDemoFocus(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Memory slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">Working Memory (memoryScore)</span>
                    <span className="font-mono font-bold text-[#059669]">{demoMemory}</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={demoMemory} 
                    onChange={(e) => setDemoMemory(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Logic slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">deductive logic (logicScore)</span>
                    <span className="font-mono font-bold text-[#059669]">{demoLogic}</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={demoLogic} 
                    onChange={(e) => setDemoLogic(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Speed slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">processing speed (speedScore)</span>
                    <span className="font-mono font-bold text-[#059669]">{demoSpeed}</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={demoSpeed} 
                    onChange={(e) => setDemoSpeed(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Creativity slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#4a456e]">creativity expression (creativityScore)</span>
                    <span className="font-mono font-bold text-[#059669]">{demoCreativity}</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={demoCreativity} 
                    onChange={(e) => setDemoCreativity(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="p-2.5 bg-slate-50 border rounded-xl text-[9px] font-mono text-muted space-y-1">
                  <p className="font-bold">Sandbox coordinate vector (5D Space):</p>
                  <p className="text-[#3b82f6] text-[11px] font-bold text-center bg-white border leading-relaxed py-1 rounded">
                    S = [ F: {demoFocus}, M: {demoMemory}, L: {demoLogic}, Sp: {demoSpeed}, Cr: {demoCreativity} ]
                  </p>
                </div>
              </div>
            </div>

            {/* Live KNN calculation outputs */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#059669] font-mono">2. Euclidean Spatial Metric Matches (k=5 cluster)</h4>
              
              <div className="space-y-3 bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
                <p className="text-xs font-mono text-muted border-b pb-1 col-span-2">
                  Metric Formula: d = √Σ(S_i - B_i)² (Lower Distance = Higher Match %)
                </p>

                <div className="space-y-3.5">
                  {calculatedDemoMatches.map((item, idx) => {
                    const isRank1 = idx === 0;
                    return (
                      <div 
                        key={item.title} 
                        className={cn(
                          "p-3 rounded-2xl border transition-all text-sm",
                          isRank1 
                            ? "bg-[#ebfbf0] border-emerald-400 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-400" 
                            : "bg-slate-50/50 border-black/5"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <strong className="text-[#1e1a42] font-serif italic text-xs block">{item.title}</strong>
                              <span className="text-[10px] text-muted">{item.desc}</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="block font-mono font-bold text-emerald-600 text-xs">{item.matchScore}% affinity</span>
                            <span className="text-[9px] font-mono text-muted">dist d = {(item.dist / 100).toFixed(3)}</span>
                          </div>
                        </div>

                        {/* Visual graph line comparing user sandbox vs career vector */}
                        <div className="mt-2 pt-1.5 border-t border-dashed border-black/5 flex items-center justify-between text-[8px] font-mono text-muted gap-4">
                          <span>Target benchmarks:</span>
                          <div className="flex gap-2 text-[8px]">
                            <span>Focus: {item.vector.focus}</span>
                            <span>Memory: {item.vector.memory}</span>
                            <span>Logic: {item.vector.logic}</span>
                            <span>Speed: {item.vector.speed}</span>
                            <span>Creativity: {item.vector.creativity}</span>
                          </div>
                        </div>

                        {isRank1 && (
                          <div className="mt-1.5 text-[9px] font-semibold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block">
                            🏆 Closest Spatial Affinity Winner
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* 2. RECRUITMENT SPLIT ROW FOR SRAVANI */}
      <div className="flex justify-between items-center bg-white/20 px-4 py-2 border-b border-[#bfaad4]/10 text-xs">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
          <span>Top Career Recommendations for Sravani</span>
        </div>
        <div className="flex items-center gap-2 text-muted font-mono">
          <span>Sort by:</span>
          <select className="bg-white/60 border border-[#bfaad4]/20 rounded p-1 text-[11px] font-sans">
            <option>Best Match</option>
            <option>Lowest Distance</option>
          </select>
        </div>
      </div>

      {/* 3. MAIN DUAL SECTION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Grid: 2x2 of Career cards (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processedCards.map((career, i) => (
              <div 
                key={i}
                className="glow-card p-5 rounded-3xl bg-[#fdfcff] hover:bg-white/60 border border-[#b3a5e2]/25 relative flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {/* Top Circle emblem and title */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center text-lg shadow-sm">
                        {career.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-serif font-bold text-primary group-hover:text-accent-purple transition-colors">
                          {career.title}
                        </h4>
                        <span className="text-[10px] text-accent-purple font-bold font-mono bg-accent-purple/5 px-2 py-0.5 rounded">
                          {career.distance}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bullet description keys */}
                  <div className="mt-4 pt-3 border-t border-black/[0.03] space-y-2 text-[11px] text-[#4a456e]">
                    <p>• <strong>Skill Overlap:</strong> <span className="italic">{career.skills}</span></p>
                    <div className="flex items-center gap-1.5">
                      <span>• <strong>Growth Potential:</strong></span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: career.growth }).map((_, sIdx) => (
                          <Star key={sIdx} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer interactive buttons */}
                <div className="mt-5 pt-3 border-t border-black/[0.03] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted">
                    🚀 {career.openings}
                  </span>
                  <button 
                    onClick={() => onLaunchRoadmap(career.title)}
                    className="px-3 py-1 bg-accent-purple text-white text-[10px] font-bold uppercase tracking-wider rounded-full hover:brightness-105 active:scale-95 transition-all text-center shrink-0 shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SECONDARY MATCHES RIBBON */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7c779e] font-mono border-b border-black/5 pb-2">Secondary Matches</h4>
            <div className="flex flex-wrap gap-2.5">
              {secondaryMatches.map((secondary, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onLaunchRoadmap(secondary)}
                  className="bg-white/60 dark:bg-black/10 border border-[#bfaad4]/25 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-medium cursor-pointer hover:bg-white transition-all text-secondary"
                >
                  <span>💼</span>
                  <span>{secondary}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Insights widgets */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="text-base font-serif italic text-primary">Career Insights</h3>
              <Compass className="w-4 h-4 text-muted animate-spin" style={{ animationDuration: '10s' }} />
            </div>

            <ul className="space-y-3 text-xs text-[#4a456e] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-accent-purple font-bold">•</span>
                <p><strong>High Logic:</strong> Outstanding Analytical Skills and problem framing traits parsed from tests.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-pink font-bold">•</span>
                <p><strong>Creative Problem-Solving:</strong> Thrives on abstract designs and storyboards.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-blue font-bold">•</span>
                <p><strong>Adaptive to New Challenges:</strong> Highly versatile and robust cognitive control index.</p>
              </li>
            </ul>

            {/* Suggested Focus display */}
            <div className="p-4 bg-accent-purple/[0.04] rounded-2xl border border-accent-purple/10 space-y-2">
              <span className="text-[10px] font-bold text-[#7c779e] font-mono uppercase tracking-wider block">Suggested Focus</span>
              <div className="py-2.5 px-4 bg-white/60 rounded-xl text-center text-xs font-bold text-accent-purple border border-accent-purple/10 uppercase tracking-wide">
                High Tech & Creative Fields
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
