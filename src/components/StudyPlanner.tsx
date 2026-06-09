import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Rocket, BookOpen, Clock, Target, Sparkles, ChevronRight, RefreshCw, Layers } from 'lucide-react';
import { TechnicalCard } from './GlassCard';
import { generateStudyPlan, DEFAULT_STUDY_PLAN } from '../services/geminiService';
import { cn } from '../lib/utils';
import { SensorySanctuary } from './SensorySanctuary';

export const StudyPlanner = ({ profile }: { profile: any }) => {
  const [goals, setGoals] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showSanctuary, setShowSanctuary] = useState(false);

  const handleGenerate = async () => {
    if (!goals.trim()) return;
    setIsGenerating(true);
    try {
      // Pass skillLevel and profile context to the generation service
      const result = await generateStudyPlan(profile, goals);
      setPlan(result || DEFAULT_STUDY_PLAN);
    } catch (error) {
      console.error(error);
      setPlan(DEFAULT_STUDY_PLAN);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPlan = plan || DEFAULT_STUDY_PLAN;
  const currentDay = currentPlan.schedule[selectedDay] || currentPlan.schedule[0];

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="bg-surface/30 p-6 md:p-12 rounded-[2rem] border border-white/5 backdrop-blur-xl space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center border border-accent-blue/20 shrink-0">
              <Rocket className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Growth Architect</h2>
                {plan?.isStandard && (
                  <span className="px-2 py-0.5 bg-accent-blue/10 border border-accent-blue/30 rounded text-[8px] font-bold text-accent-blue uppercase tracking-widest animate-pulse">
                    Standard Template Mode
                  </span>
                )}
              </div>
              <p className="text-[10px] md:text-xs text-muted uppercase tracking-widest mt-1">Distraction-Free Neural Protocol</p>
            </div>
          </div>

          <div className="flex bg-surface/50 p-1 rounded-xl border border-subtle">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSkillLevel(level)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  skillLevel === level 
                    ? "bg-accent-blue text-white shadow-lg" 
                    : "text-muted hover:text-primary"
                )}
              >
                {level}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowSanctuary(true)}
            className="px-6 py-3 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple rounded-xl text-[10px] uppercase font-bold tracking-widest flex items-center gap-3 hover:bg-accent-purple/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Enter Focus Sanctuary
          </button>
        </div>

        <div className="bg-accent-blue/5 border border-accent-blue/10 rounded-2xl p-6 mb-4">
          <div className="flex gap-4">
            <div className="mt-1">
              <Sparkles className="w-5 h-5 text-accent-blue" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-primary">Intelligent Adaptation</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Plan calibrated for <strong>{skillLevel}</strong> proficiency. 
                Integrating <strong>{profile.insights?.archetype?.title || 'Personalized'}</strong> cognitive anchors and 
                mitigating identified <strong>{profile.insights?.growthAreas?.[0]?.skill || 'efficiency'}</strong> gaps.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold block">Mission Parameters (Goal)</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g. Master React and TypeScript, Learn Italian Basics..."
              className="flex-1 bg-surface/50 border border-subtle rounded-2xl px-6 py-4 text-primary focus:outline-none focus:border-accent-blue/40 transition-all placeholder:text-muted/50"
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !goals.trim()}
              className="px-8 py-4 bg-accent-blue text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-accent-blue/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              )}
              {isGenerating ? "Synthesizing..." : "Architect Plan"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {(plan || isGenerating) ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-5 gap-2 md:gap-3 max-w-2xl">
              {currentPlan.schedule.map((day: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all",
                    selectedDay === i 
                      ? "bg-accent-blue border-accent-blue shadow-[0_0_20px_rgba(0,174,239,0.3)]" 
                      : "bg-surface/30 border-white/5 hover:border-white/20"
                  )}
                >
                  <span className={cn("text-[8px] md:text-[10px] font-bold uppercase tracking-widest", selectedDay === i ? "text-white" : "text-muted")}>
                    {day.day || `Day 0${i + 1}`}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-2">
                  <span className="micro-label text-accent-blue">Active Sequence</span>
                  <h3 className="text-2xl md:text-4xl font-serif italic text-primary tracking-tight">
                    {currentDay.theme}
                  </h3>
                </div>

                <div className="space-y-8">
                  {(currentDay.tasks || []).map((t: any, i: number) => (
                    <div key={i} className="group relative">
                      <div className="flex gap-6">
                        <div className="hidden md:flex flex-col items-center space-y-4">
                          <div className="w-10 h-10 border border-subtle flex items-center justify-center text-xs font-mono text-accent-blue">
                            0{i + 1}
                          </div>
                          {i !== currentDay.tasks.length - 1 && (
                            <div className="w-px flex-1 bg-subtle" />
                          )}
                        </div>
                        <div className="flex-1 space-y-6">
                          <TechnicalCard className="bg-surface/50 border-subtle p-6 md:p-10 space-y-8 hover:border-accent-blue/20 transition-all">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                              <div className="space-y-2">
                                <h4 className="text-xl md:text-2xl font-bold text-primary group-hover:text-accent-blue transition-colors leading-tight">
                                  {t.task}
                                </h4>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface rounded-md border border-subtle">
                                    <Target className="w-3 h-3 text-accent-blue" />
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Objective</span>
                                  </div>
                                  <p className="text-xs md:text-sm text-secondary font-medium">{t.goal}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-subtle rounded-xl shrink-0">
                                <Clock className="w-3 h-3 text-muted" />
                                <span className="text-xs font-mono text-primary">{t.timeRequired}</span>
                              </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-subtle/50">
                              <p className="text-xs md:text-sm text-secondary leading-relaxed italic border-l-2 border-accent-blue/30 pl-4 py-1">
                                {t.whyMatters}
                              </p>
                            </div>

                            <div className="pt-6 space-y-4">
                              <div className="flex items-center gap-3">
                                <BookOpen className="w-4 h-4 text-accent-purple" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted">Curated Learning Assets</span>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {(t.resources || []).map((res: string, ri: number) => (
                                  <a 
                                    key={ri}
                                    href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-surface border border-subtle rounded-xl hover:border-accent-blue/40 hover:bg-accent-blue/[0.02] transition-all group/res"
                                  >
                                    <span className="text-[10px] font-mono text-secondary group-hover/res:text-primary transition-colors">{res}</span>
                                    <ChevronRight className="w-3 h-3 text-muted group-hover/res:text-accent-blue transition-all" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          </TechnicalCard>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-surface/50 border border-subtle rounded-3xl p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-accent-blue" />
                      <h4 className="micro-label">Daily Focus Parameters</h4>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Cognitive Load', val: profile.metrics.focusScore > 70 ? 'Optimal' : profile.metrics.focusScore < 40 ? 'Fragmented' : 'Stable' },
                        { label: 'Attention Span', val: `${Math.round(profile.metrics.focusScore * 0.6)} mins` },
                        { label: 'Retention Model', val: profile.insights?.learningStyle || 'Visual' }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-3 border border-subtle/50 rounded-xl bg-surface/30">
                          <span className="text-[10px] uppercase font-medium text-muted">{item.label}</span>
                          <span className="text-[10px] font-mono text-primary font-bold">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-accent-purple/5 border border-accent-purple/20 rounded-2xl p-6 space-y-3">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-accent-purple">Optimization Tip</h5>
                    <p className="text-xs text-secondary leading-relaxed italic">
                      "Leverage your <strong>{profile.insights?.archetype?.strengths?.[0] || 'pattern matching'}</strong> to synthesize complex tasks into smaller logic blocks before execution."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : !isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-surface/50 border border-subtle flex items-center justify-center opacity-40">
              <Calendar className="w-10 h-10 text-muted" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-primary">Awaiting Mission Parameters</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Input your objective to architect a distraction-free, 5-day neural protocol calibrated to your cognitive vector.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SensorySanctuary 
        isOpen={showSanctuary} 
        onClose={() => setShowSanctuary(false)} 
        focusScore={profile.metrics.focusScore} 
      />
    </div>
  );
};
