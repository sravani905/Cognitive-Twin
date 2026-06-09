import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Zap, Globe, ExternalLink, Check, Activity } from 'lucide-react';
import { TechnicalCard } from './GlassCard';
import { cn } from '../lib/utils';

import { DEFAULT_ROADMAP } from '../services/geminiService';

export const RoadmapDashboard = ({ 
  roadmap = DEFAULT_ROADMAP, 
  onBack, 
  onStartFresh,
  onNewAssessment,
  completedTasks,
  onToggleTask
}: { 
  roadmap: any, 
  onBack: () => void, 
  onStartFresh: () => void,
  onNewAssessment: () => void,
  completedTasks: string[],
  onToggleTask: (taskId: string) => void
}) => {
  const [activePhase, setActivePhase] = useState(0);

  const totalTasks = (roadmap.phases || []).reduce((acc: number, phase: any) => acc + (phase.milestones || []).length, 0);
  const overallProgress = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const getPhaseProgress = (phaseIndex: number) => {
    const phase = roadmap.phases[phaseIndex];
    if (!phase || !phase.milestones) return 0;
    const phaseTasks = phase.milestones;
    const completedInPhase = phaseTasks.filter((t: string) => completedTasks.includes(`${phaseIndex}-${t}`)).length;
    return (completedInPhase / phaseTasks.length) * 100;
  };

  const currentPhase = (roadmap?.phases || [])[activePhase];

  return (
    <div className="max-w-6xl mx-auto space-y-16 md:space-y-24 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-primary/5 pb-12 gap-8">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <p className="micro-label">Strategic Career Trajectory</p>
            {roadmap?.isStandard && (
              <span className="px-2 py-0.5 bg-accent-blue/10 border border-accent-blue/30 rounded text-[8px] font-bold text-accent-blue uppercase tracking-widest animate-pulse">
                Standard Template Mode
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif italic text-primary tracking-tighter">{roadmap.careerTitle}</h1>
          
          <div className="pt-8 space-y-3">
            <div className="flex justify-between items-end">
              <span className="micro-label text-accent-blue">Overall Mission Progress</span>
              <span className="text-lg md:text-xl font-mono text-primary">{Math.round(overallProgress)}%</span>
            </div>
            <div className="h-1 w-full bg-primary/5 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                className="absolute inset-y-0 left-0 bg-accent-blue shadow-[0_0_15px_rgba(0,174,239,0.5)]"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="btn-secondary"
          >
            Dashboard
          </button>
          <button 
            onClick={onNewAssessment}
            className="btn-primary"
          >
            New Assessment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Phases */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-4 mb-6 md:mb-12">
            <div className="w-10 h-10 border border-primary/10 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-muted" />
            </div>
            <h3 className="micro-label">Implementation Phases</h3>
          </div>
          
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-4 pb-4 lg:pb-0 no-scrollbar">
            {(roadmap?.phases || []).map((phase: any, i: number) => {
              const phaseProgress = getPhaseProgress(i);
              return (
                <button
                  key={i}
                  onClick={() => setActivePhase(i)}
                  className={cn(
                    "min-w-[200px] lg:min-w-0 text-left p-6 md:p-8 border transition-all duration-500 group relative shrink-0 lg:shrink",
                    activePhase === i 
                      ? "bg-primary/[0.03] border-primary/20" 
                      : "bg-transparent border-primary/5 hover:border-primary/10"
                  )}
                >
                  {activePhase === i && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 bottom-0 lg:bottom-auto lg:top-0 lg:w-1 lg:h-full h-1 w-full bg-primary"
                    />
                  )}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={cn(
                        "micro-label transition-colors",
                        activePhase === i ? "text-primary" : "text-muted"
                      )}>Phase 0{i + 1}</span>
                      {phaseProgress === 100 && <Check className="w-3 h-3 text-emerald-500" />}
                    </div>
                    <h4 className={cn(
                      "text-base md:text-lg font-serif italic transition-colors truncate lg:whitespace-normal",
                      activePhase === i ? "text-primary" : "text-secondary"
                    )}>{phase.title}</h4>
                    
                    <div className="h-0.5 w-full bg-primary/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${phaseProgress}%` }}
                        className="h-full bg-primary/40"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Phase Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 md:space-y-12"
            >
              <TechnicalCard className="p-6 md:p-12 space-y-10 md:space-y-12 technical-grid">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                       <h3 className="text-3xl md:text-4xl font-serif italic text-primary">{currentPhase?.title}</h3>
                       <p className="micro-label text-muted">Progress: {Math.round(getPhaseProgress(activePhase))}%</p>
                    </div>
                    <span className="micro-label text-emerald-500/60 hidden md:block">Active Phase Analysis</span>
                  </div>
                  <p className="text-base md:text-lg text-secondary font-light italic leading-relaxed">
                    {currentPhase?.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-8">
                    <h4 className="micro-label">Core Objectives</h4>
                    <div className="space-y-4">
                      {(currentPhase?.milestones || []).map((task: string, i: number) => {
                        const taskId = `${activePhase}-${task}`;
                        const isDone = completedTasks.includes(taskId);
                        return (
                          <div 
                            key={i} 
                            onClick={() => onToggleTask(taskId)}
                            className="flex items-start gap-4 group cursor-pointer"
                          >
                            <div className={cn(
                              "mt-1 w-5 h-5 border transition-all flex items-center justify-center",
                              isDone ? "bg-emerald-500 border-emerald-500" : "border-primary/10 group-hover:border-primary/30"
                            )}>
                              {isDone && <Check className="w-3 h-3 text-main" />}
                            </div>
                            <span className={cn(
                              "text-sm leading-relaxed transition-all",
                              isDone ? "text-muted line-through" : "text-secondary font-light"
                            )}>{task}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="micro-label">Recommended Resources</h4>
                    <div className="space-y-4">
                      {(currentPhase?.resources || []).map((res: string, i: number) => (
                        <a 
                          key={i}
                          href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 border border-primary/5 hover:bg-primary/5 transition-all group"
                        >
                          <span className="text-xs text-muted font-mono group-hover:text-primary transition-colors">{res}</span>
                          <ExternalLink className="w-3 h-3 text-muted group-hover:text-primary transition-all" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </TechnicalCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 border border-primary/5 bg-primary/[0.01] space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <h4 className="micro-label">Success Metrics</h4>
                  </div>
                  <p className="text-xs text-muted italic leading-relaxed">
                    Empirical indicators of successful phase completion and cognitive alignment.
                  </p>
                </div>
                <div className="p-8 border border-primary/5 bg-primary/[0.01] space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <h2 className="micro-label">Market Context</h2>
                  </div>
                  <p className="text-xs text-muted italic leading-relaxed">
                    Real-world application and demand for skills developed during this phase.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
