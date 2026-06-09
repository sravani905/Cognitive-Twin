import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, BrainCircuit, Heart, Sparkles, RefreshCw, Volume2, VolumeX, X, HelpCircle, Compass
} from 'lucide-react';
import { cn } from '../lib/utils';

interface QuickActionsFloatingMenuProps {
  onStartAssessment: () => void;
  onNavigateTab: (tab: 'home' | 'profile' | 'careers' | 'archetype' | 'growth' | 'progress' | 'sessions' | 'recommendations' | 'hub') => void;
  onStartFresh: () => void;
  sidebarAudioActive: boolean;
  onToggleSidebarAudio: () => void;
}

export const QuickActionsFloatingMenu: React.FC<QuickActionsFloatingMenuProps> = ({
  onStartAssessment,
  onNavigateTab,
  onStartFresh,
  sidebarAudioActive,
  onToggleSidebarAudio
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 'assessment',
      title: 'Start Assessment',
      desc: 'Retake cognitive profiling rules',
      icon: BrainCircuit,
      color: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
      glow: 'shadow-accent-purple/10',
      onClick: () => {
        onStartAssessment();
        setIsOpen(false);
      }
    },
    {
      id: 'focus_audio',
      title: sidebarAudioActive ? 'Deactivate Focus Rain' : 'Log Focus: Binaural Rain',
      desc: sidebarAudioActive ? 'Rain sound is running' : 'Activate alpha binaural waves',
      icon: sidebarAudioActive ? VolumeX : Volume2,
      color: sidebarAudioActive ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      glow: sidebarAudioActive ? 'shadow-amber-500/10' : 'shadow-indigo-500/10',
      onClick: () => {
        onToggleSidebarAudio();
        // and navigate to session logs so user can log/see tracking status
        onNavigateTab('sessions');
        setIsOpen(false);
      }
    },
    {
      id: 'recommendations',
      title: 'Explore Recommendations',
      desc: 'Adaptive pathways tailored for you',
      icon: Heart,
      color: 'bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/20',
      glow: 'shadow-pink-500/10',
      onClick: () => {
        onNavigateTab('recommendations');
        setIsOpen(false);
      }
    },
    {
      id: 'growth_map',
      title: 'Visualize Growth Map',
      desc: 'Check coordinate cluster deviations',
      icon: Sparkles,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
      onClick: () => {
        onNavigateTab('growth');
        setIsOpen(false);
      }
    },
    {
      id: 'reset',
      title: 'Reset Active Lab Session',
      desc: 'Clear and start onboarding fresh',
      icon: RefreshCw,
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      glow: 'shadow-rose-500/10',
      onClick: () => {
        onStartFresh();
        setIsOpen(false);
      }
    }
  ];

  return (
    <div id="quick-actions-floating-group" className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[80] flex flex-col items-start gap-3">
      
      {/* Action panel popup floating menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15, x: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15, x: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            className="w-80 md:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-black/5 dark:border-white/10 space-y-4"
          >
            {/* Header section with closing element */}
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 rounded-full bg-[#8161e1]/10 text-accent-purple text-[8px] font-mono font-bold uppercase tracking-wider">
                  Operational
                </div>
                <span className="text-xs font-serif font-bold text-primary dark:text-white">Quick Lab Actions</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted hover:text-primary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of shortcuts */}
            <div className="space-y-2.5">
              {actions.map((act, index) => {
                const Icon = act.icon;
                return (
                  <motion.button
                    key={act.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={act.onClick}
                    className="w-full text-left p-3 rounded-2xl border border-transparent hover:border-black/5 dark:hover:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] flex items-center gap-3.5 transition-all duration-200 group relative overflow-hidden"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-all duration-300 group-hover:scale-105", 
                      act.color,
                      act.glow
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#8161e1] transition-colors font-mono">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-muted truncate">
                        {act.desc}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Hint label */}
            <div className="text-[9px] text-[#7c7790] dark:text-slate-400 font-medium text-center flex items-center justify-center gap-1.5 pt-1.5 border-t border-black/5 dark:border-white/5 select-none uppercase tracking-wider">
              <Zap className="w-3 h-3 text-[#8161e1] animate-bounce" />
              <span>Configure pathways in high-frequency space</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Speed-Dial Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg shadow-accent-purple/20 relative border border-white/50",
          isOpen 
            ? "bg-[#1d163a] text-white rotate-90" 
            : "bg-gradient-to-r from-accent-purple to-accent-violet text-white hover:brightness-110"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="open-icon" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
          ) : (
            <motion.div key="closed-icon" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Zap className="w-5 h-5 md:w-6 md:h-6 fill-white/10" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Dynamic little beacon trigger badge if inactive */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
          </span>
        )}
      </motion.button>

    </div>
  );
};
