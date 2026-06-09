import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Target, Zap, Waves, BookOpen, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface EnhancementSuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  benefit: string;
  difficulty: 'Low' | 'Medium' | 'High';
  duration: string;
  steps: string[];
  metricTarget: string;
}

export const EnhancementModule = ({ metrics }: { metrics: any }) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const getSuggestions = (): EnhancementSuggestion[] => {
    const suggestions: EnhancementSuggestion[] = [];
    
    // Focus/Attention Suggestions
    if (metrics.focusScore < 70) {
      suggestions.push({
        id: 'pomodoro-deep',
        category: 'Focus',
        title: 'Neural Decompression Cycles',
        description: 'Implement structured deep-work sprints to rebuild attention span integrity.',
        benefit: 'Reduces context-switching fatigue and improves sustained attention.',
        difficulty: 'Medium',
        duration: '25 min',
        steps: ['Eliminate all digital notifications', 'Set a 25-minute timer', 'Focus on ONE task', 'Take a 5-minute sensory reset'],
        metricTarget: 'focusScore'
      });
    }

    // Memory Suggestions
    if (metrics.memoryScore < 70) {
      suggestions.push({
        id: 'loci-method',
        category: 'Memory',
        title: 'Method of Loci (Memory Palace)',
        description: 'Architect a digital spatial map to store complex data vectors.',
        benefit: 'Enhances recall efficiency by leveraging spatial intelligence.',
        difficulty: 'High',
        duration: '15 min',
        steps: ['Visualize a familiar room', 'Identify 5 static locations', 'Place concepts at each location', 'Walk through the room mentally'],
        metricTarget: 'memoryScore'
      });
    }

    // Logic/Reasoning Suggestions
    if (metrics.logicScore < 70) {
      suggestions.push({
        id: 'first-principles',
        category: 'Reasoning',
        title: 'First Principles Deconstruction',
        description: 'Break down complex problems into their foundational truths.',
        benefit: 'Reduces reliance on analogy and improves structural thinking.',
        difficulty: 'High',
        duration: '20 min',
        steps: ['State the problem clearly', 'List all assumptions', 'Drill down to basic truths', 'Rebuild from the ground up'],
        metricTarget: 'logicScore'
      });
    }

    // EQ/Social Suggestions
    if (metrics.eqScore < 70) {
      suggestions.push({
        id: 'active-listening',
        category: 'Social',
        title: 'Active Neural Mirroring',
        description: 'Practice high-fidelity listening to improve social signal processing.',
        benefit: 'Improves empathy markers and verbal recall in social contexts.',
        difficulty: 'Medium',
        duration: 'Ongoing',
        steps: ['Listen without formulating a response', 'Observe micro-expressions', 'Paraphrase back to ensure sync', 'Validate the underlying emotion'],
        metricTarget: 'eqScore'
      });
    }

    // General Wellness
    suggestions.push({
      id: 'digital-minimalism',
      category: 'Neural Hygiene',
      title: 'Digital Fasting',
      description: 'System-wide reset to lower dopamine baseline noise.',
      benefit: 'Increases creative spark and reduces pervasive anxiety.',
      difficulty: 'Low',
      duration: '1 hour',
      steps: ['Disable all screens', 'Engage in low-stimulation activity', 'Observe the "bore-gap"', 'Allow default mode network to activate'],
      metricTarget: 'creativityScore'
    });

    return suggestions;
  };

  const suggestions = getSuggestions();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-accent-purple/10 border border-accent-purple/20">
          <Zap className="w-5 h-5 text-accent-purple" />
        </div>
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Neural Enhancement</h2>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Personalized Growth Vectors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((s) => (
          <motion.div
            key={s.id}
            layout
            className={cn(
              "group p-6 rounded-[2.5rem] border transition-all duration-500 cursor-pointer",
              selectedTask === s.id 
                ? "bg-accent-purple/5 border-accent-purple/30 ring-1 ring-accent-purple/20" 
                : "bg-surface/50 border-white/5 hover:border-white/10"
            )}
            onClick={() => setSelectedTask(selectedTask === s.id ? null : s.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-purple">
                {s.category}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] font-mono text-slate-500">{s.duration}</span>
              </div>
            </div>

            <h3 className="text-lg font-medium text-primary mb-2 group-hover:text-accent-purple transition-colors">
              {s.title}
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {s.description}
            </p>

            <AnimatePresence>
              {selectedTask === s.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Steps</p>
                      {s.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <span className="text-[10px] font-mono text-accent-purple">0{idx + 1}</span>
                          <span className="text-xs text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-accent-purple/10 p-3 rounded-xl flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-accent-purple" />
                      <p className="text-[10px] text-accent-purple font-medium">{s.benefit}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-1 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">
              {selectedTask === s.id ? 'Active Focus' : 'Explore Protocol'}
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
