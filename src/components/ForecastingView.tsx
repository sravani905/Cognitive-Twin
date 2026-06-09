import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Sparkles, Activity, Target, Shield, Clock, RefreshCw, Zap, Binary } from 'lucide-react';
import { TechnicalCard } from './GlassCard';
import { generateForecast } from '../services/geminiService';
import { cn } from '../lib/utils';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarArea, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';

export const ForecastingView = ({ profile }: { profile: any }) => {
  const [forecast, setForecast] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  const fetchForecast = async () => {
    setIsLoading(true);
    try {
      const result = await generateForecast(profile);
      setForecast(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) fetchForecast();
  }, [profile?.timestamp]);

  const radarData = forecast ? [
    { subject: 'Focus', current: profile.focusScore, projected: forecast.projectedMetrics.focus },
    { subject: 'Memory', current: profile.memoryScore, projected: forecast.projectedMetrics.memory },
    { subject: 'Logic', current: profile.logicScore, projected: forecast.projectedMetrics.logic },
    { subject: 'Speed', current: profile.speedScore, projected: forecast.projectedMetrics.speed },
    { subject: 'Creativity', current: profile.creativityScore, projected: forecast.projectedMetrics.creativity },
  ] : [];

  return (
    <div className="space-y-12 md:space-y-16">
      <div className="relative overflow-hidden p-8 md:p-16 bg-[#050505] border border-accent-blue/20 rounded-[3rem] shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Binary className="w-64 h-64 text-accent-blue" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-accent-blue">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Neural Forecasting Engine</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif italic text-primary tracking-tighter">Your Cognitive Future Self</h2>
              <p className="text-secondary micro-label max-w-xl leading-relaxed">
                Projecting 30 days of deliberate neuro-plasticity and systematic protocol adherence.
              </p>
            </div>
            <button 
              onClick={fetchForecast}
              disabled={isLoading}
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-3"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isLoading ? "Simulating Neurons..." : "Rerunning Simulation"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 pt-12">
            <div className="lg:col-span-12 h-[px] bg-white/5" />

            {/* Simulation Visualization */}
            <div className="lg:col-span-5 space-y-12">
              <div className="h-[400px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                    <RadarArea
                      name="Current Baseline"
                      dataKey="current"
                      stroke="#4F46E5"
                      fill="#4F46E5"
                      fillOpacity={0.3}
                    />
                    <RadarArea
                      name="30-Day Projection"
                      dataKey="projected"
                      stroke="#00AEEF"
                      fill="#00AEEF"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#4F46E5] rounded-full shadow-[0_0_5px_#4F46E5]" />
                  <span className="micro-label">Current Pulse</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00AEEF] rounded-full shadow-[0_0_5px_#00AEEF] animate-pulse" />
                  <span className="micro-label">Projected Potential</span>
                </div>
              </div>
            </div>

            {/* Narrative Analysis */}
            <div className="lg:col-span-7 space-y-12 border-l border-white/5 pl-0 lg:pl-16">
              {!isLoading && forecast ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-16"
                >
                  <div className="space-y-6">
                    <h4 className="micro-label text-accent-blue font-bold tracking-[0.3em] uppercase underline underline-offset-8">Evolutionary Narrative</h4>
                    <p className="text-xl md:text-2xl text-primary font-light italic leading-relaxed">
                      "{forecast.evolutionaryNarrative}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h4 className="micro-label uppercase tracking-widest text-muted">Simulation Stability</h4>
                      <div className="space-y-4">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${forecast.volatilityFactor}%` }}
                            className="h-full bg-accent-purple"
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-muted uppercase">
                          <span>Confidence Factor</span>
                          <span className="text-primary font-bold">{forecast.volatilityFactor}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="micro-label uppercase tracking-widest text-accent-blue">Breakthrough Vector</h4>
                      <div className="p-6 border border-accent-blue/20 bg-accent-blue/[0.02] rounded-2xl">
                         <p className="text-xs text-secondary leading-relaxed font-mono">
                           {forecast.breakthroughPotential}
                         </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-white/5 flex items-center gap-6">
                    <div className="w-12 h-12 border border-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary">Neural Path Identified</h5>
                      <p className="text-xs text-muted leading-relaxed">Stick to your "Neural Synergy Protocol" in the Study Planner to activate these gains.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-32 opacity-40">
                  <RefreshCw className="w-12 h-12 animate-spin text-muted" />
                  <p className="micro-label tracking-widest uppercase">Calculating Quantum Trajectory...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
