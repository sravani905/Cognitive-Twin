import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, X, HelpCircle, Eye, Compass, Music, ShieldCheck, Cpu } from 'lucide-react';

interface TooltipStep {
  targetId: string;
  title: string;
  description: string;
  icon: React.ElementType;
  position: 'bottom' | 'top' | 'left' | 'right' | 'center';
  forcedTab?: string;
}

const ONBOARDING_STEPS: TooltipStep[] = [
  {
    targetId: 'ob-welcome',
    title: 'Welcome to your Cognitive Twin! 🧠',
    description: 'Let us take a 1-minute visual walkthrough of your new live workspace. This will highlight how we represent your metrics, soundscapes, and analytics.',
    icon: Sparkles,
    position: 'center'
  },
  {
    targetId: 'ob-top-ribbon',
    title: 'Workspace Control Ribbon 🛰️',
    description: 'Access global options here: toggle full diagnostic reports, modify API endpoints, read about protocol theories, or start a completely fresh custom assessment.',
    icon: Cpu,
    position: 'bottom'
  },
  {
    targetId: 'ob-nav-console',
    title: 'Intelligence Console Navigation 🗺️',
    description: 'Switch between the core dashboard, customized cognitive radar graphs, career fit listings, multi-year history progress charts, and smart lifestyle synchronization.',
    icon: Compass,
    position: 'right'
  },
  {
    targetId: 'ob-focus-mode',
    title: 'Focus Frequency Oscillator 🔊',
    description: 'Unleash your cognitive power. Play the therapeutic structural ambient rain track to stabilize executive focus while matching career pathways.',
    icon: Music,
    position: 'right'
  },
  {
    targetId: 'ob-save-state',
    title: 'Temporal State Verification ⏳',
    description: 'Tracks your current session stability, security signatures, and active fatigue indexes to warn you if you need to pause or retake certain games.',
    icon: ShieldCheck,
    position: 'left'
  },
  {
    targetId: 'ob-main-workspace',
    title: 'Intelligence Metrics Space 🔬',
    description: 'This is the main bento sandbox window. It dynamically visualizes your current cognitive levels, career matches, and continuous personal growth checklists.',
    icon: Eye,
    position: 'top',
    forcedTab: 'home'
  }
];

// Interactive Visual Aid Components matching the state walkthrough step index
function WalkthroughVisualAid({ stepIndex }: { stepIndex: number }) {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [isPlayingFocus, setIsPlayingFocus] = useState(true);

  // Auto-cycle mock navigation items for Step 2
  useEffect(() => {
    if (stepIndex !== 2) return;
    const interval = setInterval(() => {
      setActiveSubTab((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, [stepIndex]);

  switch (stepIndex) {
    case 0: // Welcome Neural Mesh Visual
      return (
        <div className="w-full h-32 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-800/80 my-3">
          {/* Animated glow background grids */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,76,225,0.15)_0%,transparent_70%)]" />
          <svg className="w-full h-full absolute inset-0 opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>

          {/* Connected brain nodes */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border border-dashed border-accent-purple/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 border border-dotted border-accent-blue/30 rounded-full"
            />
            
            {/* Pulsing Central Brain */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-12 h-12 bg-gradient-to-tr from-accent-purple to-accent-blue rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(138, 43, 226,0.6)]"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>

            {/* Orbiting Satellite Nodes */}
            {[0, 120, 240].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * 36;
              const y = Math.sin(rad) * 36;
              return (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [x, Math.cos(rad + 0.5) * 40, x],
                    y: [y, Math.sin(rad + 0.5) * 40, y],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute w-2.5 h-2.5 rounded-full bg-accent-purple shadow-glow"
                  style={{ top: '45%', left: '45%', transform: `translate(${x}px, ${y}px)` }}
                />
              );
            })}
          </div>
          
          <div className="absolute bottom-2 inset-x-0 text-center">
            <span className="text-[9px] font-mono tracking-widest text-[#8A2BE2] uppercase animate-pulse">Neural Synchronization Active</span>
          </div>
        </div>
      );

    case 1: // Workspace Control Ribbon Highlights
      return (
        <div className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800/80 my-3 space-y-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] font-mono text-slate-400">Mock Controls</span>
            <span className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-purple-950/20 border border-accent-purple/30 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
              <span className="text-[9px] font-mono text-indigo-200">Generate Report</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-2 select-none opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span className="text-[9px] font-mono text-slate-300">Set API Token</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-2 select-none opacity-80 col-span-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
              <span className="text-[9px] font-mono text-slate-300">Switch Focus: Rain / Deep / Ambient</span>
            </div>
          </div>
          <p className="text-[9px] text-[#4ea0ff] text-center font-mono mt-1">💡 Interactive Tour Tip: Try hitting "Switch Theme" in settings later!</p>
        </div>
      );

    case 2: // Navigation Console Auto-cycling mock
      const tabs = [
        { name: 'Core Dashboard', icon: '⚡' },
        { name: 'Radar Graphing', icon: '📊' },
        { name: 'Careers Matcher', icon: '💼' },
        { name: 'Historical Progress', icon: '📈' }
      ];
      return (
        <div className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 my-3">
          <div className="space-y-1">
            {tabs.map((tab, idx) => (
              <div 
                key={idx}
                className={`p-1.5 rounded-lg flex items-center justify-between transition-all ${
                  idx === activeSubTab 
                    ? 'bg-accent-purple/20 border border-accent-purple/30 text-white pl-3.5' 
                    : 'bg-transparent border border-transparent text-slate-400 opacity-60'
                }`}
              >
                <span className="text-[10px] font-mono flex items-center gap-2">
                  <span>{tab.icon}</span>
                  {tab.name}
                </span>
                {idx === activeSubTab && (
                  <motion.span 
                    layoutId="active-indicator" 
                    className="w-1.5 h-1.5 rounded-full bg-accent-purple"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 3: // Audio Frequency Waveform Visualizer
      return (
        <div className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800/80 my-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlayingFocus(!isPlayingFocus)}
                className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors pointer-events-auto cursor-pointer"
              >
                {isPlayingFocus ? '⏸' : '▶'}
              </button>
              <div className="flex flex-col">
                <span className="text-[10px] font-sans font-bold text-white">Focus track: Ambient Rain</span>
                <span className="text-[8px] font-mono text-[#8A2BE2]">Alpha Waves (12Hz) Enabled</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-400">OSC-1</span>
          </div>

          {/* Graphical moving spectrum wave bars */}
          <div className="h-10 flex items-end justify-between gap-[2px] px-1 bg-black/40 rounded-lg py-1.5">
            {Array.from({ length: 24 }).map((_, i) => {
              // Custom pseudo-random multipliers
              const mult = Math.sin((i / 24) * Math.PI) * 0.8 + 0.2;
              return (
                <motion.div
                  key={i}
                  animate={isPlayingFocus ? { 
                    height: [`${10 * mult}px`, `${32 * mult}px`, `${5 * mult}px`, `${10 * mult}px`]
                  } : { height: '4px' }}
                  transition={{ 
                    duration: 1.2 + (i % 3) * 0.2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-full bg-gradient-to-t from-accent-purple via-[#9c84e9] to-accent-blue rounded"
                />
              );
            })}
          </div>
        </div>
      );

    case 4: // Temporal State Verification
      return (
        <div className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800/80 my-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-400">Verifying security signatures</span>
            <span className="text-[9px] text-[#4ea0ff] font-mono">100% SECURE</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400">Internal Storage State:</span>
              <span className="font-mono text-accent-emerald flex items-center gap-1">✔ LocalStorage OK</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400">Fatigue Rating:</span>
              <span className="font-mono text-yellow-400">MINIMAL</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
              <motion.div 
                animate={{ width: ['30%', '85%', '20%', '60%'] }} 
                transition={{ duration: 10, repeat: Infinity }}
                className="bg-accent-purple h-full shadow-[0_0_5px_rgba(138, 43, 226,1)]" 
              />
            </div>
          </div>
        </div>
      );

    case 5: // Bento Mini-Workspace
      return (
        <div className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800/80 my-3">
          <span className="text-[9px] font-mono text-[#8A2BE2] block mb-2 uppercase">Interactive Bento Preview</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5 space-y-1">
              <span className="text-[8px] text-slate-400 font-mono">Cognitive Scores</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-accent-blue">94%</span>
                <span className="text-[7px] text-accent-emerald font-mono">⚡ +2.4%</span>
              </div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5 space-y-1">
              <span className="text-[8px] text-slate-400 font-mono">Growth Tasks</span>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-300">2 / 5 done</span>
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[7px] text-slate-400">✓</div>
              </div>
            </div>
            <div className="col-span-2 bg-slate-900/80 p-2 rounded-xl border border-white/5 flex items-center justify-between text-[9px]">
              <span className="text-slate-300">Career Fit:</span>
              <span className="font-bold text-accent-purple">Data Analyst (92%)</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

interface OnboardingWalkthroughProps {
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
  activeTab?: string;
}

export function DashboardOnboardingWalkthrough({ onClose, onNavigateTab, activeTab }: OnboardingWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const stepData = ONBOARDING_STEPS[currentStep];
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger tab synchronization if necessary to reveal hidden features during onboarding
  useEffect(() => {
    if (stepData && stepData.forcedTab && onNavigateTab && activeTab !== stepData.forcedTab) {
      onNavigateTab(stepData.forcedTab);
    }
  }, [currentStep, stepData, onNavigateTab, activeTab]);

  // Measure target DOM element precisely
  const measureTarget = () => {
    if (!stepData || stepData.targetId === 'ob-welcome' || stepData.position === 'center') {
      setCoords(null);
      return;
    }

    // Small delay to allow tab transitions to complete and render targets
    setTimeout(() => {
      const element = document.getElementById(stepData.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Include scroll position offsets for accuracy across responsiveness
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        
        // Scroll target into view if outside viewport nicely
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      } else {
        setCoords(null);
      }
    }, 120);
  };

  useEffect(() => {
    measureTarget();

    const handleResizeOrScroll = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(measureTarget, 150);
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, [currentStep, activeTab]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      localStorage.setItem('onboarding_completed', 'true');
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  // Determine where to position the floating description tooltip relative tocoords
  const getTooltipStyle = () => {
    if (!coords) {
      // Centered fallback screen layout
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        width: 'min(410px, 92vw)',
      };
    }

    const spacing = 18;
    const tooltipWidth = 350;

    // Default parameters (centered below)
    let top = coords.top + coords.height + spacing;
    let left = coords.left + (coords.width - tooltipWidth) / 2;

    if (stepData.position === 'top') {
      top = coords.top - spacing - 280; // offset calculation for general element heights
      left = coords.left + (coords.width - tooltipWidth) / 2;
    } else if (stepData.position === 'left') {
      top = coords.top + (coords.height / 2) - 130;
      left = coords.left - tooltipWidth - spacing;
    } else if (stepData.position === 'right') {
      top = coords.top + (coords.height / 2) - 130;
      left = coords.left + coords.width + spacing;
    }

    // Keep within safe horizontal bounds of the screen
    const maxLeft = window.innerWidth - tooltipWidth - 20;
    left = Math.max(20, Math.min(left, maxLeft));

    // Keep within safe vertical heights
    const maxTop = window.innerHeight + window.scrollY - 480;
    top = Math.max(10, Math.min(top, maxTop));

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: 'absolute' as const,
      width: `${tooltipWidth}px`,
    };
  };

  const tooltipPositionStyle = getTooltipStyle();
  const IconComponent = stepData?.icon || HelpCircle;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none font-sans">
      {/* Semi-transparent Backdrop with cut-out mask block */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#060413]/70 backdrop-blur-[3px] pointer-events-auto"
        onClick={handleSkip}
      />

      {/* Dynamic Glow Highlight Box Frame */}
      <AnimatePresence>
        {coords && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: coords.left - 8,
              y: coords.top - 8,
              width: coords.width + 16,
              height: coords.height + 16,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="absolute rounded-[24px] border-2 border-accent-purple bg-accent-purple/5 shadow-[0_0_35px_rgba(138, 43, 226,0.75)] pointer-events-none z-[1000]"
          >
            {/* Top ripple visual pulse effects */}
            <span className="absolute -inset-1 rounded-[26px] border border-accent-purple/50 animate-ping opacity-30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Description Guide Tooltip */}
      <div 
        className="pointer-events-auto z-[1001]"
        style={tooltipPositionStyle}
      >
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95, y: coords ? 0 : 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white/95 rounded-3xl border border-purple-100 shadow-[0_20px_60px_rgba(15,12,38,0.45)] p-5 md:p-6 relative overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle upper background gradient arc */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent-purple via-accent-violet to-accent-blue" />
          
          <button 
            onClick={handleSkip}
            className="absolute top-4 right-4 text-muted hover:text-primary transition-colors hover:bg-slate-50 p-1.5 rounded-full"
            title="Skip Walkthrough"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon and title header */}
          <div className="flex items-center gap-3 mb-3 mt-1">
            <div className="w-9 h-9 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center font-bold font-mono">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-mono font-bold text-accent-purple tracking-widest uppercase">
                Interactive Walkthrough Step {currentStep + 1} / {ONBOARDING_STEPS.length}
              </p>
              <h4 className="text-xs font-bold text-[#1e1a42] tracking-tight uppercase leading-none font-sans mt-0.5">
                {stepData.title}
              </h4>
            </div>
          </div>

          {/* Description body */}
          <p className="text-[11px] text-slate-600 leading-relaxed font-sans pr-1">
            {stepData.description}
          </p>

          {/* High-fidelity Visual Aid Indicator */}
          <WalkthroughVisualAid stepIndex={currentStep} />

          {/* Progress dots bar */}
          <div className="flex items-center gap-1.5 my-3 justify-center">
            {ONBOARDING_STEPS.map((_, idx) => (
              <span 
                key={idx}
                className={`h-1.5 transition-all rounded-full ${
                  idx === currentStep ? 'w-5 bg-accent-purple' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-purple-50 flex-wrap gap-2">
            <button 
              onClick={handleSkip}
              className="text-[10px] uppercase tracking-widest font-extrabold text-[#7c779e] hover:text-red-500 transition-colors cursor-pointer"
            >
              Skip
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button 
                  onClick={handleBack}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border border-purple-100 text-[#4a456e] bg-slate-50/50 hover:bg-slate-100/80 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              
              <button 
                onClick={handleNext}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-accent-purple text-white hover:brightness-105 hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? "Finish" : "Next"}{" "}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
