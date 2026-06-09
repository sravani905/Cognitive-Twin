import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Calendar, Book, Layers, MousePointer2, ChevronRight, Loader2, CheckCircle2, ListFilter, Target, Brain, Clock, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { generateStudyPlan } from '../services/geminiService';

export interface StudyPlan {
  title: string;
  subject: string;
  overview: string;
  schedule: {
    day: string;
    theme: string;
    tasks: {
      task: string;
      duration: string;
      technique: string;
      focus: string;
    }[];
  }[];
  recommendations: string[];
}

export const StudyPlanGenerator = ({ profile }: { profile: any }) => {
  const { metrics } = profile;
  const [subject, setSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  const handleGenerate = async () => {
    if (!subject) return;
    setIsGenerating(true);
    try {
      const newPlan = await generateStudyPlan(profile, subject);
      setPlan(newPlan);
      setActiveDay(0);
    } catch (error) {
      console.error("Failed to generate plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-accent-blue/10 border border-accent-blue/20">
          <GraduationCap className="w-5 h-5 text-accent-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-medium tracking-tight">AI Study Architect</h2>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Cognitive-Optimized Planning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-surface/50 border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Learning Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Target Subject/Skill</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. React & TypeScript..."
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm focus:border-accent-blue outline-none transition-colors"
                />
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Style</span>
                  <span className="text-xs text-primary">{metrics.learningStyle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Logic Edge</span>
                  <span className="text-xs text-accent-blue font-mono">{metrics.logicScore}%</span>
                </div>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !subject}
                className="w-full py-4 bg-accent-blue text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? "Architecting..." : "Generate Neural Plan"}
              </button>
            </div>
          </div>

          {plan && (
            <div className="p-6 rounded-[2rem] bg-accent-blue/5 border border-accent-blue/10 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-blue">Timeline Navigation</h4>
              <div className="flex flex-col gap-2">
                {plan.schedule.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDay(idx)}
                    className={cn(
                      "text-left p-3 rounded-xl text-xs transition-all border",
                      activeDay === idx 
                        ? "bg-accent-blue text-white border-accent-blue" 
                        : "bg-surface text-slate-400 border-white/5 hover:border-white/10"
                    )}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {plan ? (
              <motion.div 
                key={activeDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif italic text-primary">{plan.schedule[activeDay].day}</h3>
                      <p className="text-xs text-accent-blue font-mono uppercase tracking-widest mt-1">
                        {plan.schedule[activeDay].theme}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <Target className="w-5 h-5 text-accent-blue" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                    {activeDay === 0 ? "Initial dopamine reset phase focused on core architecture and mental indexing." : "Intensive synthesis phase combining active retrieval with technical application."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.schedule[activeDay].tasks.map((task, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-accent-blue/10">
                          <Clock className="w-3 h-3 text-accent-blue" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{task.duration}</span>
                      </div>
                      <h4 className="text-sm font-medium text-primary">{task.task}</h4>
                      <div className="space-y-1">
                        <p className="text-[10px] text-accent-blue font-bold tracking-widest uppercase">{task.focus}</p>
                        <p className="text-[10px] text-slate-500 font-mono italic">via {task.technique}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Neural Efficiency Optimization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(plan.recommendations || []).map((rec, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-2xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed font-mono text-[10px] uppercase tracking-tighter">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[400px] border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="p-5 rounded-full bg-white/5">
                  <Brain className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-lg font-medium text-slate-500">Awaiting Neural Link</h3>
                <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                  Enter a subject and initiate generation to architect a study plan optimized for your cognitive profile.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
