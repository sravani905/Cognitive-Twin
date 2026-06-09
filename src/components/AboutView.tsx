import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Compass, 
  Target, 
  Eye, 
  Sparkles, 
  Cpu, 
  GitMerge, 
  BrainCircuit, 
  BookOpen, 
  PieChart, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Zap,
  HelpCircle,
  FileText
} from 'lucide-react';
import { SparkleBackground } from './SparkleBackground';

interface AboutViewProps {
  onClose: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'architecture' | 'swot' | 'docs'>('mission');

  // Interactive Flowchart active node highlighting
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const flowchartNodes = [
    { 
      id: 1, 
      title: "1. Psychometric Input", 
      desc: "Comprehensive testing of memory, logic, EQ, spatial, and numeric facets.", 
      icon: Compass, 
      color: "from-blue-400 to-indigo-500" 
    },
    { 
      id: 2, 
      title: "2. Vector Mapping (Latent Space)", 
      desc: "Projects scores into custom high-dimensional cognitive coordinate spaces.", 
      icon: GitMerge, 
      color: "from-indigo-500 to-purple-500" 
    },
    { 
      id: 3, 
      title: "3. Gemini Synthesis Engine", 
      desc: "Generates custom developmental paths and behavioral models in real time.", 
      icon: Sparkles, 
      color: "from-purple-500 to-pink-500" 
    },
    { 
      id: 4, 
      title: "4. Cognitive Twin Reflection", 
      desc: "Continuous simulation, career matches, resilience forecasts, and chronotypes.", 
      icon: BrainCircuit, 
      color: "from-pink-500 to-rose-500" 
    }
  ];

  const swotData = {
    strengths: [
      "No-latency local failover logic ensuring uninterrupted assessment",
      "Dynamic real-time vector coordinate spaces for cognitive mapping",
      "Ultra-polished fluid feedback engine and interactive design aesthetics",
      "Comprehensive profiling including chronotype models and resilience forecasting"
    ],
    weaknesses: [
      "Heavily reliant on local browser Sandbox cache for guest sessions",
      "Dynamic prompt token latency can occur during massive simultaneous server-side parallel synthesis",
      "Currently restricted to virtualized digital-mirror workspaces"
    ],
    opportunities: [
      "Integrating bio-metric wearable sensory synchronizations",
      "Predictive chronotype alarm clock widget ecosystem additions",
      "Federated privacy-focused local-only vector fine-tunings"
    ],
    threats: [
      "Rapid shifts in generic off-the-shelf proprietary language model formatting",
      "Evolving global data compliance standards for non-custodial neural profiling metrics"
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-[#faf8fc]/90 backdrop-blur-3xl flex flex-col font-sans select-none pb-12"
    >
      <SparkleBackground intensity="rich" />

      {/* Premium Sticky Navigation Header */}
      <div className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-purple-100/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8161e1] to-[#9979f4] flex items-center justify-center text-white font-serif italic text-lg shadow-md shadow-indigo-600/10">
            C
          </div>
          <div>
            <span className="text-base font-serif italic font-bold text-[#322851]">Cognitive Twin</span>
            <span className="text-[9px] uppercase tracking-widest block font-bold text-[#8c78a5]">Identity Matrix</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="hidden md:flex bg-white/70 border border-purple-100/65 rounded-full p-1 gap-1">
          {([
            { id: 'mission', label: 'Motto & Vision', icon: Target },
            { id: 'architecture', label: 'Flow & Architecture', icon: Cpu },
            { id: 'swot', label: 'SWOT / SWAT Grid', icon: PieChart },
            { id: 'docs', label: 'Full Documentation', icon: BookOpen }
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
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-8 flex-1 flex flex-col">
        
        {/* Mobile Tab Control Select bar (only visible on small viewports) */}
        <div className="flex md:hidden bg-white/80 border border-purple-100 rounded-2xl p-2 gap-1 mb-6 flex-wrap justify-center shadow-sm">
          {([
            { id: 'mission', label: 'Motto & Vision', icon: Target },
            { id: 'architecture', label: 'Flow', icon: Cpu },
            { id: 'swot', label: 'SWAT / SWOT', icon: PieChart },
            { id: 'docs', label: 'Documentation', icon: BookOpen }
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
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents Panels with AnimatePresence */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'mission' && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* Introduction Display */}
                <div className="text-center max-w-3xl mx-auto space-y-4 py-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">Motto & Foundations</span>
                  <h1 className="text-4xl md:text-5xl font-serif italic text-[#322851] tracking-tight">"Your Living Digital Reflection"</h1>
                  <p className="text-[#6e5380] text-sm md:text-base leading-relaxed font-light">
                    Cognitive Twin is a hyper-personalized self-discovery mechanism built to chart the complex typography of your inner consciousness, vectorizing logic, empathy, abstract synthesis, and behavioral tendencies into a beautiful live dashboard.
                  </p>
                </div>

                {/* Motto, Vision, Mission, Goal Cards grid */}
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  
                  {/* Motto Card */}
                  <div className="bg-white/80 border border-purple-100/70 p-8 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 flex flex-col space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-[#8161e1] shadow-sm">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-serif text-[#322851] italic font-semibold">Core Motto</h3>
                    <p className="text-xs text-[#513c66] leading-relaxed font-light">
                      "Synthesize the intangible, design the human." We believe consciousness should not just be experienced, but gracefully illustrated, allowing users to meet their virtual counterpart to simulate behaviors, unlock potential, and mitigate fatigue.
                    </p>
                  </div>

                  {/* Vision Card */}
                  <div className="bg-white/80 border border-purple-100/70 p-8 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 flex flex-col space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-500 shadow-sm">
                      <Eye className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-serif text-[#322851] italic font-semibold">Vision Statement</h3>
                    <p className="text-xs text-[#513c66] leading-relaxed font-light">
                      To engineer safe, private, non-custodial introspective containers that empower individuals to explore complex sensory chronotypes, forecasting optimal workflow behaviors and finding bespoke professional landscapes in a beautifully integrated workspace.
                    </p>
                  </div>

                  {/* Mission Card */}
                  <div className="bg-white/80 border border-purple-100/70 p-8 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 flex flex-col space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500 shadow-sm">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-serif text-[#322851] italic font-semibold">Our Mission</h3>
                    <p className="text-xs text-[#513c66] leading-relaxed font-light">
                      To make state-of-the-art cognitive analytics approachable and elegant. By pairing vector coordinate math, high-fidelity UI design, and local browser execution, we protect individual identity while showing rich behavioral landscapes.
                    </p>
                  </div>

                  {/* Goal Card */}
                  <div className="bg-white/80 border border-purple-100/70 p-8 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 flex flex-col space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-serif text-[#322851] italic font-semibold">Operational Goals</h3>
                    <p className="text-xs text-[#513c66] leading-relaxed font-light">
                      Equip users with detailed chronological schedules, tailored career fits, creative brainstorm pathways, and vector alignment reports that turn conceptual psychology into active, daily productivity tools.
                    </p>
                  </div>

                </div>

                {/* Team / Research Authors Profile Card */}
                <div className="bg-gradient-to-tr from-[#8161e1]/5 via-[#9979f4]/5 to-transparent border border-[#8161e1]/20 p-8 rounded-[2.5rem] space-y-6 shadow-md mt-6">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono font-bold text-[#8161e1] uppercase tracking-[0.25em]">B.Tech CSE (Data Science) Major Project</span>
                    <h3 className="text-2xl font-serif text-[#322851] italic font-semibold">Research Undergraduates & Authors</h3>
                    <p className="text-xs text-[#6e5380] font-light max-w-xl mx-auto">
                      Developed as a Major Research Project in partial fulfillment of Jawaharlal Nehru Technological University Hyderabad (JNTUH) B.Tech standards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: "K. Laxmi Brunda", roll: "24D21A6730", initial: "K", bg: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                      { name: "G. Sravani", roll: "24D21A6722", initial: "G", bg: "bg-pink-50 text-pink-600 border-pink-100" },
                      { name: "A. Shirisha", roll: "24D21A6702", initial: "A", bg: "bg-emerald-50 text-emerald-600 border-[#10b981]/20" }
                    ].map((author, index) => (
                      <div key={index} className="bg-white border border-purple-100/60 p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl ${author.bg} border flex items-center justify-center font-bold font-serif text-sm`}>
                          {author.initial}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#322851]">{author.name}</h4>
                          <p className="text-[10px] font-mono text-[#8c78a5] mt-0.5">Roll: {author.roll}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-purple-50 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#8c78a5] font-mono gap-4 w-full">
                    <span>GUIDED BY: <strong>MRS. HYMAVATHI</strong> (Asst. Professor, Dept of CSE - DS)</span>
                    <span><strong>SRIDEVI WOMEN'S ENGINEERING COLLEGE</strong></span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">Data Pipeline Model</span>
                  <h2 className="text-3xl font-serif italic text-[#322851]">Interactive Application Flowchart</h2>
                  <p className="text-[#6e5380] text-xs md:text-sm font-light leading-relaxed">
                    Hover or tap on each node of the system map to see how data flows from your immediate inputs through vector spaces and into the final dashboard report.
                  </p>
                </div>

                {/* Flowchart Layout */}
                <div className="relative min-h-[350px] bg-white/80 border border-purple-100/75 p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 flex flex-col justify-center">
                  
                  {/* Flow Lines Connecting Steps */}
                  <div className="absolute inset-x-12 top-[48%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 via-purple-100 via-pink-100 to-rose-100 hidden md:block pointer-events-none z-0" />

                  <div className="grid md:grid-cols-4 gap-6 relative z-10">
                    {flowchartNodes.map((node, index) => {
                      const Icon = node.icon;
                      const isActive = activeNode === node.id;
                      return (
                        <div 
                          key={node.id}
                          onMouseEnter={() => setActiveNode(node.id)}
                          onMouseLeave={() => setActiveNode(null)}
                          onClick={() => setActiveNode(isActive ? null : node.id)}
                          className={`relative group bg-white p-6 rounded-3xl border transition-all duration-300 transform cursor-pointer flex flex-col items-center text-center ${
                            isActive 
                              ? 'border-[#8161e1] shadow-xl shadow-[#8161e1]/12 scale-[1.03] -translate-y-1' 
                              : 'border-purple-100 hover:border-[#8161e1]/45 shadow-sm hover:translate-y-[-2px]'
                          }`}
                        >
                          {/* Circle Badge Number */}
                          <div className={`absolute -top-3 left-4 w-7 h-7 rounded-full bg-gradient-to-tr ${node.color} text-white font-bold text-xs flex items-center justify-center shadow-sm`}>
                            {node.id}
                          </div>

                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${node.color} text-white flex items-center justify-center shadow-md mb-4`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <h4 className="text-sm font-bold text-[#322851] mb-2">{node.title}</h4>
                          <p className="text-[11px] text-[#6e5380] leading-relaxed font-light">{node.desc}</p>

                          {/* Connection chevron for small devices */}
                          {index < 3 && (
                            <div className="flex justify-center items-center mt-4 text-purple-200 md:hidden animate-bounce">
                              <ArrowRight className="w-4 h-4 rotate-90" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Dynamic Instruction Node Explainer Box */}
                  <div className="mt-8 border-t border-purple-50 pt-6 text-center max-w-md mx-auto min-h-[70px]">
                    <AnimatePresence mode="wait">
                      {activeNode !== null ? (
                        <motion.div
                          key={`node-explain-${activeNode}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-1.5"
                        >
                          <span className="text-[10px] font-bold text-[#8161e1] uppercase tracking-widest font-mono">
                            Engineering Blueprint Section {activeNode}
                          </span>
                          <p className="text-xs text-[#513c66] font-medium leading-relaxed">
                            {activeNode === 1 && "Psychometric Data: Synthesizes timed cognitive patterns. Ensures randomized question pools with local client memory failover if API keys are absent."}
                            {activeNode === 2 && "Vector Mapping: Translates psychometric scores directly into coordinate points across logic, risk, numerical, narrative, abstract, and auditory spaces."}
                            {activeNode === 3 && "Gemini Pipeline: An intelligent prompt chains together your career coordinates and chronotype logs to generate custom actionable advice."}
                            {activeNode === 4 && "Persistent Digital reflection: Syncs your local profile cache to build custom interactive modules like the Sensory Sanctuary and Forecasting."}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="node-default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[#8c78a5] text-xs italic flex items-center justify-center gap-2 h-full py-4.5"
                        >
                          <HelpCircle className="w-4 h-4" /> Hover or tap any card above to examine detailed workflow architectures.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'swot' && (
              <motion.div
                key="swot"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">Strategic Analysis</span>
                  <h2 className="text-3xl font-serif italic text-[#322851]">Bento SWOT / SWAT Assessment</h2>
                  <p className="text-[#6e5380] text-xs md:text-sm font-light leading-relaxed">
                    A thorough look at our structural strengths, physical limits, and upcoming paths.
                  </p>
                </div>

                {/* Bento Grid layout for SWOT */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Strengths */}
                  <div className="bg-gradient-to-tr from-[#f8f6ff] to-white border border-[#8161e1]/20 p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-3 top-3 w-16 h-16 text-[#8161e1]/5 group-hover:scale-110 transition-transform">
                      <Zap className="w-full h-full" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#8161e1]/10 flex items-center justify-center text-[#8161e1] font-bold text-sm">S</div>
                      <h4 className="text-base font-bold text-[#322851]">Core Strengths</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {swotData.strengths.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-[#513c66] leading-relaxed">
                          <span className="text-[#8161e1] font-bold font-mono">✦</span>
                          <span className="font-light">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-gradient-to-tr from-[#fff7f9] to-white border border-rose-100 p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-3 top-3 w-16 h-16 text-rose-500/5 group-hover:scale-110 transition-transform">
                      <ShieldAlert className="w-full h-full" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-sm">W</div>
                      <h4 className="text-base font-bold text-[#322851]">Identified Limits (Weaknesses)</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {swotData.weaknesses.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-[#513c66] leading-relaxed">
                          <span className="text-rose-400 font-bold font-mono">✦</span>
                          <span className="font-light">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-gradient-to-tr from-[#f0fbf8] to-white border border-emerald-100 p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-3 top-3 w-16 h-16 text-emerald-500/5 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-full h-full" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold text-sm">O</div>
                      <h4 className="text-base font-bold text-[#322851]">Future Opportunities</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {swotData.opportunities.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-[#513c66] leading-relaxed">
                          <span className="text-emerald-500 font-bold font-mono">✦</span>
                          <span className="font-light">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="bg-gradient-to-tr from-[#fffbeb] to-white border border-amber-100 p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-3 top-3 w-16 h-16 text-amber-500/5 group-hover:scale-110 transition-transform">
                      <Compass className="w-full h-full" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 font-bold text-sm">T</div>
                      <h4 className="text-base font-bold text-[#322851]">External Factors (Threats)</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {swotData.threats.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-[#513c66] leading-relaxed">
                          <span className="text-amber-500 font-bold font-mono">✦</span>
                          <span className="font-light">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </motion.div>
            )}

            {activeTab === 'docs' && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <span className="text-[#8161e1] font-bold text-xs uppercase tracking-[0.3em] bg-[#8161e1]/8 border border-[#8161e1]/18 px-4.5 py-1.5 rounded-full inline-block">Architecture Manual</span>
                  <h2 className="text-3xl font-serif italic text-[#322851]">Platform Documentation & Modules</h2>
                  <p className="text-[#6e5380] text-xs md:text-sm font-light leading-relaxed">
                    Technical reference guide explaining the algorithms and UI interfaces built into Cognitive Twin.
                  </p>
                </div>

                {/* Grid layout for Documentation Sections */}
                <div className="bg-white/80 border border-purple-100/75 p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-[#8161e1]/5 space-y-8">
                  
                  {/* Documentation Section 1 */}
                  <div className="space-y-3 pb-6 border-b border-purple-50">
                    <div className="flex items-center gap-2.5 text-[#8161e1]">
                      <FileText className="w-4 h-4 shrink-0" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">Chapter 1: Dynamic Question Pools & Low-Latency Engines</h4>
                    </div>
                    <p className="text-xs text-[#513c66] font-light leading-relaxed">
                      Cognitive Twin employs a smart query handler to fetch evaluation points. In compliance with high usability benchmarks, when an internet or model timeout occurs (exceeding 1.6 seconds), the app immediately falls back to a locally cached pre-shuffled pool of standard assessments to prevent any screen freeze or testing roadblocks.
                    </p>
                  </div>

                  {/* Documentation Section 2 */}
                  <div className="space-y-3 pb-6 border-b border-purple-50">
                    <div className="flex items-center gap-2.5 text-[#8161e1]">
                      <BrainCircuit className="w-4 h-4 shrink-0" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">Chapter 2: Let's De-serialize Vector Profiles</h4>
                    </div>
                    <p className="text-xs text-[#513c66] font-light leading-relaxed">
                      Your scores across all 12 core tests represent your cognitive fingerprint. This vector represents the weights of logical parsing, emotional quotient, active resilience, auditory sequence indexing, and abstract geometry. This vector acts as the main index that the system uses to search for compatible coordinates (career fits, brain maps).
                    </p>
                  </div>

                  {/* Documentation Section 3 */}
                  <div className="space-y-3 pb-6 border-b border-purple-50">
                    <div className="flex items-center gap-2.5 text-[#8161e1]">
                      <Cpu className="w-4 h-4 shrink-0" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">Chapter 3: Chronotypes, Forecasts, and Sensory Sanctuary</h4>
                    </div>
                    <p className="text-xs text-[#513c66] font-light leading-relaxed">
                      - **Neural Chronotype**: Charts circadian energy levels, graphing critical times of peak synthesis, social focus, and metabolic rest.
                      - **Resilience Forecasting**: Evaluates real-time resilience profiles under cognitive stress to recommend optimal pauses and dynamic breaks.
                      - **Sensory Sanctuary**: An ambient visual playground mapping geometric waveforms to soothing frequencies, facilitating cognitive reset sessions.
                    </p>
                  </div>

                  {/* Documentation Section 4 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-[#8161e1]">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">Chapter 4: Privacy & Non-Custodial Storage</h4>
                    </div>
                    <p className="text-xs text-[#513c66] font-light leading-relaxed">
                      Every data point from your psychometrics, tests, and active logs remains saved purely in the local client's browser sandbox environment (`localStorage`) to keep your mind profile completely private, non-custodial, and user-commanded.
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
