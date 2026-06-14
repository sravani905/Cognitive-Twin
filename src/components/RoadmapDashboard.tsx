import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Zap, Globe, ExternalLink, Check, Activity, Search, Wifi, WifiOff, BookOpen, Star, Clock, Compass } from 'lucide-react';
import { TechnicalCard } from './GlassCard';
import { cn } from '../lib/utils';

import { DEFAULT_ROADMAP } from '../services/geminiService';
import { getCoursesForCareer, FreeCourse } from '../services/courseSearchService';

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
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [customCourseSearch, setCustomCourseSearch] = useState('');
  const [isSearchingCourses, setIsSearchingCourses] = useState(false);

  // Sync online/offline indicators for dynamic feedback
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  // Fetch courses dynamically based on either current career path or active user search
  const currentCareerForCourses = customCourseSearch.trim() || roadmap.careerTitle;
  const matchedCourses = getCoursesForCareer(currentCareerForCourses);

  // Trigger brief simulation of web parsing when search term changes for elegant micro-loading
  useEffect(() => {
    if (!customCourseSearch) return;
    setIsSearchingCourses(true);
    const timer = setTimeout(() => setIsSearchingCourses(false), 400);
    return () => clearTimeout(timer);
  }, [customCourseSearch]);

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

                  {/* Live Internet-Augmented Free Course Finder block */}
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/5 pb-3">
                      <div>
                        <h4 className="micro-label flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-accent-purple" /> 
                          Verified Free Internet Courses
                        </h4>
                        <p className="text-[10px] text-muted">Direct syllabus access without any API keys</p>
                      </div>

                      {/* Network connection badge */}
                      <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase border tracking-wider",
                        isOnline 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      )}>
                        {isOnline ? (
                          <>
                            <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
                            <span>INDEX DIRECTORY LIVE</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-3 h-3 text-amber-500" />
                            <span>OFFLINE MODE ACTIVE</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Integrated Interactive Course Search Field */}
                    <div className="space-y-2">
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Active Index Target: <span className="font-bold text-accent-purple">"{currentCareerForCourses}"</span>
                      </p>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-muted" />
                        <input
                          type="text"
                          placeholder="Search other careers or topics (e.g., React Developer, Python)..."
                          value={customCourseSearch}
                          onChange={(e) => setCustomCourseSearch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-xs text-primary rounded-xl pl-10 pr-12 py-2.5 focus:outline-none focus:border-accent-purple/50 bg-white/70 shadow-sm"
                        />
                        {customCourseSearch && (
                          <button
                            onClick={() => setCustomCourseSearch('')}
                            className="absolute right-3 top-2.5 text-[10px] font-bold text-muted hover:text-red-500 uppercase tracking-widest cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 h-[320px] overflow-y-auto pr-1 select-text">
                      <AnimatePresence mode="wait">
                        {isSearchingCourses ? (
                          <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center py-10 space-y-2 text-center"
                          >
                            <RefreshCw className="w-6 h-6 text-accent-purple animate-spin" />
                            <span className="text-[10px] font-mono text-slate-400">Querying Open-Education Indexes...</span>
                          </motion.div>
                        ) : matchedCourses.length > 0 ? (
                          <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3.5"
                          >
                            {matchedCourses.map((course: FreeCourse, i: number) => {
                              // Custom dynamic colors based on provider
                              const providerColors: Record<string, string> = {
                                'freeCodeCamp': 'bg-green-150 text-emerald-700 border-green-200',
                                'Kaggle': 'bg-blue-150 text-blue-700 border-blue-200',
                                'Coursera': 'bg-indigo-150 text-indigo-700 border-indigo-200',
                                'edX': 'bg-purple-150 text-purple-700 border-purple-200',
                                'YouTube': 'bg-red-150 text-red-700 border-red-200',
                                'Google': 'bg-sky-150 text-sky-700 border-sky-200',
                                'MIT OCW': 'bg-amber-150 text-amber-700 border-amber-200',
                                'Harvard': 'bg-rose-150 text-rose-700 border-rose-200',
                                'Other': 'bg-slate-150 text-slate-700 border-slate-200',
                              };
                              return (
                                <div
                                  key={i}
                                  className="p-4 rounded-2xl border border-slate-100 bg-white/60 hover:bg-white transition-all shadow-sm hover:shadow flex flex-col gap-3 group border-l-2 border-l-accent-purple"
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className={cn(
                                          "px-2 py-0.5 rounded text-[8px] font-bold font-mono border",
                                          providerColors[course.provider] || providerColors['Other']
                                        )}>
                                          {course.provider}
                                        </span>
                                        {course.duration && (
                                          <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-zinc-400" /> {course.duration}
                                          </span>
                                        )}
                                        {course.rating && (
                                          <span className="text-[9px] text-[#cca000] font-mono flex items-center gap-0.5">
                                            <Star className="w-3 h-3 fill-current" /> {course.rating}
                                          </span>
                                        )}
                                      </div>
                                      <h5 className="text-xs font-bold text-[#1a1738] group-hover:text-accent-purple transition-colors leading-snug">
                                        {course.title}
                                      </h5>
                                    </div>

                                    <a
                                      href={course.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-slate-50 group-hover:bg-accent-purple group-hover:text-white rounded-xl transition-all cursor-pointer flex-shrink-0"
                                      title={`Go to ${course.provider} course portal`}
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  </div>

                                  {/* Direct Skills Covered List tags */}
                                  {course.skillsCovered && course.skillsCovered.length > 0 && (
                                    <div className="flex flex-wrap gap-1 border-t border-slate-50 pt-2.5">
                                      {course.skillsCovered.map((skill, sIdx) => (
                                        <span key={sIdx} className="px-1.5 py-0.5 bg-slate-50 text-zinc-500 rounded text-[8px] font-mono">
                                          #{skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </motion.div>
                        ) : (
                          <div className="py-12 text-center text-muted text-xs">
                            No courses discovered for "{currentCareerForCourses}".
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Standard curriculum resources accessible below */}
                    <div className="pt-4 border-t border-slate-100">
                      <p className="micro-label text-zinc-400 mb-2">Original Target Milestones</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(currentPhase?.resources || currentPhase?.freeResources || []).map((res: string, i: number) => (
                          <a
                            key={i}
                            href={`https://www.google.com/search?q=${encodeURIComponent(res + " free course study manual")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg text-[9px] font-mono text-zinc-500 flex items-center gap-1 group transition-all"
                          >
                            <span>{res}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-zinc-400 group-hover:text-primary" />
                          </a>
                        ))}
                      </div>
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
