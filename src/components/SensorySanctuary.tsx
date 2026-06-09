import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Volume2, VolumeX, Maximize2, Minimize2, CloudMoon, SunMedium, Brain} from 'lucide-react';
import { cn } from '../lib/utils';

export const SensorySanctuary = ({ isOpen, onClose, focusScore }: { isOpen: boolean, onClose: () => void, focusScore: number }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState<'alpha' | 'beta' | 'theta'>('alpha');

  const modeColors = {
    alpha: 'from-accent-blue/40 to-accent-purple/40', // Deep work
    beta: 'from-primary/40 to-accent-blue/40',      // High focus
    theta: 'from-accent-purple/40 to-pink-500/40'   // Creative flow
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-main flex flex-col overflow-hidden"
    >
      {/* Background Ambience */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-all duration-[3000ms]",
        modeColors[mode]
      )} />
      
      <div className="absolute inset-0 backdrop-blur-[120px]" />

      {/* Dynamic Neural Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              scale: 0.8 + Math.random() * 1,
              opacity: 0.05
            }}
            animate={{ 
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0.05, 0.2, 0.05]
            }}
            transition={{ 
              duration: 20 + i * 5, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-48 h-48 rounded-full bg-white/10 blur-[80px]"
          />
        ))}
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between p-12 md:p-24">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
             </div>
             <div>
               <p className="micro-label font-bold text-primary">Sensory Sanctuary</p>
               <p className="text-[8px] text-muted uppercase tracking-[0.3em]">Protocol Active • Focus Stability {focusScore}%</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-all rounded-full"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>

        <div className="max-w-xl text-center space-y-12">
           <motion.div
             animate={{ 
               scale: [1, 1.05, 1],
               opacity: [0.8, 1, 0.8]
             }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
             className="relative"
           >
              <Brain className="w-32 h-32 text-primary/20 absolute inset-0 m-auto blur-xl" />
              <h2 className="text-6xl md:text-8xl font-serif italic text-primary tracking-tighter mix-blend-difference">
                {mode === 'alpha' ? "Flow State" : mode === 'beta' ? "Cognitive Peak" : "Creative Bloom"}
              </h2>
           </motion.div>
           <p className="text-secondary micro-label max-w-sm mx-auto uppercase tracking-[0.5em] opacity-40">
              Realigning your Cognitive Twin with core neural rhythms.
           </p>
        </div>

        <div className="flex flex-col items-center gap-12">
          <div className="flex gap-4 p-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
            {(['alpha', 'beta', 'theta'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "px-6 py-2 rounded-full micro-label transition-all",
                  mode === m ? "bg-primary text-main shadow-lg" : "text-muted hover:text-primary"
                )}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-8">
            <button onClick={() => setIsMuted(!isMuted)} className="p-4 hover:bg-white/5 transition-all rounded-xl text-muted hover:text-primary">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button className="p-4 hover:bg-white/5 transition-all rounded-xl text-muted hover:text-primary">
               {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
         <div className="h-12 w-px bg-gradient-to-b from-primary to-transparent" />
         <span className="text-[6px] uppercase tracking-[1em] text-primary">Inertia Lockdown</span>
      </div>
    </motion.div>
  );
};
