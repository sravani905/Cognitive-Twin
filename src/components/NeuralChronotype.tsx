import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Sun, Moon, Zap, Brain, Sparkles, RefreshCw, Coffee, CloudMoon, SunMedium, Compass } from 'lucide-react';
import { TechnicalCard } from './GlassCard';
import { generateCircadianSchedule } from '../services/geminiService';
import { cn } from '../lib/utils';

export const NeuralChronotype = ({ profile }: { profile: any }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const result = await generateCircadianSchedule(profile);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) fetchSchedule();
  }, [profile?.timestamp]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-40">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p className="micro-label">Calibrating Circadian Oscillations...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Chronotype Profile */}
        <div className="lg:col-span-4 space-y-8">
          <TechnicalCard className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border-white/10 p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
               <Compass className="w-8 h-8 text-accent-blue" />
            </div>
            <div className="space-y-2">
              <span className="micro-label text-accent-blue">Neuro-Chronotype Detected</span>
              <h3 className="text-3xl font-serif italic text-primary">{data.chronotype?.title}</h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-light italic">
               {data.chronotype?.description}
            </p>
            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
               <span className="text-[10px] uppercase font-bold text-muted">Primary Energy Peak</span>
               <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">{data.chronotype?.energyPeakTime}</span>
            </div>
          </TechnicalCard>

          <div className="p-6 border border-accent-purple/20 bg-accent-purple/[0.02] rounded-2xl space-y-4">
             <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent-purple" />
                <h4 className="micro-label text-accent-purple">Biology Hack</h4>
             </div>
             <p className="text-[10px] md:text-xs text-secondary leading-relaxed">
               {data.biologyHack}
             </p>
          </div>
        </div>

        {/* 24-Hour Neural Schedule */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between">
              <h4 className="micro-label uppercase tracking-widest opacity-40">Neural High-Performance Day-Plan</h4>
              <div className="flex gap-4">
                 {['Focus', 'Reset', 'Creative'].map(phase => (
                   <div key={phase} className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        phase === 'Focus' ? 'bg-accent-blue' : phase === 'Reset' ? 'bg-muted' : 'bg-accent-purple'
                      )} />
                      <span className="text-[8px] uppercase tracking-tighter text-muted">{phase}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {data.schedule.map((item: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-6 group"
                >
                  <div className="w-20 shrink-0 text-right space-y-1">
                    <span className="text-[10px] font-mono text-primary font-bold">{item.time}</span>
                    <div className="h-px w-full bg-white/5" />
                  </div>
                  
                  <div className="flex-1 pb-8 relative">
                    <div className="absolute left-[-29px] top-1.5 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-all z-10" />
                    <div className="absolute left-[-26px] top-2.5 bottom-0 w-[1px] bg-white/5" />
                    
                    <div className={cn(
                      "p-5 rounded-2xl border transition-all",
                      item.neuralPhase === 'Focus' ? 'bg-accent-blue/[0.03] border-accent-blue/10 hover:border-accent-blue/30' :
                      item.neuralPhase === 'Creative' ? 'bg-accent-purple/[0.03] border-accent-purple/10 hover:border-accent-purple/30' :
                      'bg-white/[0.01] border-white/5 hover:border-white/20'
                    )}>
                       <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm font-bold text-primary">{item.activity}</h5>
                          <span className={cn(
                            "text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded",
                            item.neuralPhase === 'Focus' ? 'bg-accent-blue/20 text-accent-blue' :
                            item.neuralPhase === 'Creative' ? 'bg-accent-purple/20 text-accent-purple' :
                            'bg-white/10 text-muted'
                          )}>
                            {item.neuralPhase}
                          </span>
                       </div>
                       <p className="text-xs text-secondary italic opacity-60">
                         {item.recommendation}
                       </p>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
