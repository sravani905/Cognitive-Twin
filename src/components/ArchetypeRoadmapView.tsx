import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Check, Calendar, ChevronRight, Play, ArrowRight, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const ArchetypeRoadmapView: React.FC = () => {
  const [coachingList, setCoachingList] = useState([
    { id: 1, label: "Focus Sprints: Try 25 mins, then a break", checked: true },
    { id: 2, label: "Logic Puzzles: Train quick thinking", checked: false },
    { id: 3, label: "Mindfulness: Practice 5 mins of calm", checked: true }
  ]);

  const [showRoadmapDemo, setShowRoadmapDemo] = useState(false);
  const [selectedGap, setSelectedGap] = useState<'focus' | 'creativity' | 'logic' | 'memory'>('focus');
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generatedCurriculum, setGeneratedCurriculum] = useState<any[] | null>(null);
  const [showChallengeToast, setShowChallengeToast] = useState(false);

  const curriculumDB = {
    focus: [
      { week: "Week 1: Baseline Jitter Calibration", task: "Perform two 20-minute silent focus sprints daily. Track and graph attention lapses.", icon: "🧘" },
      { week: "Week 2: Audio Entrainment Gating", task: "Work with 40Hz binaural beats for complex task sessions to reinforce cognitive stability.", icon: "🎧" },
      { week: "Week 3: Stress-Interference Drills", task: "Execute rapid calculations with chaotic external auditory soundscapes active.", icon: "⚡" },
      { week: "Week 4: Flow Gating Integration", task: "Achieve 45 minutes of continuous hyper-focus blocks with zero distraction lapses.", icon: "🏆" }
    ],
    creativity: [
      { week: "Week 1: Divergent Sandbox Exploration", task: "Write 10 alternative functions for basic everyday objects like paperclips or spoons.", icon: "💡" },
      { week: "Week 2: Random Relational Synthesis", task: "Synthesize a functional concept combining two randomly chosen objects (e.g. Clock & Cloud).", icon: "🎨" },
      { week: "Week 3: Semantic Association Trains", task: "Design an entire story narrative using a sequence of word associations under 3 minutes.", icon: "🖋️" },
      { week: "Week 4: Aesthetic Design Immersion", task: "Render a conceptual prototype incorporating three distinct sensory themes.", icon: "🌟" }
    ],
    logic: [
      { week: "Week 1: Deductive Heuristic Exercises", task: "Solve 5 syllogistic logic models and state validity constraints under speeded conditions.", icon: "🧩" },
      { week: "Week 2: Bayesian Tree Layouts", task: "Map nested decision flows for complex uncertainty scenarios using tree diagrams.", icon: "📊" },
      { week: "Week 3: Game Theoretical Scenarios", task: "Analyze optimal strategies in dynamic multi-actor matrices under time constraints.", icon: "⚛️" },
      { week: "Week 4: Complex Algorithm Execution", task: "Design and debug an optimal logical rule sorting script from raw attributes.", icon: "💻" }
    ],
    memory: [
      { week: "Week 1: Dual N-Back Auditory Mastery", task: "Execute 15 minutes of Dual N-Back sequence training with visual anchors active.", icon: "🧠" },
      { week: "Week 2: Loci-Method Mind Palace Construction", task: "Store and recall a set of 20 arbitrary words using a virtual room memory trail.", icon: "🏛️" },
      { week: "Week 3: Spaced Retrieval Sequences", task: "Recall stored word sequences at increasing mathematical delay intervals (1m, 5m, 25m).", icon: "🕰️" },
      { week: "Week 4: Cognitive Consolidation Audits", task: "Successfully recall a full 20-item layout from memory with zero errors after 6 hours.", icon: "🏆" }
    ]
  };

  const triggerRoadmapGen = () => {
    setIsGeneratingRoadmap(true);
    setGeneratedCurriculum(null);
    setTimeout(() => {
      setIsGeneratingRoadmap(false);
      setGeneratedCurriculum(curriculumDB[selectedGap]);
    }, 1500);
  };

  const toggleChallenge = (id: number) => {
    setCoachingList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#251e44]">
      
      {/* 1. TOP HEADER */}
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl font-serif italic text-primary font-bold">
          Archetype Roadmap
        </h2>
        <p className="text-sm font-medium text-muted tracking-wide">
          Your Personalized Growth Journey
        </p>
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-accent-purple bg-accent-purple/5 px-4 py-1.5 rounded-full">
            <span>★</span>
            <span>Step by step, we'll unlock your full potential.</span>
            <span>🧭</span>
          </span>
          <button 
            onClick={() => setShowRoadmapDemo(!showRoadmapDemo)} 
            className="text-[10px] bg-accent-purple text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:brightness-110 shadow-sm flex items-center gap-1 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showRoadmapDemo ? "Hide Growth Sequencer" : "Interactive Growth Map Demo (How is this generated?)"}</span>
          </button>
        </div>
      </div>

      {/* DETAILED INTERACTIVE ROADMAP GENERATOR BOX */}
      {showRoadmapDemo && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-[#f5f7fc] to-[#eff3fc] border-2 border-[#8A2BE2]/25 p-6 rounded-3xl space-y-6 shadow-xl text-[#251e44]"
        >
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h3 className="text-lg font-serif italic text-primary flex items-center gap-2">
                <span>🧭</span> Adaptive Curriculum Sequencer Sandbox
              </h3>
              <p className="text-[11px] text-muted font-sans">See how our engine identifies cognitive score gaps and designs week-by-week progressive training paths.</p>
            </div>
            <button 
              onClick={() => setShowRoadmapDemo(false)}
              className="text-xs text-muted hover:text-primary border border-black/15 px-3 py-1 rounded-full bg-white/70 font-mono"
            >
              × Close Sandbox
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gap Choice Columns */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#5c4ce1] font-mono">1. Select Target Cognitive Focus area</h4>
              
              <div className="bg-white p-5 rounded-2xl border border-black/5 space-y-4 shadow-sm">
                <p className="text-xs text-muted">A standard growth map is calculated from target metrics that represent the lowest relative indices. Choose a target deficit area below:</p>
                
                <div className="space-y-2">
                  {[
                    { id: 'focus', title: "Focus & Gating Stability", metric: "Attentional Jitter", emoji: "🧘" },
                    { id: 'creativity', title: "Divergent Creativity", metric: "Divergence Block", emoji: "💡" },
                    { id: 'logic', title: "Analytical Deduction", metric: "Reasoning Speed", emoji: "🧩" },
                    { id: 'memory', title: "Working Memory Index", metric: "Sequencing Error", emoji: "🧠" }
                  ].map(gap => (
                    <button
                      key={gap.id}
                      onClick={() => {
                        setSelectedGap(gap.id as any);
                        setGeneratedCurriculum(null);
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center transition-all",
                        selectedGap === gap.id 
                          ? "bg-[#eae4f5] border-accent-purple font-semibold text-[#1e1a42]" 
                          : "bg-slate-50 border-black/5 text-[#4a456e] hover:bg-slate-100/70"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>{gap.emoji}</span>
                        <span>{gap.title}</span>
                      </span>
                      <span className="font-mono text-[9px] bg-black/5 px-2 py-0.5 rounded text-muted">{gap.metric}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={triggerRoadmapGen}
                  disabled={isGeneratingRoadmap}
                  className="w-full bg-[#8A2BE2] hover:brightness-105 text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {isGeneratingRoadmap ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sequencing Modules...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate 4-Week Curriculum</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Progress visual log */}
              {isGeneratingRoadmap && (
                <div className="p-3.5 bg-black/5 rounded-2xl text-[9px] font-mono text-muted space-y-1.5 animate-pulse">
                  <div className="flex gap-2 items-center"><span className="text-emerald-500">✔</span> Analyzing target dimension metrics for error constraints...</div>
                  <div className="flex gap-2 items-center"><span className="text-emerald-500">✔</span> Mapping cognitive techniques pool database...</div>
                  <div className="flex gap-2 items-center"><div className="w-2 h-2 border-2 border-slate-600 border-t-transparent rounded-full animate-spin shrink-0"/> Distributing weeks linearly (Ascending complexity)...</div>
                </div>
              )}
            </div>

            {/* Generated results Column */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#5c4ce1] font-mono">2. Adaptive Weeks Timeline Output</h4>
              
              <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm space-y-4 min-h-[300px] flex flex-col justify-center">
                {!generatedCurriculum && !isGeneratingRoadmap && (
                  <div className="text-center space-y-2 py-8">
                    <span className="text-3xl text-slate-300 block">🧭</span>
                    <strong className="text-slate-400 font-sans block text-sm">Select focus above and click "Generate"</strong>
                    <p className="text-[11px] text-muted max-w-sm mx-auto">This demonstrates how the Cogme Twin curriculum maps weekly incremental objectives based on custom cognitive dimensions.</p>
                  </div>
                )}

                {isGeneratingRoadmap && (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-8 h-8 border-4 border-[#8A2BE2] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-[#4a456e] block">Running Sequence Mapping algorithm...</p>
                  </div>
                )}

                {generatedCurriculum && (
                  <div className="space-y-4 w-full">
                    <div className="bg-[#eae4f5]/30 p-2.5 rounded-xl border border-accent-purple/10 flex justify-between items-center text-xs">
                      <span>Curriculum Focus: <strong className="capitalize text-[#8A2BE2] font-bold">{selectedGap} Training Series</strong></span>
                      <span className="bg-[#8A2BE2] text-white px-2 py-0.5 rounded font-mono text-[9px]">4 Steps Loaded</span>
                    </div>

                    <div className="space-y-3">
                      {generatedCurriculum.map((step, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50/70 border border-black/5 flex gap-3 items-start hover:bg-slate-100/50 transition-all text-sm">
                          <span className="w-7 h-7 rounded-full bg-[#eae4f5] border border-accent-purple/20 flex items-center justify-center font-mono font-bold text-accent-purple shrink-0 text-xs text-secondary shadow-sm">
                            W{idx+1}
                          </span>
                          <div className="space-y-1">
                            <h5 className="font-serif font-bold text-xs text-[#1e1a42] flex items-center gap-1.5">
                              <span>{step.icon}</span>
                              <span>{step.week}</span>
                            </h5>
                            <p className="text-[11px] text-[#4a456e] leading-snug">{step.task}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-[9px] font-mono text-center text-muted">★ This custom curriculum matches the active Coaching Timeline layout below.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* 2. HORIZONTAL TIMELINE ROW NODES (PIXEL FAITHFUL MATCH TO IMAGE 3) */}
      <div className="relative p-6 bg-white/40 border border-[#bfaad4]/25 rounded-3xl">
        {/* Dotted Connecting Background Line */}
        <div className="absolute top-1/2 left-10 right-10 h-0.5 border-t border-dashed border-accent-purple/30 -translate-y-1/2 z-0" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Node 1: Memory Mastery */}
          <div className="bg-[#fcfaff] p-5 rounded-2xl border border-accent-purple/10 flex items-start gap-4 shadow-sm hover:translate-y-[-2px] transition-transform">
            <span className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center font-bold text-xs text-accent-purple shrink-0">1</span>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-muted uppercase">Last Week</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase">Achieved</span>
              </div>
              <h4 className="text-sm font-serif font-bold text-primary">Memory Mastery</h4>
              <p className="text-xs text-muted leading-snug">Advanced memory logic & retention achieved.</p>
              <div className="w-10 h-10 mt-1 bg-pink-100 rounded-lg flex items-center justify-center text-lg">
                📚
              </div>
            </div>
          </div>

          {/* Node 2: Mental Agility */}
          <div className="bg-[#fefeff] p-5 rounded-2xl border-2 border-accent-purple/40 flex items-start gap-4 shadow-md hover:translate-y-[-2px] transition-transform">
            <span className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center font-bold text-xs text-accent-purple shrink-0">2</span>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-muted uppercase">This Week</span>
                <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded uppercase">In Progress</span>
              </div>
              <h4 className="text-sm font-serif font-bold text-primary">Mental Agility</h4>
              <p className="text-xs text-muted leading-snug">Adapt to complex work challenge variables.</p>
              <div className="w-10 h-10 mt-1 bg-amber-100 rounded-lg flex items-center justify-center text-lg">
                ⚡
              </div>
            </div>
          </div>

          {/* Node 3: Sleep Optimization */}
          <div className="bg-[#fcfaff] p-5 rounded-2xl border border-accent-purple/15 flex items-start gap-4 shadow-sm hover:translate-y-[-2px] transition-transform">
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">3</span>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-muted uppercase">Coming Up</span>
                <span className="text-[9px] bg-sky-50 text-sky-600 font-bold px-1.5 py-0.5 rounded uppercase font-mono">Next Goal</span>
              </div>
              <h4 className="text-sm font-serif font-bold text-primary">Sleep Optimization</h4>
              <p className="text-xs text-muted leading-snug">Better rest translates to a sharper mind.</p>
              <div className="w-10 h-10 mt-1 bg-indigo-100 rounded-lg flex items-center justify-center text-lg">
                🌙
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. ROADMAP COACHING & CHAT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column sidebar for Coaching Tips (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glow-card p-6 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-4">
            <h3 className="text-base font-serif italic text-primary">Coaching Tips</h3>
            
            <div className="space-y-2.5">
              {coachingList.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleChallenge(item.id)}
                  className="p-3 bg-white hover:bg-slate-50 border border-black/5 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <p className="text-xs text-secondary leading-tight">{item.label}</p>
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center border transition-all",
                    item.checked ? "bg-accent-purple text-white border-accent-purple" : "border-slate-300"
                  )}>
                    {item.checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need a new challenge helper */}
          <div className="glow-card p-5 bg-[#fdfcff] rounded-3xl border border-[#b3a5e2]/25 space-y-3 relative">
            <p className="text-xs font-semibold text-primary">Need a new challenge?</p>
            <button 
              onClick={() => {
                setShowRoadmapDemo(true);
                setShowChallengeToast(true);
                setTimeout(() => setShowChallengeToast(false), 4500);
              }}
              className="w-full bg-[#8A2BE2] text-white py-2.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-105 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>+ Generate Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            {showChallengeToast && (
              <div className="absolute -top-12 left-0 right-0 p-2 bg-[#241c4f] text-white rounded-xl text-[9px] font-mono text-center shadow-lg animate-pulse z-20">
                🧬 Curriculum Sequencer Activated Above!
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Gemini Chat Box & Focus chart (8 Cols) */}
        <div className="lg:col-span-8 p-6 bg-white/40 rounded-3xl border border-[#bfaad4]/25 space-y-6">
          
          {/* Top Gemini Chat bubble from Image 3 */}
          <div className="flex gap-4">
            {/* Avatar face sketch mock */}
            <div className="w-12 h-12 rounded-full border border-[#8A2BE2]/20 overflow-hidden shrink-0 bg-indigo-50 flex items-center justify-center font-bold text-[#8A2BE2]">
              👩🏻‍💼
            </div>
            
            {/* Thought speech bubble */}
            <div className="flex-1 space-y-3">
              <div className="p-4 bg-[#fcfaff] border border-accent-purple/10 rounded-2xl rounded-tl-none relative shadow-sm">
                <span className="text-[10px] text-accent-purple font-mono uppercase tracking-widest block font-bold mb-1">Gemini ★</span>
                <p className="text-xs text-primary leading-relaxed">
                  "Your next focus: Sleep Optimization. Let's boost your restorative power and calibrate your circadian rhythm today!"
                </p>
              </div>

              {/* Instant suggested user responses capsules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Create a Relaxing Night Routine",
                  "Track Sleep Patterns",
                  "Mindfulness Exercises"
                ].map((action, actionIdx) => (
                  <button 
                    key={actionIdx}
                    onClick={() => alert(`Starting action cycle: ${action}`)}
                    className="p-2.5 rounded-xl border border-[#b3a5e2]/25 bg-white/60 hover:bg-white text-xs font-medium text-[#4a456e] text-left hover:border-accent-purple transition-all flex justify-between items-center group md:col-span-1"
                  >
                    <span>{action}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-accent-purple group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coordinate stars map block from Image 3 */}
          <div className="pt-4 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="bg-[#fdfcff] p-4 rounded-2xl border border-[#bfaad4]/25 flex-1 w-full space-y-2">
              <p className="text-[10px] font-mono text-muted uppercase tracking-wider">Locus Mapped Focus</p>
              
              {/* Minimal coordinates grid */}
              <div className="h-28 w-full border border-black/[0.03] rounded-xl relative overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px))] bg-[size:16px] pointer-events-none" />
                <div className="relative w-full h-full">
                  {/* Multiple color stars representing coordinates */}
                  <div className="absolute left-[20%] top-[40%] text-xs">⭐</div>
                  <div className="absolute left-[50%] top-[10%] text-xs animate-ping">✨</div>
                  <div className="absolute left-[70%] top-[60%] text-xs">⭐</div>
                  <div className="absolute left-[45%] top-[75%] text-xs">🌟</div>
                  <div className="absolute left-[80%] top-[25%] text-xs">🌟</div>
                  
                  <div className="absolute left-4 bottom-4 bg-[#8A2BE2] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    ✓ Crinine
                  </div>
                </div>
              </div>
            </div>

            {/* Selection and actions bar */}
            <div className="w-full md:w-52 space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-semibold text-muted font-mono uppercase">Select Track</label>
                <select className="w-full bg-white border border-[#b3a5e2]/25 rounded-xl py-1.5 px-3 text-xs focus:outline-none">
                  <option>US 1. Narratives Orovnew</option>
                  <option>US 2. Memory Agility</option>
                </select>
              </div>

              <button 
                onClick={() => alert("Launching your daily journaling log...")}
                className="w-full bg-[#eae4f5] border border-[#bfaad4]/20 text-[#1e1a42] hover:bg-white text-xs font-bold uppercase tracking-widest py-2 rounded-xl transition-all shadow-sm"
              >
                Open Journal
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
