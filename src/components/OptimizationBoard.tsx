import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Brain, Target, Shield, Sparkles, RefreshCw, ChevronRight, Activity, FlaskConical, Clock } from 'lucide-react';
import { TechnicalCard } from './GlassCard';
import { generateOptimizationProposals, DEFAULT_PROPOSALS } from '../services/geminiService';
import { cn } from '../lib/utils';
import { NeuralChronotype } from './NeuralChronotype';

export const OptimizationBoard = ({ profile }: { profile: any }) => {
  const [proposals, setProposals] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<'protocols' | 'circadian'>('protocols');

  // Use memoized profile key to prevent redundant fetch triggers
  const profileKey = useMemo(() => JSON.stringify({
    timestamp: profile?.timestamp,
    metrics: profile?.metrics,
    insights: profile?.insights
  }), [profile?.timestamp]);

  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const result = await generateOptimizationProposals(JSON.parse(profileKey));
        if (result) {
          setProposals(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [profileKey]);

  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <div className="flex p-1 bg-surface/30 border border-white/5 rounded-2xl backdrop-blur-xl">
           {[
             { id: 'protocols', label: 'Smart Habits', icon: Zap },
             { id: 'circadian', label: 'Energy Schedule', icon: Clock }
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setTab(t.id as any)}
               className={cn(
                 "px-6 py-3 rounded-xl flex items-center gap-3 micro-label transition-all",
                 tab === t.id ? "bg-primary text-main shadow-lg" : "text-muted hover:text-primary"
               )}
             >
               <t.icon className="w-4 h-4" />
               {t.label}
             </button>
           ))}
        </div>
      </div>

      {tab === 'protocols' ? (
        <div className="space-y-8 md:space-y-12">
          <div className="relative overflow-hidden p-6 md:p-12 bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 rounded-[2rem] border border-subtle">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-20">
              <FlaskConical className="w-20 h-20 md:w-32 md:h-32 text-primary" />
            </div>
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-purple/20 border border-accent-purple/30 rounded-full text-accent-purple">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Daily Mind Guide</span>
                </div>
                {proposals?.isStandard && (
                  <span className="px-2 py-0.5 bg-accent-purple/10 border border-accent-purple/30 rounded text-[8px] font-bold text-accent-purple uppercase tracking-widest animate-pulse">
                    Snapshot Profiles Active
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary tracking-tight">Personalized Mind Habits</h2>
              <p className="text-secondary text-xs md:text-sm leading-relaxed max-w-lg">
                Small, daily actions tailored to your personality to help you overcome mental blocks and reach your full potential.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <RefreshCw className="w-10 h-10 text-accent-purple animate-spin" />
              <p className="micro-label">Calibrating Twin Data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {(proposals?.proposals || DEFAULT_PROPOSALS.proposals).map((proposal: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <TechnicalCard className="h-full bg-surface/30 border-white/5 hover:border-accent-purple/40 transition-all p-6 md:p-10 flex flex-col justify-between group">
                      <div className="space-y-6 md:space-y-8">
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-purple/20 group-hover:border-accent-purple/30 transition-all">
                            <Activity className="w-5 h-5 md:w-6 md:h-6 text-accent-purple" />
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-muted mb-1">Target</p>
                            <span className="text-accent-blue font-mono text-[10px] md:text-xs">{proposal.metricImpact}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight">{proposal.target}</h3>
                          <div className="p-4 bg-surface/50 border-l-2 border-accent-purple/50 rounded-r-xl italic">
                            <p className="text-xs md:text-sm text-secondary leading-relaxed opacity-80">
                              Why this works: {proposal.science}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] uppercase tracking-widest text-muted font-bold">The Protocol</h4>
                          <div className="space-y-3">
                            {proposal.protocol.map((step: string, j: number) => (
                              <div key={j} className="flex items-start gap-4 group/step">
                                <div className="w-6 h-6 rounded-lg bg-surface border border-subtle flex items-center justify-center text-[10px] font-mono text-muted group-hover/step:border-accent-purple group-hover/step:text-primary transition-all shrink-0 mt-0.5">
                                  {j + 1}
                                </div>
                                <p className="text-sm text-secondary leading-relaxed pt-0.5">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 flex items-center gap-3">
                        <div className="h-1 flex-1 bg-surface border border-subtle rounded-full overflow-hidden">
                          <div className="h-full bg-accent-purple w-1/3 group-hover:w-full transition-all duration-1000" />
                        </div>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Protocol Active</span>
                      </div>
                    </TechnicalCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        <NeuralChronotype profile={profile} />
      )}
    </div>
  );
};
