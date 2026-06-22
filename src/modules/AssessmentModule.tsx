import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Onboarding, ContextForm } from '../components/Onboarding';
import { TechnicalCard } from '../components/GlassCard';
import { MeshBrain } from '../components/Branding';
import { cn } from '../lib/utils';
import { tests } from '../constants/tests';
import { Difficulty } from '../types';

interface AssessmentModuleProps {
  step: string;
  testIndex: number;
  difficulty: Difficulty;
  metrics: any;
  onStartContext: () => void;
  onCompleteContext: (ctx: any) => void;
  onTestComplete: (score: number) => void;
  onShowAbout?: () => void;
  onBackToLanding?: () => void;
}

export const AssessmentModule: React.FC<AssessmentModuleProps> = ({
  step,
  testIndex,
  difficulty,
  metrics,
  onStartContext,
  onCompleteContext,
  onTestComplete,
  onShowAbout,
  onBackToLanding,
}) => {
  if (step === 'onboarding') {
    return (
      <motion.div
        key="onboarding"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
      >
        <Onboarding onStart={onStartContext} onShowAbout={onShowAbout} onBackToLanding={onBackToLanding} />
      </motion.div>
    );
  }

  if (step === 'context') {
    return (
      <motion.div
        key="context"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <ContextForm onComplete={onCompleteContext} onShowAbout={onShowAbout} onBackToLanding={onBackToLanding} />
      </motion.div>
    );
  }

  if (step === 'testing') {
    // Handler to skip current test and auto-assign a realistic score
    const handleSkipTest = () => {
      const generatedScore = Math.floor(Math.random() * 20) + 75; // Generates a solid 75-95 score
      onTestComplete(generatedScore);
    };

    // Handler to fast-track all remaining tests and jump straight to the dashboard
    const handleFastTrackAll = () => {
      onTestComplete(-1); // Sent as a flag to indicate fast-tracking the remaining assessment
    };

    return (
      <motion.div
        key="testing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto space-y-10 py-6"
      >
        {/* Dynamic, High-Fidelity Test Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white/70 backdrop-blur-xl border border-white/80 p-8 rounded-[2rem] shadow-lg shadow-[#8A2BE2]/5 gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold text-[#8c78a5] uppercase tracking-widest bg-gradient-to-r from-[#8A2BE2]/10 to-[#9979f4]/10 border border-[#8A2BE2]/15 px-4.5 py-1.5 rounded-full inline-block">
                Onboarding Phase {testIndex + 1} of {tests.length}
              </p>
              {onBackToLanding && (
                <button
                  onClick={onBackToLanding}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/70 hover:bg-white active:scale-95 text-[#8A2BE2] text-[9px] font-bold uppercase tracking-widest border border-purple-100/40 rounded-full transition-all duration-200 cursor-pointer shadow-sm shrink-0"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Landing Page
                </button>
              )}
            </div>
            <h2 className="text-3xl font-serif italic text-[#322851] tracking-tight font-normal">{tests[testIndex].label}</h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold text-[#8c78a5] tracking-widest">Selected Mode:</span>
              <span className={cn(
                "text-[10px] font-mono font-bold uppercase tracking-widest px-3.5 py-1 border rounded-full",
                difficulty === 'challenging' ? "text-purple-600 border-purple-200 bg-purple-50" : 
                difficulty === 'gentle' ? "text-emerald-600 border-emerald-200 bg-emerald-50" : 
                "text-indigo-600 border-indigo-200 bg-indigo-50"
              )}>{difficulty}</span>
            </div>
            
            {/* Visual Progress Steps Map */}
            <div className="flex gap-1.5 w-full md:w-auto justify-start md:justify-end overflow-x-auto py-1 max-w-xs md:max-w-md no-scrollbar">
              {tests.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300", 
                    i === testIndex ? "bg-[#8A2BE2] w-6" : 
                    i < testIndex ? "bg-[#8A2BE2]/50 w-2.5" : "bg-purple-100 w-1.5"
                  )} 
                  title={tests[i].label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* The Testing Stage Card */}
        <TechnicalCard className="min-h-[550px] flex items-center justify-center relative overflow-hidden bg-white/75 border border-white/80 p-6 md:p-12 shadow-2xl shadow-[#8A2BE2]/10 rounded-[2.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={testIndex}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              {React.createElement(tests[testIndex].component, { 
                onComplete: onTestComplete, 
                difficulty,
                userProfile: metrics
              })}
            </motion.div>
          </AnimatePresence>
        </TechnicalCard>

        {/* Elegant UX Bystep Controller Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f8f4fb]/85 border border-purple-100/50 p-6 rounded-[2rem] shadow-sm">
          <div className="text-center sm:text-left">
            <p className="text-xs font-serif italic text-[#322851] font-semibold">Testing take too long?</p>
            <p className="text-[10px] text-[#8c78a5] tracking-wide mt-0.5">You can skip the current module or instantly auto-configure your entire profile.</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto justify-center">
            <button
              onClick={handleSkipTest}
              className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest font-sans rounded-full bg-white text-[#6a427f] border border-purple-200 hover:bg-[#ebdff2] active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              Skip Module
            </button>
            <button
              onClick={handleFastTrackAll}
              className="px-7 py-3 text-[10px] font-bold uppercase tracking-widest font-sans rounded-full text-white bg-gradient-to-r from-[#8A2BE2] to-[#9979f4] hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
            >
              Fast-Track to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (step === 'analyzing') {
    return (
      <motion.div
        key="analyzing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 max-w-xl mx-auto space-y-12"
      >
        <div className="relative">
          <div className="w-32 h-32 border border-purple-100/40 rounded-full flex items-center justify-center p-8 relative shadow-lg shadow-purple-600/5 bg-white">
            <MeshBrain className="w-16 h-16 animate-pulse text-[#8A2BE2] absolute opacity-40" />
            <RefreshCw className="w-10 h-10 text-[#8A2BE2] animate-spin relative z-10" />
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-indigo-500 border border-white animate-pulse" />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-serif italic text-primary">Synthesizing Neural Data</h2>
          <p className="micro-label font-mono text-[10px] text-accent-purple bg-accent-purple/5 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
            Dual-Pipeline Cognitive Analytics
          </p>
          <div className="max-w-md mx-auto space-y-3 pt-6 text-left">
            <div className="flex items-center gap-4 bg-white/80 border border-purple-100/70 rounded-2xl p-4 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center font-mono text-xs font-bold text-indigo-600 shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#322851] uppercase tracking-wider font-mono">Local Prediction Engine</h4>
                <p className="text-[11px] text-[#6d6b87] mt-0.5">Computing KNN Career Projections & Cognitive Rule Sets</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/80 border border-purple-100/70 rounded-2xl p-4 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center font-mono text-xs font-bold text-purple-600 shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#322851] uppercase tracking-wider font-mono">Gemini AI Pipeline</h4>
                <p className="text-[11px] text-[#6d6b87] mt-0.5">Synthesizing Custom Narrative Growth Insights & Detailed Roadmaps</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};
